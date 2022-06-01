import { Account, Contract } from 'near-api-js';
import { Instance, ProposeSettings, ProposalState, VoteResult, ActionInput, TreasuryPartition, Reward, ClaimbleReward, Asset, Tags, Statistics, Settings, ProposalInputs } from "./types/dao";
import { Wallet } from './types/blockchain';
import loSet from "lodash/set";
import ContractService from './ContractService';

export default class DaoContractService extends ContractService {

  constructor(account: Account, contractId: string) {
    super(new Contract(account, contractId, {
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
        'wf_log',
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
        // media
        'media',
        'media_list',
        // others
        'statistics',
        'tags',
        'settings',

        // upgrade
      ],
      changeMethods: [
        // proposals and voting
        'proposal_create',
        'proposal_vote',
        'proposal_finish',
        // workflow
        'workflow_run_activity',
        'workflow_finish',
        // treasury management
        'unlock_partition_assets',
        // wallet
        'withdraw_rewards',
        // 'wf_finish', // TODO: Is it moved to wf_run_activity?
        // upgrade
        'download_new_version', // TODO: What about upgrade
        'upgrade_self',
      ],
    }));
  }

  /*****************
    *    Change     *
    ****************/

  /**
   * Create proposal
   * 
   * @return this
   */
    proposalCreate(proposalInputs: ProposalInputs, tGas: number, nearDeposit: number): this {
      this.actionsAdd('proposal_create', proposalInputs, tGas, nearDeposit)
      return this
    }
  
    /**
     * Vote
     * 
     * @return this
     */
    proposalVote(id: number, vote: number, tGas: number, nearDeposit: number): this {
      this.actionsAdd('proposal_vote', { id, vote }, tGas, nearDeposit)
      return this
    }
  
    /**
     * Finish proposal
     * 
     * @return this
     */
    proposalFinish(id: number, tGas: number): this {
      this.actionsAdd('proposal_finish', { id }, tGas)
      return this
    }

      /**
   * WorkFlow run activity
   * 
   * @return this
   */
  workflowRunActivity(proposalId: number, activityId: number, actionsInputs: ActionInput[] | null, tGas: number): this {
    this.actionsAdd('workflow_run_activity', { proposal_id: proposalId, activity_id: activityId, actions_inputs: actionsInputs }, tGas)
    return this
  }

  /**
   * WorkFlow finish
   * 
   * @return this
   */
  workflowFinish(proposalId: number, tGas: number): this {
    this.actionsAdd('workflow_finish', { proposal_id: proposalId }, tGas)
    return this
  }

  /**
   * Unlock all partition assets with lock for given partition id
   * 
   * @return this
   */
  unlockPartitionAssets(id: number, tGas: number): this {
    this.actionsAdd('unlock_partition_assets', { id }, tGas)
    return this
  }

  /**
     * Withdraw rewards
     * user is supposed to have all provided reward_ids otherwise panic
     * max available amount of each reward is withdraw
     * 
     * @return this
     */
   withdrawRewards(rewardIds: number[], asset: Asset, tGas: number): this {
    this.actionsAdd('withdraw_rewards', { reward_ids: rewardIds, asset }, tGas)
    return this
  }


  /*****************
    *    Views      *
    ****************/

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
    return this.contract.group({ id })
  }

  /**
   * Group roles
   * 
   * @return Promise
   */
  async groupRoles(id: number) {
    return this.contract.group_roles({ id })
  }

  /**
   * ROles of user
   * 
   * @return Promise
   */
  async userRoles(accountId: string) {
    return this.contract.user_roles({ account_id: accountId })
  }

  /**
   * Proposals
   * 
   * @return Promise
   */
  async proposals(fromId: number, limit: number) {
    return this.contract.proposals({ from_id: fromId, limit })
  }

  /**
   * Proposal
   * 
   * @return Promise
   */
  async proposal(id: number) {
    return this.contract.proposal({ id })
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
    return this.contract.user_vote_weight({ account_id: accountId })
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
    return this.contract.wf_template({ id })
  }

  /**
   * WorkFlow Instance
   * 
   * @return Promise
   */
  async wfInstance(proposalId: number): Promise<Instance> {
    return this.contract.wf_instance({ proposal_id: proposalId })
  }

  /**
   * WorkFlow log
   * 
   * @return Promise
   */
  async wfLog(proposalId: number): Promise<any[]> {
    return this.contract.wf_log({ proposal_id: proposalId })
  }

  /**
   * WorkFlow propose settings
   * 
   * @return Promise
   */
  async wfProposeSettings(proposalId: number): Promise<ProposeSettings> {
    return this.contract.wf_propose_settings({ proposal_id: proposalId })
  }

  /**
   * WF Add: Proposed template settings
   * 
   * @return Promise
   */
  async wfAddProposedTemplateSettings(proposalId: number): Promise<ProposeSettings> {
    return this.contract.wf_add_proposed_template_settings({ proposal_id: proposalId })
  }

  /**
   * All storage data in bucket if bucket exists
   * 
   * @param bucketId 
   * @returns 
   */
  async storageBucketDataAll(bucketId: string) {
    return this.contract.storage_bucket_data_all({ bucket_id: bucketId })
  }

  /**
   * Storage data in the bucket for provided key if bucket exists in the storage and key in the bucket exists
   * 
   * @param bucketId 
   * @param dataId 
   * @returns 
   */
  async storageBucketData(bucketId: string, dataId: string) {
    return this.contract.storage_bucket_data({ bucket_id: bucketId, data_id: dataId })
  }

  /**
   * Load all buckets with data
   * 
   * @returns Record<string, unknown>
   */
  async storage() {
    // get keys
    const storageKeys: string[] = await this.storageBuckets()

    // load data
    const data = await Promise.all(
      storageKeys.map((key: string) => this.storageBucketDataAll(key))
    ).catch((e) => {
      throw new Error("Storage data not louded: " + e);
    });

    const result: Record<string, unknown> = {}
    storageKeys.forEach((key, index) => loSet(result, [key], data[index]))

    return result
  }

  async storageBuckets() {
    return this.contract.storage_buckets()
  }

  /**
   * All storage bucket ids
   * 
   * @return Promise
   */
  async partitionList(fromId: number, limit: number): Promise<[number, TreasuryPartition][]> {
    return this.contract.partition_list({ from_id: fromId, limit })
  }
  /**
   * Get partition
   * 
   * @return Promise
   */
  async partition(id: number): Promise<TreasuryPartition | null> {
    return this.contract.partition({ id })
  }

  /**
   * All rewards
   * 
   * @return Promise
   */
  async rewardList(fromId: number, limit: number): Promise<[number, Reward][]> {
    return this.contract.reward_list({ from_id: fromId, limit })
  }

  /**
   * Get reward
   * 
   * @return Promise
   */
  async reward(id: number): Promise<Reward | null> {
    return this.contract.reward({ id })
  }

  /**
   * Wallet for account
   * 
   * @return Promise
   */
  async wallet(accountId: string): Promise<Wallet | null> {
    return this.contract.wallet({ account_id: accountId })
  }

  /**
   * ClaimbleRewards for account
   * 
   * @return Promise
   */
  async claimableRewards(accountId: string): Promise<Record<string, ClaimbleReward[]>> {
    return this.contract.claimable_rewards({ account_id: accountId })
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
  async nextTick(searchMaxTicks: number): Promise<number | null> {
    return this.contract.next_tick({ search_max_ticks: searchMaxTicks })
  }

  /**
   * Tags list
   * 
   * @param category 
   * @returns 
   */
  async tags(category: string): Promise<Tags | null> {
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

  /**
   * Media list
   * 
   * @return Promise
   */
  async mediaList(fromId: number, limit: number) {
    return this.contract.mediaList({ from_id: fromId, limit })
  }

  /**
   * Media
   * 
   * @return Promise
   */
  async media(id: number) {
    return this.contract.media({ id })
  }


  ///**
  // * Download new version
  // * 
  // * @return Promise
  // */
  // upgradeDownload(accountId: string, tGas: number): this {
  //this.actionsAdd('t', download_new_version({ account_id: accountId }, tGas);
  // return this
  //}

  ///**
  // * Upgrade contract
  // * 
  // * @return Promise
  // */
  // upgradeMigrate(accountId: string, tGas: number): this {
  //this.actionsAdd('t', upgrade_self({ account_id: accountId }, tGas);
  // return this
  //}

  //async getDaoVersionHash() {
  ////return this.contract.version_hash();
  //}
}
