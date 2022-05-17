import StringHelper from '@/models/utils/StringHelper'
import DateHelper from "@/models/utils/DateHelper";
import Decimal from "decimal.js";
import _ from "lodash"
import loFind from "lodash/find";
import loGet from "lodash/get";
import loToNumber from "lodash/toNumber"
import { UnsupportedError } from '@/models/utils/errors'
import Auction from "@/models/auction"
import { DAODocs, DAOProposal, DAORights, DAOTokenHolder } from '@/models/dao/types/dao';
import CollectionHelper from '@/models/utils/CollectionHelper'
import { WFSettings, WFTemplate } from '@/models/dao/types/workflow';
import Rights from './dao/Rights';
import moment from 'moment';
import GenericsHelper from "@/models/utils/GenericsHelper";
import Utils from '@/models/nearBlockchain/Utils';
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
    icon: 'bi bi-Rights.check-circle me-2',
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
          results[0] += loToNumber(CollectionHelper.findParam(tokenHolders, {'accountId': voter}, ['amount'])) ?? 0;
          break;
        case 1:
          results[1] += loToNumber(CollectionHelper.findParam(tokenHolders, {'accountId': voter}, ['amount'])) ?? 0;
          break;
        case 2:
          results[2] += loToNumber(CollectionHelper.findParam(tokenHolders, {'accountId': voter}, ['amount'])) ?? 0;
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

const getDurationTo = (proposal: DAOProposal, settings: WFSettings): Date => GenericsHelper.addInterval(proposal.created, settings.voteLevel.duration);

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
        receiverId: GenericsHelper.getValueByCode(proposal.inputs, 'receiverId') ?? '',
        amount: Utils.yoctoToNear(GenericsHelper.getValueByCode(proposal.inputs, 'amount') ?? ''),
      }
      break;
    case 'wf_treasury_send_ft':
      values = {
        receiverId: GenericsHelper.getValueByCode(proposal.inputs, 'receiverId') ?? '',
        amount: GenericsHelper.getValueByCode(proposal.inputs, 'amount') ?? '',
      }
      break;
    case 'wf_add': {
        const templateId = loToNumber(GenericsHelper.getValueByCode(proposal.inputs, 'templateId'))
        const templateMeta = loFind(templateMetas, {id: templateId})
        values = {
          templateId: templateId,
          template: t('default.wf_templ_' + templateMeta?.code),
        }
        break;
    }
    case 'wf_media_add': {
      values = proposal.content.Media as Record<string, unknown> ?? {}
      if (loGet(proposal, ['content', 'Media', 'media_type', 'Link']) !== undefined) {
        values.source = loGet(proposal, ['content', 'Media', 'media_type', 'Link'])
      }
      if (loGet(proposal, ['content', 'Media', 'media_type', 'Text']) !== undefined) {
        values.source = loGet(proposal, ['content', 'Media', 'media_type', 'Text'])
      }
      break;
    }
    case 'wf_bounty':
        values = {
          title: GenericsHelper.getValueByCode(proposal.inputs, 'title') ?? '',
          amount: Utils.yoctoToNear(GenericsHelper.getValueByCode(proposal.inputs, 'amount') ?? ''),
          deposit: Utils.yoctoToNear(GenericsHelper.getValueByCode(proposal.inputs, 'deposit') ?? ''),
        }
        break;
    case 'wf_skyward':
        values = {
          amount: n(loToNumber(GenericsHelper.getValueByCode(proposal.inputs, 'amount') ?? '-amount-')),
          title: GenericsHelper.getValueByCode(proposal.inputs, 'title') ?? '-SALE-',
          tokenId: GenericsHelper.getValueByCode(proposal.inputs, 'tokenId') ?? '-tokenId-',
          startAt: d(DateHelper.parseNanoseconds(GenericsHelper.getValueByCode(proposal.inputs, 'startAt') ?? 0)),
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
      const begin = GenericsHelper.subtractInterval(durationTo, settings.voteLevel.duration).valueOf()
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
        canVote: Rights.check(walletRights, [settings!.voteRight]),
        isOver: isOver(proposal, settings!),
        isVoted: isVoted(proposal, walletId),
        args: args,
        votingStats: getVotingStats(proposal, tokenHolders, tokenBlocked),
        duration: {
            value: durationTo, // TODO: Rewrite to END
            date: d(durationTo),
            time: DateHelper.toTimeString(durationTo),
        },
        config: config,
        choiceIndex: choiceIndex,
        choice: (choiceIndex) ? t("default.vote_type_" + choiceIndex) : null,
        progress: getProgress(status, settings!, durationTo),
        quorum: settings?.voteLevel.quorum,
        search: '',
        templateSettings: settings,
    }
    trans.search = [StringHelper.toSearch(trans.title), StringHelper.toSearch(trans.description), StringHelper.toSearch(trans.duration.date), StringHelper.toSearch(trans.duration.time), StringHelper.toSearch(trans.type), StringHelper.toSearch(trans.state)].join('-')
    // console.log(trans)
    return trans
};

export {
    transform, voteMapper, workflowCodeBgMapper, getProgress, getWorkflowCode, getArgs, generateStorageKey
}