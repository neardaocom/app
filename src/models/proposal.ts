import { toSearch } from '@/utils/string'
import { parseNanoseconds, toTimeString } from "@/utils/date";
import Decimal from "decimal.js";
import { yoctoNear } from "@/services/nearService/constants";
import { trans as groupTrans } from "@/models/group";
import _ from "lodash"
import loFind from "lodash/find";
import lodashToNumber from "lodash/toNumber"
import { UnsupportedError } from '@/utils/error'
import Auction from "@/models/auction"
import { getValueById } from "@/types/generic";
import { DAODocs, DAOProposal, DAORights, DAOTokenHolder } from '@/types/dao';
import { findParam } from '@/utils/collection'
import { WFSettings, WFTemplate } from '@/types/workflow';
import { check } from './rights';
import moment from 'moment';
import { accounts } from '@/data/blockchain';
import { convertArrayOfObjectToObject } from "@/utils/array";
import { getValueByCode } from "@/types/generic";
import { yoctoToNear } from '@/utils/near';

const voteMapper = { 0: 0, 1: 0, 2: 0 };
const statusBgMapper = {
    in_progress: 'primary',
    executing: 'danger',
    accepted: 'success',
    rejected: 'danger',
    spam: 'dark',
    invalid: 'warning',
};


const getActionType = (action: string) => {
    let type = "";
    switch (action) {
      case "Pay":
        type = "payout";
        break;
      case "AddMember":
        type = "add_member";
        break;
      case "RemoveMember":
        type = "remove_member";
        break;
      case "GeneralProposal":
        type = "general_proposal";
        break;
      case "AddFile":
        type = "add_doc_file";
        break;
      case "InvalidateFile":
        type = "invalidate_file";
        break;
      case "DistributeFT":
        type = "distribute_ft";
        break;
      case "AddRightsForActionGroup":
        type = 'add_rights_for_action';
        break;
      default:
        throw new UnsupportedError('Undefined action type: ' + action)
    }
    return type;
};

const getState = (state: string) => {
    let value = "-" + state + "-"
    switch (state) {
      case 'InProgress':
        value = 'in_progress'
        break;
      case 'Accepted':
        value = 'accepted'
        break;
      case 'Rejected':
        value = 'rejected'
        break;
      case 'Spam':
        value = 'spam'
        break;
      case 'Invalid':
        value = 'invalid'
        break;
      default:
        break;
    }
    return value
}

const getVotingStats = (proposal: DAOProposal, tokenHolders: DAOTokenHolder[], tokenBlocked: number) => {
    //console.log(token_holders, token_blocked)
    const results = _.clone(voteMapper)
    //console.log(results)
    Object.keys(proposal.votes).forEach((voter: string) => {
      switch (_.toInteger(proposal.votes[voter])) {
        case 0:
          results[0] += lodashToNumber(findParam(tokenHolders, {'accountId': voter}, ['amount'])) ?? 0;
          break;
        case 1:
          results[1] += lodashToNumber(findParam(tokenHolders, {'accountId': voter}, ['amount'])) ?? 0;
          break;
        case 2:
          results[2] += lodashToNumber(findParam(tokenHolders, {'accountId': voter}, ['amount'])) ?? 0;
          break;
        default:
          throw new UnsupportedError('Undefined voting stat: ' + _.toInteger(proposal.votes[voter]))
      }
    });

    return [
        {
            choice: "yes",
            percent: new Decimal(results[1]).div(tokenBlocked).times(100).round().toNumber(),
            amount: new Decimal(results[1]).toNumber(),
            bg: "success",
        },
        {
            choice: "no",
            percent: new Decimal(results[2]).div(tokenBlocked).times(100).round().toNumber(),
            amount: new Decimal(results[2]).toNumber(),
            bg: "danger",
        },
    // {choice: 'spam', percent: new Decimal(results[0]).div(this.token_blocked).times(100).round().toNumber(), bg: 'black'}
    // {choice: this.choice(), percent: 20}
    ];
}

const getDurationTo = (proposal: DAOProposal, settings: WFSettings): Date => moment(proposal.created).toDate(); // TODO: ADD duration .add(settings.voteLevel.duration)

const isOver = (proposal: DAOProposal, settings: WFSettings): boolean => {
    if (proposal.state === "InProgress") {
      const end = getDurationTo(proposal, settings).valueOf();
      const now = new Date().valueOf();
      return now > end;
    }
    return false;
};

const getChoice = (proposal: DAOProposal, accountId: string): string => {
    let kind_to_choice = "";
    switch (loFind(proposal.votes, {accountId: accountId})?.vote) {
      case 0:
        kind_to_choice = "spam";
        break;
      case 1:
        kind_to_choice = "yes";
        break;
      case 2:
        kind_to_choice = "no";
        break;
      default:
        break;
    }
    return kind_to_choice;
};

const getArgs = (proposal: DAOProposal, templateCode: string): Record<string, unknown> => {
  let values: Record<string, unknown> = {}
  switch (templateCode) {
    case 'wf_near_send':
      values = {
        receiverId: getValueByCode(proposal.inputs, 'receiverId'),
        amount: yoctoToNear(getValueByCode(proposal.inputs, 'amount') ?? ''),
      }
      break;
    default:
      break;
  }
  return values;
}

const getProgress = (status: string, settings: WFSettings, durationTo: Date): number => {
    let progress: number = 0;
    if (status === "InProgress") {
      const end = durationTo.valueOf();
      const now = new Date().valueOf();
      const duration = new Decimal(settings.voteLevel.duration.days).div(1_000_000).toNumber() // TODO: settings.voteLevel.duration >>
      const begin = new Decimal(durationTo.valueOf()).minus(duration).toNumber()
      const nowFromBegin = now - begin;
      const endFromBegin = end - begin;
      // console.log('Progress values: ', begin, now, end);
      if (endFromBegin >= 0) {
        progress = new Decimal(nowFromBegin).div(endFromBegin).times(10_000).round().div(100).toNumber()
      }
    }
    return progress
};

const isVoted = (proposal: DAOProposal, accountId: string): boolean => Object.keys(proposal.votes).includes(accountId);

const transform = (
  proposal: DAOProposal,
  template: WFTemplate,
  tokenHolders: DAOTokenHolder[],
  tokenBlocked: number,
  walletId: string,
  walletRights: DAORights[],
  daoRights: DAORights[],
  t: any,
  d: any
) => {
  // console.log(template)
    const settings = loFind(template.settings, {id: proposal.settingsId})
    const args = getArgs(proposal, template.code)
    const stateIndex = getState(proposal.state)
    const durationTo = getDurationTo(proposal, settings!)
    console.log(durationTo)
    const status = proposal.state
    const choiceIndex = getChoice(proposal, walletId)
    const config = null //_.get(vote_policies, [actionKey]) || _.get(vote_policies, ['Pay'])  // TODO: rewrite, Hack Pay => SendNear
    const trans = {
        id: proposal.id,
        code: template.code,
        title: t('default.wf_templ_' + template.code + '_title', args),
        description: t('default.wf_templ_' + template.code + '_description', args),
        typeIndex: template.id,
        type: t('default.wf_templ_' + template.code),
        stateIndex: stateIndex,
        state: t("default.proposal_state_" + stateIndex),
        status: status,
        canVote: check(walletRights, daoRights),
        isOver: isOver(proposal, settings!),
        isVoted: isVoted(proposal, walletId),
        args: args,
        votingStats: getVotingStats(proposal, tokenHolders, tokenBlocked),
        duration: {
            value: durationTo, // TODO: Rewrite to END
            date: d(durationTo),
            time: toTimeString(durationTo),
        },
        config: config,
        choiceIndex: choiceIndex,
        choice: (choiceIndex) ? t("default.vote_type_" + choiceIndex) : null,
        progress: getProgress(status, settings!, durationTo),
        quorum: settings?.voteLevel.quorum,
        search: '',
    }
    trans.search = [toSearch(trans.title), toSearch(trans.description), toSearch(trans.duration.date), toSearch(trans.duration.time), toSearch(trans.type), toSearch(trans.state)].join('-')
    // console.log(trans)
    return trans
};

export {
    transform, voteMapper, statusBgMapper, getProgress
}