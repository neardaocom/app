import { toSearch } from '@/utils/string'
import { parseNanoseconds, toTimeString } from "@/utils/date";
import Decimal from "decimal.js";
import { yoctoNear } from "@/services/nearService/constants";
import { trans as groupTrans } from "@/models/group";
import _ from "lodash"
import loFind from "lodash/find";
import loGet from "lodash/get";
import loToNumber from "lodash/toNumber"
import { UnsupportedError } from '@/utils/error'
import Auction from "@/models/auction"
import { DAODocs, DAOProposal, DAORights, DAOTokenHolder } from '@/types/dao';
import { findParam } from '@/utils/collection'
import { WFSettings, WFTemplate } from '@/types/workflow';
import { check } from './rights';
import moment from 'moment';
import { accounts } from '@/data/blockchain';
import { convertArrayOfObjectToObject } from "@/utils/array";
import { getValueById, getValueByCode, addInterval, subtractInterval } from "@/utils/generics";
import { yoctoToNear } from '@/utils/near';
import { templateMetas } from "@/data/workflow";

const voteMapper = { 0: 0, 1: 0, 2: 0 };

const getStateCode = (state: string): string => {
    let value: string = "-" + state + "-"
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

const getWorkflowCode = (state: string, progress: number): string => {
  let code: string = ''
  if (state === 'InProgress' && progress < 100) {
    code = 'in_progress'
  } else if (state === 'InProgress') {
    code = 'finishing'
  } else if (state === 'Accepted') {
    code = 'accepted'
  } else if (state === 'Rejected') {
    code = 'rejected'
  } else if (state === 'Spam') {
    code = 'spam'
  } else if (state === 'Invalid') {
    code = 'invalid'
  }

  return code
}

const workflowCodeBgMapper = {
  in_progress: {
    color: 'primary',
    icon: 'bi bi-bar-chart me-2',
  },
  finishing: {
    color: 'danger',
    icon: 'bi bi-play-circle me-2',
  },
  accepted: {
    color: 'success',
    icon: 'bi bi-check-circle me-2',
  },
  rejected: {
    color: 'danger',
    icon: 'bi bi-x-circle me-2',
  },
  spam: {
    color: 'dark',
    icon: 'bi bi-trash-2 me-2',
  },
  invalid: {
    color: 'warning',
    icon: '',
  },
};

const generateStorageKey = (proposalCount?: number) => {
    if (proposalCount) {
      return proposalCount + 1
    } else {
      return moment().valueOf()
    }
}


const getVotingStats = (proposal: DAOProposal, tokenHolders: DAOTokenHolder[], tokenBlocked: number) => {
    //console.log(token_holders, token_blocked)
    const results = _.clone(voteMapper)
    //console.log(results)
    Object.keys(proposal.votes).forEach((voter: string) => {
      switch (_.toInteger(proposal.votes[voter])) {
        case 0:
          results[0] += loToNumber(findParam(tokenHolders, {'accountId': voter}, ['amount'])) ?? 0;
          break;
        case 1:
          results[1] += loToNumber(findParam(tokenHolders, {'accountId': voter}, ['amount'])) ?? 0;
          break;
        case 2:
          results[2] += loToNumber(findParam(tokenHolders, {'accountId': voter}, ['amount'])) ?? 0;
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
            bg: "primary",
        },
        {
            choice: "no",
            percent: new Decimal(results[2]).div(tokenBlocked).times(100).round().toNumber(),
            amount: new Decimal(results[2]).toNumber(),
            bg: "muted",
        },
    // {choice: 'spam', percent: new Decimal(results[0]).div(this.token_blocked).times(100).round().toNumber(), bg: 'black'}
    // {choice: this.choice(), percent: 20}
    ];
}

const getDurationTo = (proposal: DAOProposal, settings: WFSettings): Date => addInterval(proposal.created, settings.voteLevel.duration);

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
    switch (loGet(proposal.votes, [accountId])) {
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

const getArgs = (proposal: DAOProposal, templateCode: string, t: Function, d: Function, n: Function): Record<string, unknown> => {
  let values: Record<string, unknown> = {}
  // console.log(proposal, templateCode)
  switch (templateCode) {
    case 'wf_near_send':
      values = {
        receiverId: getValueByCode(proposal.inputs, 'receiverId') ?? '',
        amount: yoctoToNear(getValueByCode(proposal.inputs, 'amount') ?? ''),
      }
      break;
    case 'wf_add': {
        const templateId = loToNumber(getValueByCode(proposal.inputs, 'templateId'))
        const templateMeta = loFind(templateMetas, {id: templateId})
        values = {
          templateId: templateId,
          template: t('default.wf_templ_' + templateMeta?.code),
        }
        break;
    }
    case 'wf_bounty':
        values = {
          title: getValueByCode(proposal.inputs, 'title') ?? '',
          amount: yoctoToNear(getValueByCode(proposal.inputs, 'amount') ?? ''),
          deposit: yoctoToNear(getValueByCode(proposal.inputs, 'deposit') ?? ''),
        }
        break;
    case 'wf_skyward':
        values = {
          amount: n(loToNumber(getValueByCode(proposal.inputs, 'amount') ?? '-amount-')),
          title: getValueByCode(proposal.inputs, 'title') ?? '-SALE-',
          tokenId: getValueByCode(proposal.inputs, 'tokenId') ?? '-tokenId-',
          startAt: d(parseNanoseconds(getValueByCode(proposal.inputs, 'startAt') ?? 0)),
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
      const begin = subtractInterval(durationTo, settings.voteLevel.duration).valueOf()
      const nowFromBegin = now - begin;
      const endFromBegin = end - begin;
      // console.log('Progress values:', begin, now, end);
      if (end - now < 0) {
        progress = 100
      } else if (now - begin < 0) {
        progress = 0
      } else {
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
  t: Function,
  d: Function,
  n: Function
) => {
  // console.log(template)
    const settings = loFind(template.settings, {id: proposal.settingsId})
    const args = getArgs(proposal, template.code, t, d, n)
    const stateCode = getStateCode(proposal.state)
    const durationTo = getDurationTo(proposal, settings!)
    // console.log(durationTo)
    const status = proposal.state
    const choiceIndex = getChoice(proposal, walletId)
    const config = null //_.get(vote_policies, [actionKey]) || _.get(vote_policies, ['Pay'])  // TODO: rewrite, Hack Pay => SendNear
    const trans = {
        id: proposal.id,
        code: template.code,
        title: t('default.wf_templ_' + template.code + '_title', args),
        description: '', // TODO: From IPFS
        typeCode: template.code,
        type: t('default.wf_templ_' + template.code),
        stateCode: stateCode,
        state: t("default.proposal_state_" + stateCode),
        status: status,
        canVote: check(walletRights, [settings!.voteRight]),
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
        templateSettings: settings,
    }
    trans.search = [toSearch(trans.title), toSearch(trans.description), toSearch(trans.duration.date), toSearch(trans.duration.time), toSearch(trans.type), toSearch(trans.state)].join('-')
    // console.log(trans)
    return trans
};

export {
    transform, voteMapper, workflowCodeBgMapper, getProgress, getWorkflowCode, getArgs, generateStorageKey
}