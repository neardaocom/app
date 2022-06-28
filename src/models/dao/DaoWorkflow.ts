import { DAO, DAOProposal, DAORights } from '@/models/dao/types/dao';
import NearUtils from '@/models/nearBlockchain/Utils';
import { ProposalVoting } from './types/proposal';
import ProposalVotingTransformer from './transformers/ProposalVotingTransformer';
import { MarketTemplate } from './types/market';
import { DaoContractService } from '../nearBlockchain';
import TransformerInterface from "@/models/interfaces/Transformer.interface";
import { WFActivity, WFInstance, WFInstanceLog, WFMetaActivity, WFMetaTemplate, WFSettings, WFTemplate } from './types/workflow';
import loFind from 'lodash/find'
import loGet from 'lodash/get'
import { NotFoundError } from '../utils/errors';
import { workflowMetadata } from './data/workflowMetadata'
import { DAODocs } from './types/docs';


export default class DaoWorkflow {
  private dao: DAO
  private workflow: WFInstance
  private service: DaoContractService
  private template?: WFTemplate
  private settings?: WFSettings

  constructor(dao: DAO, workflow: WFInstance, service: DaoContractService) {
    this.dao = dao
    this.workflow = workflow
    this.service = service
  }

  getProposalVoting(templatesMeta: MarketTemplate[], walletId: string, walletRights: DAORights[], t: Function, d: Function, n: Function, docs: DAODocs): ProposalVoting {
    const transformer = new ProposalVotingTransformer(this.dao.templates, templatesMeta, this.dao.members, this.dao.staking.totalVoteAmount, walletId, walletRights, t, d, n, docs)
    return transformer.transform(this.getProposal())
  }

  getTemplate = (): WFTemplate => {
    if (!this.template) {
      this.template = loFind(this.dao.templates, { 'id': this.workflow.templateId })
    }
    if (!this.template) {
      throw new NotFoundError('Template[' + this.workflow.templateId + '] not found')
    }
    return this.template;
  }

  getSettings = (): WFSettings | undefined => {
    if (!this.settings) {
      this.settings = loFind(this.getTemplate()?.settings, { 'id': this.workflow.settingsId });
    }
    return this.settings;
  }

  getActivity(id: number): WFActivity | null {
    return loFind(this.getTemplate()?.activities, {id: id}) || null
  }

  getProposal(): DAOProposal {
    const proposal = loFind(this.dao.proposals, { id: this.workflow.id })
    if (!proposal) {
      throw new NotFoundError('Proposal[' + this.workflow.id + '] not found')
    }
    return proposal
  }

  canFinish(): boolean {
    return this.workflow.state === 'running' && (this.workflow.activityLastId !== undefined) && this.template ? this.template.endActivityIds.includes(this.workflow.activityLastId) : false;
  }

  getTransitionNextIds(): number[] {
    return this.getTemplate()?.transactions[this.workflow.activityLastId]?.toIds ?? []
  }

  getNextActivities(): WFActivity[] {
    const activities: WFActivity[] = []

    if (this.workflow.activityLastId === 0) {
        this.getTemplate().activities.filter((activity) => activity.id == this.workflow.workflowScenarioId).forEach((activity) => activities.push(activity))
    } else {
      this.getTransitionNextIds().forEach((activityId) => {
        this.getTemplate().activities.filter((activity) => activity.id === activityId).forEach((activity) => activities.push(activity))
      })
    }

    return activities
  }

  getActivityRights = (activityId: number): DAORights[] => {
    return this.getSettings()?.activityRights[activityId] || []
  }

  getMetadata(): WFMetaTemplate | null {
    return loGet(workflowMetadata, [this.getTemplate()?.code || ''])
  }

  getMetadataActivity(activityId: number): WFMetaActivity {
    const metadataActivity = loFind(this.getMetadata()?.activities, {id: activityId})
    if (!metadataActivity) {
      throw new NotFoundError('MetadataActivity[' + this.getTemplate()?.code + ',' + activityId + '] not found')
    }
    return metadataActivity;
  }

  getLogs(): WFInstanceLog[] {
    return this.workflow.activityLogs.map((item) => {
      item.activity = this.getActivity(item.activityId)
      return item
    })
  }

  async runActivity(activityId: number) {
    const metadataActivity = this.getMetadataActivity(activityId)
    const actionInputs = metadataActivity.args({
      daoId: this.service.getContractId(),
      tokenId: this.dao.settings.token_id,
      proposalId: this.workflow.id,
      constants: this.workflow.constants,
      inputs: this.workflow.inputs,
      storageDao: [],
      storage: [],
      form: {},
   })

    return this.service.workflowRunActivity(this.workflow.id, activityId, actionInputs, 200).actionsRun()
  }

  async finish() {
    return this.service.workflowFinish(this.workflow.id, 50).actionsRun()
  }
}