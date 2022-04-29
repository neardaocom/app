import { Account, Contract } from 'near-api-js';

export default class DaoContract {
  private contract: Contract & any;

  constructor(account: Account, contractId: string) {
    this.contract = new Contract(account, contractId, {
      viewMethods: [
        'wf_templates',
        'wf_instance',
        'wf_log',
        'groups',
        'tags',
        'media_list',
        'proposals',
        'dao_settings',
        'stats',
        'ft_metadata',
        'storage_buckets', // storage keys
        'storage_bucket_data_all', // storage data
        'ft_balance_of',
      ],
      changeMethods: [
        'propose',
        'vote',
        'finish_proposal',
        'treasury_send_near',
        'wf_finish',
        'download_new_version',
        'upgrade_self',
      ],
    });
  }

  /**
   * Propose
   * 
   * @return Promise
   */
   async propose(args: any, gas: string, yoctoNear: string) {
    return this.contract.propose(args, gas, yoctoNear)
  }

  /**
   * Vote
   * 
   * @return Promise
   */
   async vote(proposalId: number, voteKind: number, gas: string, yoctoNear: string) {
    return this.contract.vote({ proposal_id: proposalId, vote_kind: voteKind} , gas, yoctoNear);
  }

  /**
   * Finish proposal
   * 
   * @return Promise
   */
   async finishProposal(proposalId: number, gas: string) {
    return this.contract.finish_proposal({ proposal_id: proposalId }, gas);
  }

  /**
   * WorkFlow finish
   * 
   * @return Promise
   */
   async wfFinish(proposalId: number, gas: string) {
    return this.contract.wfFinish({ proposal_id: proposalId }, gas);
  }

  /**
   * Download new version
   * 
   * @return Promise
   */
   async upgradeDownload(accountId: string, gas: string) {
    return this.contract.download_new_version({ account_id: accountId }, gas);
  }

  /**
   * Upgrade contract
   * 
   * @return Promise
   */
   async upgradeMigrate(accountId: string, gas: string) {
    return this.contract.upgrade_self({ account_id: accountId }, gas);
  }

  async getFtBalanceOf(accountId: string) {
    return this.contract.ft_balance_of({ account_id: accountId });
  }


  async getStatisticsMembers() {
    return this.contract.statistics_members();
  }

  async getStatisticsFt() {
    return this.contract.statistics_ft();
  }

  async getProposals(fromIndex: number, limit: number) {
    return this.contract.proposals({
      from_index: fromIndex ?? 0,
      limit: limit ?? 1000
    });
  }

  async getDocFiles() {
    return this.contract.doc_files();
  }

  async getDaoConfig() {
    return this.contract.dao_config();
  }

  async getVotePolicies() {
    return this.contract.vote_policies();
  }

  async getDaoVersionHash() {
    return this.contract.version_hash();
  }

  async getSkywardAuctions() {
    return this.contract.skyward_auctions();
  }

  async getRefPools() {
    return this.contract.ref_pools();
  }

  async getWfTemplates() {
    return this.contract.wf_templates();
  }

  async getGroups() {
    return this.contract.groups();
  }

  async getTags(category: string) {
    return this.contract.tags({ category: category });
  }

  async getMediaList() {
    return this.contract.media_list();
  }

  async getDaoSettings() {
    return this.contract.dao_settings()
  }

  async getWfInstance(proposalId: number) {
    return this.contract.wf_instance({ proposal_id: proposalId })
  }

  async getWfInstanceLog(proposalId: number) {
    return this.contract.wf_log({ proposal_id: proposalId })
  }

  async getStats() {
    return this.contract.stats()
  }

  async getFtMetadata() {
    return this.contract.ft_metadata()
  }

  async getStorage() {
    return this.contract.storage_buckets()
  }

  async getStorageData(bucketId: string) {
    return this.contract.storage_bucket_data_all({bucket_id: bucketId})
  }
}
