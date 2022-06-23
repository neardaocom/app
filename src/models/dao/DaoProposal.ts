import { DAO, DAORights } from '@/models/dao/types/dao';
import NearUtils from '@/models/nearBlockchain/Utils';
import { ProposalVoting } from './types/proposal';
import ProposalVotingTransformer from './transformers/ProposalVotingTransformer';
import { MarketTemplate } from './types/market';
import { DaoContractService } from '../nearBlockchain';
import TransformerInterface from "@/models/interfaces/Transformer.interface";
import { DAODocsFile } from './types/docs';
import DocsHelper from './DocsHelper';


export default class DaoProposal {
  private dao: DAO
  private service: DaoContractService;

  constructor(dao: DAO, service: DaoContractService) {
    this.dao = dao
    this.service = service
  }

  list(templatesMeta: MarketTemplate[], walletId: string, walletRights: DAORights[], t: Function, d: Function, n: Function): ProposalVoting[] {
    const proposals: ProposalVoting[] = []
    const transformer = new ProposalVotingTransformer(this.dao.templates, templatesMeta, this.dao.members, this.dao.staking.totalVoteAmount, walletId, walletRights, t, d, n, this.dao.docs)

    this.dao.proposals.forEach((proposal) => {
      proposals.push(transformer.transform(proposal))
    })

    return proposals
  }

  async vote(id: number, choice: number) {
    return this.service.proposalVote(id, choice, 10, 0.00125).actionsRun()
  }

  async finish(id: number) {
    return this.service.proposalFinish(id, 100).actionsRun()
  }
}