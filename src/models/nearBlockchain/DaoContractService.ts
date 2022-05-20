import { Account, Contract } from 'near-api-js';
import { Instance, ProposeSettings, ProposalState, VoteResult, ActionInput, TreasuryPartition, Reward, ClaimbleReward, Asset, Tags, Statistics, Settings } from "./types/dao";
import { TemplateSettings } from "./types/workflow";
import { ResourceType } from "./types/resource";
import { Wallet } from './types';

export default class DaoContract {
  private contract: Contract & any;

  constructor(account: Account, contractId: string) {
    this.contract = new Contract(account, contractId, {
      viewMethods: [
        // groups
        'group',
        'group_roles',
        'groups',
        // proposals and voting
        'proposal',
        'proposals',
        'user_roles',
        // delegation
        'delegation_total_supply',
        'user_vote_weight',
        // workflow
        'wf_template',
        'wf_templates',
        'wf_instance',
        'wf_propose_settings',
        'wf_add_proposed_template_settings',
        // storage
        'storage_buckets', // storage keys
        'storage_bucket_data', // storage data of keys
        'storage_bucket_data_all', // storage set of data
        // treasury management
        'partition',
        'partition_list',
        // reward
        'reward',
        'reward_list',
        // wallet
        'wallet',
        'claimable_rewards',
        // tick
        'next_tick',
        // others
        'statistics',
        'tags',
        'settings',
        // upgrade
        // 'wf_log', // TODO: Add to workflow
        // 'media_list', // TODO: Move to resource
      ],
      changeMethods: [
        // proposals and voting
        'proposal_create',
        'proposal_vote',
        'proposal_finish',
        // workflow
        'wf_run_activity',
        // treasury management
        'unlock_partition_assets',
        // wallet
        'withdraw_rewards',
        // 'wf_finish', // TODO: Is it moved to wf_run_activity?
        // upgrade
        'download_new_version', // TODO: What about upgrade
        'upgrade_self',
      ],
    });
  }

  /**
   * Group list
   * 
   * @return Promise
   */
   async groups() {
    return this.contract.groups()
  }

  /**
   * Group
   * 
   * @return Promise
   */
   async group(id: number) {
    return this.contract.group({id})
  }

  /**
   * Group roles
   * 
   * @return Promise
   */
   async groupRoles(id: number) {
    return this.contract.group_roles({id})
  }

  /**
   * ROles of user
   * 
   * @return Promise
   */
   async userRoles(accountId: string) {
    return this.contract.user_roles({account_id: accountId})
  }

  /**
   * Proposals
   * 
   * @return Promise
   */
   async proposals(fromId: number, limit: number) {
    return this.contract.proposals({from_id: fromId, limit})
  }

  /**
   * Proposal
   * 
   * @return Promise
   */
   async proposal(id: number) {
    return this.contract.proposal({id})
  }

  /**
   * Create proposal
   * 
   * @return Promise
   */
   async proposalCreate(
     description: ResourceType|null,
     templateId: number,
     templateSettingsId: number,
     proposeSettings: ProposeSettings,
     templateSettings: TemplateSettings[]|null, // only in case "wf_add" workflow
     schedulerMsg: string|null,
     gas: string,
     yoctoNear: string
   ) {
    return this.contract.proposal_create({
      description,
      template_id: templateId,
      template_settings_id: templateSettingsId,
      propose_settings: proposeSettings,
      template_settings: templateSettings,
      scheduler_msg: schedulerMsg,
    }, gas, yoctoNear)
  }

  /**
   * Vote
   * 
   * @return Promise
   */
   async proposalVote(id: number, vote: number, gas: string, yoctoNear: string): Promise<VoteResult> {
    return this.contract.proposal_vote({id, vote} , gas, yoctoNear)
  }

  /**
   * Finish proposal
   * 
   * @return Promise
   */
   async proposalFinish(id: number, gas: string): Promise<ProposalState> {
    return this.contract.finish_proposal({ id }, gas);
  }

  /**
     * Delegation total supply
     * 
     * @return Promise<string->number>
     */
  async delegationTotalSupply(fromId: number, limit: number): Promise<string> {
    return this.contract.delegation_total_supply()
  }

  /**
   * User vote weight
   * 
   * @return Promise
   */
  async userVoteWeight(accountId: string) {
    return this.contract.user_vote_weight({account_id: accountId})
  }

  /**
     * WorkFlow templates
     * 
     * @return Promise
     */
  async wfTemplates() {
    return this.contract.wf_templates()
  }

  /**
   * WorkFlow templates
   * 
   * @return Promise
   */
  async wfTemplate(id: number) {
    return this.contract.wf_template({id})
  }

  /**
   * WorkFlow Instance
   * 
   * @return Promise
   */
  async wfInstance(proposalId: number): Promise<Instance> {
    return this.contract.wf_instance({proposal_id: proposalId})
  }

  /**
   * WorkFlow propose settings
   * 
   * @return Promise
   */
   async wfProposeSettings(proposalId: number): Promise<ProposeSettings> {
    return this.contract.wf_propose_settings({proposal_id: proposalId})
  }

  /**
   * WF Add: Proposed template settings
   * 
   * @return Promise
   */
   async wfAddProposedTemplateSettings(proposalId: number): Promise<ProposeSettings> {
    return this.contract.wf_add_proposed_template_settings({proposal_id: proposalId})
  }

  /**
   * WorkFlow run activity
   * 
   * @return Promise
   */
   async wfRunActivity(
     proposalId: number,
     activityId: number,
     actionsInputs: ActionInput|null[],
     gas: string
    ) {
    return this.contract.workflow_run_activity({
      proposal_id: proposalId,
      activity_id: activityId,
      actions_inputs: actionsInputs,
    }, gas);
  }

  async storageBuckets() {
    return this.contract.storage_buckets()
  }

  /**
   * All storage data in bucket if bucket exists
   * 
   * @param bucketId 
   * @returns 
   */
  async storageBucketDataAll(bucketId: string) {
    return this.contract.storage_bucket_data_all({bucket_id: bucketId})
  }

  /**
   * Storage data in the bucket for provided key if bucket exists in the storage and key in the bucket exists
   * 
   * @param bucketId 
   * @param dataId 
   * @returns 
   */
  async storageBucketData(bucketId: string, dataId: string) {
    return this.contract.storage_bucket_data({bucket_id: bucketId, data_id: dataId})
  }

  /**
   * All storage bucket ids
   * 
   * @return Promise
   */
   async partitionList(fromId: number, limit: number): Promise<[number, TreasuryPartition][]> {
    return this.contract.partition_list({from_id: fromId, limit})
  }
  /**
   * Get partition
   * 
   * @return Promise
   */
   async partition(id: number): Promise<TreasuryPartition|null> {
    return this.contract.partition({id})
  }

  /**
     * Unlock all partition assets with lock for given partition id
     * 
     * @return Promise
     */
  async unlockPartitionAssets(id: number, gas: string) {
    return this.contract.unlock_partition_assets({ id }, gas);
  }

  /**
   * All rewards
   * 
   * @return Promise
   */
   async rewardList(fromId: number, limit: number): Promise<[number, Reward][]> {
    return this.contract.reward_list({from_id: fromId, limit})
  }

  /**
   * Get reward
   * 
   * @return Promise
   */
   async reward(id: number): Promise<Reward|null> {
    return this.contract.reward({id})
  }

  /**
   * Wallet for account
   * 
   * @return Promise
   */
   async wallet(accountId: string): Promise<Wallet|null> {
    return this.contract.wallet({account_id: accountId})
  }

  /**
   * ClaimbleRewards for account
   * 
   * @return Promise
   */
   async claimableRewards(accountId: string): Promise<ClaimbleReward[]> {
    return this.contract.claimable_rewards({account_id: accountId})
  }

  /**
     * Withdraw rewards
     * user is supposed to have all provided reward_ids otherwise panic
     * max available amount of each reward is withdraw
     * 
     * @return Promise
     */
  async withdrawRewards(rewardIds: number[], asset: Asset, gas: string) {
    return this.contract.withdraw_rewards({ reward_ids: rewardIds, asset }, gas);
  }

  /**
   * Next tick
   * 
   * searches for next tick looks ahead up to search_max_ticks ticks.
   * returns timestamp (seconds) of next tick or null if not found
   * next tick is timestamp of tick in which there is > 0 events in queue to be processed
   * 
   * @return Promise
   */
   async nextTick(searchMaxTicks: number): Promise<number|null> {
    return this.contract.next_tick({search_max_ticks: searchMaxTicks})
  }

  /**
   * Tags list
   * 
   * @param category 
   * @returns 
   */
  async tags(category: string): Promise<Tags|null> {
    return this.contract.tags({ category });
  }

  /**
   * Actual settings
   * 
   * @returns 
   */
  async settings(): Promise<Settings> {
    return this.contract.settings()
  }

  /**
   * Statistics from chain
   * @returns 
   */
  async statistics(): Promise<Statistics> {
    return this.contract.statistics()
  }

///**
// * Download new version
// * 
// * @return Promise
// */
// async upgradeDownload(accountId: string, gas: string) {
////return this.contract.download_new_version({ account_id: accountId }, gas);
//}

///**
// * Upgrade contract
// * 
// * @return Promise
// */
// async upgradeMigrate(accountId: string, gas: string) {
////return this.contract.upgrade_self({ account_id: accountId }, gas);
//}

//async getDaoVersionHash() {
////return this.contract.version_hash();
//}
}
