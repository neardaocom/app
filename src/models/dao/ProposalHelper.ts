import { DAOMember, DAOProposal, DAOTokenHolder, DAOVoteLevel, DAOVoteType } from "./types/dao";
import { WFInstance, WFSettings } from "./types/workflow";
import GenericsHelper from "../utils/GenericsHelper";
import Decimal from "decimal.js";
import moment from "moment";

import loClone from "lodash/clone";
import loFind from "lodash/find";
import loGet from "lodash/get";
import loToInteger from "lodash/toInteger";
import loToNumber from "lodash/toNumber"
import { UnsupportedError } from '@/models/utils/errors'
import CollectionHelper from "../utils/CollectionHelper";
import { CodeValue, Translate } from "../utils/types/generics";
import ObjectHelper from "../utils/ObjectHelper";
import { ProposalVoting } from "./types/proposal";

export default class ProposalHelper {

    static voteMapper: Record<number, number> = { 0: 0, 1: 0, 2: 0 };

    static workflowCodeBgMapper: Record<string,{ color: string; icon: string; }> = {
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
        running: {
          color: 'secondary',
          icon: 'bi bi-check-circle me-2',
        },
        finished: {
            color: 'info',
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

    static getProgress(state: string, settings: WFSettings, durationTo: Date): number {
        //console.log(state, settings, durationTo)
        let progress: number = 0;
        if (state === "in_progress") {
          const end = durationTo.valueOf();
          const now = new Date().valueOf();
          const begin = GenericsHelper.subtractInterval(durationTo, settings.voteLevel.duration).valueOf()
          const nowFromBegin = now - begin;
          const endFromBegin = end - begin;
          //console.log('Progress values:', begin, now, end);
          if (end - now < 0) {
            progress = 100
          } else if (now - begin < 0) {
            progress = 0
          } else {
            progress = new Decimal(nowFromBegin).div(endFromBegin).times(10_000).round().div(100).toNumber()
          }
        }

        return progress
    }

    static getStatusCode(state: string, workflowState: string | undefined, progress: number): string {
        let code: string = ''
        if (state === 'in_progress' && progress < 100) {
          code = 'in_progress'
        } else if (state === 'in_progress') {
          code = 'finishing'
        } else if (state === 'accepted' && workflowState !== 'finished') {
          code = 'running'
        } else if (state === 'accepted' && workflowState === 'finished') {
          code = 'finished'
        } else if (state === 'rejected') {
          code = 'rejected'
        } else if (state === 'spam') {
          code = 'spam'
        } else if (state === 'invalid') {
          code = 'invalid'
        }
      
        return code
    }

    static isOver(proposal: DAOProposal, settings: WFSettings): boolean {
        if (proposal.state === "in_progress") {
            return new Date().valueOf() > proposal.end!.valueOf();
        }
        return false;
    }

    static generateStorageKey(proposalCount?: number): number {
        if (proposalCount) {
          return proposalCount + 1
        } else {
          return moment().valueOf()
        }
    }

    static getVotingStats(proposal: DAOProposal, members: DAOMember[], tokenBlocked: number) {
        //console.log(token_holders, token_blocked)
        const results = loClone(this.voteMapper)
        let amountSum: number = 0
        //console.log(results)
        if (proposal.state === 'in_progress') { // compute stats
          Object.keys(proposal.votes).forEach((voter: string) => {
            switch (loToInteger(proposal.votes[voter])) {
              case 0:
                results[0] += loToNumber(CollectionHelper.findParam(members, {'accountId': voter}, ['voteAmount'])) ?? 0;
                break;
              case 1:
                results[1] += loToNumber(CollectionHelper.findParam(members, {'accountId': voter}, ['voteAmount'])) ?? 0;
                break;
              case 2:
                results[2] += loToNumber(CollectionHelper.findParam(members, {'accountId': voter}, ['voteAmount'])) ?? 0;
                break;
              default:
                throw new UnsupportedError('Undefined voting stat: ' + loToInteger(proposal.votes[voter]))
            }
            amountSum += loToNumber(CollectionHelper.findParam(members, {'accountId': voter}, ['voteAmount'])) ?? 0
          });
        } else { // get stats from results
          results[1] += proposal.votingResults?.yes || 0;
          results[2] += proposal.votingResults?.no || 0;
          amountSum = results[1] + results[2];
        }

        return [
            {
                choice: "yes",
                percent: new Decimal(results[1]).div(amountSum).times(100).round().toNumber() || 0,
                amount: new Decimal(results[1]).toNumber(),
                bg: "primary",
            },
            {
                choice: "no",
                percent: new Decimal(results[2]).div(amountSum).times(100).round().toNumber() || 0,
                amount: new Decimal(results[2]).toNumber(),
                bg: "muted",
            },
            // {choice: 'spam', percent: new Decimal(results[0]).div(this.token_blocked).times(100).round().toNumber(), bg: 'black'}
            // {choice: this.choice(), percent: 20}
        ];
    }
    
    static getChoice(proposal: DAOProposal, accountId: string): string {
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
    }

    static isInVoting(proposal: ProposalVoting): boolean {
      return proposal.stateCode === 'in_progress'
    }

    static isVoted(proposal: DAOProposal, accountId: string): boolean {
        return Object.keys(proposal.votes).includes(accountId);
    }

    static transformInputs(proposalConstants: any): CodeValue[] {
        return GenericsHelper.createCodeValueFromObject(proposalConstants.map).map((item) => {
            item.value = ObjectHelper.first(item.value)
            return item
        })
    }

    static getWorkflows(proposals: DAOProposal[]): WFInstance[] {
      return proposals.filter((proposal) => proposal.workflow !== undefined).map((proposal) => proposal.workflow!) || []
    }

    static voteLevelToTranslate(voteLevel: DAOVoteLevel): Translate {
      const trans: Translate = {key: '', params: {quorum: voteLevel.quorum, approveThreshold: voteLevel.approveThreshold}}
  
      switch (voteLevel.type) {
          case DAOVoteType.Democratic:
              trans.key = 'vote_level_democratic'
              break;
          case DAOVoteType.TokenWeighted:
              trans.key = 'vote_level_token_weighted'
              break;
          default:
              throw new Error("Unsupported type: " + voteLevel);
      }
      return trans
  }
}