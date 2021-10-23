import { toSearch } from '@/utils/string'
import { parseFromNanoseconds, toDateString, toTimeString } from "@/utils/date";
import Decimal from "decimal.js";
import { yoctoNear } from "@/services/nearService/constants";
import { trans as groupTrans } from "@/models/group";
import _ from "lodash"

const voteMapper = { 0: 0, 1: 0, 2: 0 };
const statusBgMapper = {
    in_progress: 'primary',
    executing: 'danger',
    accepted: 'success',
    rejected: 'danger',
    spam: 'dark',
    invalid: 'warning',
};

const getAction = (proposal) => proposal.transactions.actions[0];

const getActionKey = (action) => Object.keys(action)[0];

const getActionType = (action) => {
    let type = "";
    switch (getActionKey(action)) {
      case "SendNear":
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
      default:
        break;
    }
    return type;
};

const getState = (proposal, isOver) => {
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

const getArgsFromAction = (action, docs, t) => {
    let args = {};
    const action_key = getActionKey(action);
    switch (action_key) {
      case "SendNear":
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
          name: action.AddFile.metadata.name,
          ipfs_cid: action.AddFile.uuid,
          category:
            action.AddFile.new_category || docs.map.categories[action.AddFile.metadata.category],
        };
        break;
      case "InvalidateFile":
        {
          let doc_file = docs.files.find(
            (elem) => elem.address == action.InvalidateFile.uuid
          );
          args = {
            name: doc_file.name,
            category: doc_file.category,
          };
        }
        break;
      default:
        break;
    }
    return args;
};

const getVotingStats = (proposal, token_holders, token_blocked) => {
    //console.log(token_holders, token_blocked)
    let results = _.clone(voteMapper)
    //console.log(results)
    Object.keys(proposal.votes).forEach((voter) => {
        results[proposal.votes[voter]] += token_holders[voter] ?? 0;
        //console.log(results)
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

const getDurationTo = (proposal) => parseFromNanoseconds(proposal.vote_config.duration_to);

const getOver = (proposal) => {
    if (proposal.status === "InProgress") {
      const end = getDurationTo(proposal).valueOf();
      const now = new Date().valueOf();
      return now > end;
    }
    return false;
};

const getChoice = (proposal, accountId) => {
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

const getProgress = (proposal, durationTo) => {
    let progress = null;
    if (proposal.status === "InProgress") {
      const end = durationTo.valueOf();
      const now = new Date().valueOf();
      // TODO: get from config of dao
      // let beginDate = this.durationTo
      // beginDate.setMonth(this.durationTo.getMonth() - 1)
      // const begin = beginDate.valueOf()
      const begin = durationTo.valueOf() - 7 * 86400000;
      const nowFromBegin = now - begin;
      const endFromBegin = end - begin;
      // console.log('Progress values: ', begin, now, end);
      if (endFromBegin >= 0) {
        progress = new Decimal(nowFromBegin)
          .div(endFromBegin)
          .times(100)
          .round()
          .toNumber();
      }
    }
    return progress;
};

const isVoted = (proposal, accountId) => Object.keys(proposal.votes).includes(accountId);

const transform = (proposal, docs, token_holders, token_blocked, accountId, t) => {
    const action = getAction(proposal[1])
    const actionType = getActionType(action)
    const durationTo = getDurationTo(proposal[1])
    const isOver = getOver(proposal[1])
    const stateIndex = getState(proposal[1], isOver)
    const args = getArgsFromAction(action, docs, t)
    const choiceIndex = getChoice(proposal[1], accountId)
    let trans = {
        id: proposal[0],
        key: getActionKey(action),
        index: proposal[1].uuid,
        title: t('default.' + actionType + '_message', args),
        description: proposal[1].description,
        typeIndex: actionType,
        type: t("default." + getActionType(action)),
        stateIndex: stateIndex,
        state: t("default.vote_status_" + stateIndex),
        status: proposal[1].status,
        canVote: Object.keys(token_holders).includes(accountId),
        isOver: isOver,
        isVoted: isVoted(proposal[1], accountId),
        args: args,
        votingStats: getVotingStats(proposal[1], token_holders, token_blocked),
        duration: {
            value: durationTo,
            date: toDateString(durationTo),
            time: toTimeString(durationTo),
        },
        choiceIndex: choiceIndex,
        choice: t("default.vote_type_" + choiceIndex),
        progress: getProgress(proposal[1], durationTo),
        quorum: proposal[1].vote_config.quorum,
    }
    trans.search = [toSearch(trans.title), toSearch(trans.description), toSearch(trans.duration.date), toSearch(trans.duration.time), toSearch(trans.type), toSearch(trans.state)].join('-')
    // console.log(trans)
    return trans
};

export {
    transform, voteMapper, statusBgMapper
}