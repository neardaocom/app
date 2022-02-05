import { toSearch } from '@/utils/string'
import { parseNanoseconds, toTimeString } from "@/utils/date";
import Decimal from "decimal.js";
import { yoctoNear } from "@/services/nearService/constants";
import { trans as groupTrans } from "@/models/group";
import _ from "lodash"
import lodashToNumber from "lodash/toNumber"
import { UnsupportedError } from '@/utils/error'
import Auction from "@/models/auction"
import { getValueById } from "@/types/generic";
import { DAOTokenHolder } from '@/types/dao';
import { findParam } from '@/utils/collection'

const voteMapper = { 0: 0, 1: 0, 2: 0 };
const statusBgMapper = {
    in_progress: 'primary',
    executing: 'danger',
    accepted: 'success',
    rejected: 'danger',
    spam: 'dark',
    invalid: 'warning',
};

const getAction = (proposal: any) => proposal.transactions.actions[0];

const getActionKey = (action: any): string => {
  return Object.keys(action)[0]
}


const getActionType = (action: any) => {
    let type = "";
    switch (getActionKey(action)) {
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
        throw new UnsupportedError('Undefined action type: ' + getActionKey(action))
    }
    return type;
};

const getState = (proposal: any, isOver: boolean) => {
    let state = ""
    if (proposal.status === 'InProgress' && isOver === false) {
        state = 'in_progress'
    } else if (proposal.status === 'InProgress' && isOver === true) {
        state = 'executing'
    } else if (proposal.status === 'Accepted') {
        state = 'accepted'
    } else if (proposal.status === 'Rejected') {
        state = 'rejected'
    } else if (proposal.status === 'Spam') {
        state = 'spam'
    } else if (proposal.status === 'Invalid') {
        state = 'invalid'
    }
    return state
}

const getArgsFromAction = (action: any, docs: any, t: any) => {
    let args = {};
    const action_key = getActionKey(action);
    switch (action_key) {
      case "Pay":
        args = {
          account: action.SendNear.account_id,
          amount: new Decimal(action.SendNear.amount_near)
            .div(yoctoNear)
            .toFixed(),
        };
        break;
      case "AddMember":
        args = {
          account: action.AddMember.account_id,
          group: groupTrans(action.AddMember.group, t),
        };
        break;
      case "RemoveMember":
        args = {
          account: action.RemoveMember.account_id,
          group: groupTrans(action.RemoveMember.group, t),
        };
        break;
      case "GeneralProposal":
        args = {
          title: action.GeneralProposal.title
        };
        break;
      case "AddFile":
        args = {
          name: action.AddFile.metadata.Curr.name,
          ipfs_cid: action.AddFile.cid,
          category:
            action.AddFile.new_category || docs.categories[action.AddFile.metadata.Curr.category].value,
        };
        break;
      case "InvalidateFile":
        {
          const doc_file = docs.files.find(
            (elem: any) => elem.address == action.InvalidateFile.uuid
          );
          args = {
            name: doc_file.name,
            category: doc_file.category,
          };
        }
        break;
      case 'DistributeFT':
        args = {
          amount: new Decimal(action.DistributeFT.amount),
          group: t('default.' + action.DistributeFT.from_group.toLowerCase()),
          accounts: action.DistributeFT.accounts.join(', '),
        };
        break;
      case 'AddRightsForActionGroup':
        args = {
          group: t('default.' + action.AddRightsForActionGroup.to.Group.value.toLowerCase()),
          time_from: (action.AddRightsForActionGroup.time_from > 0) ? action.AddRightsForActionGroup.time_from : null,
          time_to: (action.AddRightsForActionGroup.time_to > 0) ? action.AddRightsForActionGroup.time_to : null,
          rights: action.AddRightsForActionGroup.rights.map( value => t('default.' + Auction.getTranslateKey(value))).join(', '),
        };
        break;
      default:
        throw new UnsupportedError('Undefined action type: ' + action_key)
    }
    return args;
};

const getVotingStats = (proposal: any, tokenHolders: DAOTokenHolder[], token_blocked: any) => {
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
            percent: new Decimal(results[1]).div(token_blocked).times(100).round().toNumber(),
            amount: new Decimal(results[1]).toNumber(),
            bg: "success",
        },
        {
            choice: "no",
            percent: new Decimal(results[2]).div(token_blocked).times(100).round().toNumber(),
            amount: new Decimal(results[2]).toNumber(),
            bg: "danger",
        },
    // {choice: 'spam', percent: new Decimal(results[0]).div(this.token_blocked).times(100).round().toNumber(), bg: 'black'}
    // {choice: this.choice(), percent: 20}
    ];
}

const getDurationTo = (proposal: any) => parseNanoseconds(proposal.duration_to);

const getOver = (proposal: any): boolean => {
    if (proposal.status === "InProgress") {
      const end = getDurationTo(proposal).valueOf();
      const now = new Date().valueOf();
      return now > end;
    }
    return false;
};

const getChoice = (proposal: any, accountId: string): string => {
    let kind_to_choice = "";
    switch (proposal.votes[accountId]) {
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

const getProgress = (status: string, config: any, durationTo: Date): number => {
    let progress: number = 0;
    if (status === "InProgress") {
      const end = durationTo.valueOf();
      const now = new Date().valueOf();
      const duration = new Decimal(_.get(config, ['duration'])).div(1_000_000).toNumber()
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

const isVoted = (proposal: any, accountId: string): boolean => Object.keys(proposal.votes).includes(accountId);

const transform = (proposal: any, vote_policies: any, docs: any, tokenHolders: DAOTokenHolder[], token_blocked: number, accountId: string, accountRole: string, t: any, d: any) => {
    const action = getAction(proposal[1].Curr)
    const actionType = getActionType(action)
    const actionKey = getActionKey(action)
    const durationTo = getDurationTo(proposal[1].Curr)
    const status = proposal[1].Curr.status
    const isOver = getOver(proposal[1].Curr)
    const stateIndex = getState(proposal[1].Curr, isOver)
    const args = getArgsFromAction(action, docs, t)
    const choiceIndex = getChoice(proposal[1].Curr, accountId)
    const config = null //_.get(vote_policies, [actionKey]) || _.get(vote_policies, ['Pay'])  // TODO: rewrite, Hack Pay => SendNear
    const trans = {
        id: proposal[0],
        key: actionKey,
        index: proposal[1].Curr.uuid,
        title: t('default.' + actionType + '_message', args),
        description: proposal[1].Curr.description,
        typeIndex: actionType,
        type: t("default." + getActionType(action)),
        stateIndex: stateIndex,
        state: t("default.vote_status_" + stateIndex),
        status: status,
        canVote: accountRole !== 'guest',
        isOver: isOver,
        isVoted: isVoted(proposal[1].Curr, accountId),
        args: args,
        votingStats: getVotingStats(proposal[1].Curr, tokenHolders, token_blocked),
        duration: {
            value: durationTo,
            date: d(durationTo),
            time: toTimeString(durationTo),
        },
        config: config,
        choiceIndex: choiceIndex,
        choice: (choiceIndex) ? t("default.vote_type_" + choiceIndex) : null,
        progress: getProgress(status, config, durationTo),
        quorum: proposal[1].Curr.quorum,
        search: '',
    }
    trans.search = [toSearch(trans.title), toSearch(trans.description), toSearch(trans.duration.date), toSearch(trans.duration.time), toSearch(trans.type), toSearch(trans.state)].join('-')
    // console.log(trans)
    return trans
};

export {
    transform, voteMapper, statusBgMapper, getProgress
}