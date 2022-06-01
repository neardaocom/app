import {
  connect,
  Contract,
  transactions,
  keyStores,
  WalletConnection
} from 'near-api-js';
import DateHelper from '@/models/utils/DateHelper';

import Decimal from 'decimal.js';
import BN from 'bn.js';

import NearUtils from '@/models/nearBlockchain/Utils';
import FactoryContract from '@/models/nearBlockchain/AdminContractService';
import ProviderContract from '@/models/nearBlockchain/WfProviderContractService';
import ServicePool from '@/models/dao/ServicePool';
import loSet from "lodash/set"
import loToString from "lodash/toString"
import { rightTokenGroupCouncil, rightTokenGroupCouncilLeader, rightTokenHolder } from '@/data/dao';
// import { workflowTemplateWfAdd, workflowTemplateWfNearSend, worlflowTemplateSettingsBuilder } from '@/data/workflow';
import { worlflowTemplateSettingsBuilder } from '@/data/workflow';
import { DAORights } from '@/models/dao/types/dao';
import { TransactionAction } from "@/models/nearBlockchain/types/blockchain";
import loFill from 'lodash/fill'
import DeprecatedError from "@/models/utils/errors/DeprecatedError";

class NearService {
  // config of near
  config: any;

  // factory contract
  factoryContract!: FactoryContract;

  // provider contract
  providerContract!: ProviderContract;

  // wallet
  walletConnection!: WalletConnection & any;

  // near API
  near!: any;

  // contracts
  contractPool!: ServicePool;

  constructor(config: any) {
    this.config = config;
  }

  async init() {
    this.near = await connect(Object.assign({
      deps: {
        keyStore: new keyStores.BrowserLocalStorageKeyStore()
      }
    }, this.config));

    this.walletConnection = new WalletConnection(this.near, this.config.name);

    const account = this.walletConnection.account();

    this.factoryContract = new FactoryContract(account, this.config.adminAccountId);

    this.providerContract = new ProviderContract(account, 'wf-provider.' + process.env.VUE_APP_CONTRACT_NAME);

    this.contractPool = new ServicePool(this.near, account);
  }

  isInitialized() {
    return !!this.near && !!this.walletConnection && !!this.factoryContract;
  }

  isAuthorized() {
    return this.walletConnection.isSignedIn();
  }

  signIn(successUrl?: string, errorUrl?: string) {
    return this.walletConnection.requestSignIn(this.config.domainAccountId, this.config.name, successUrl, errorUrl);
  }

  /**
   * Get NEAR instance
   * 
   * @returns Get instance of Near
   */
  getNear() {
    return this.near;
  }

  async signOut() {
    this.walletConnection.signOut();
  }

  async getAccount() {
    return this.walletConnection.getAccountId();
  }

  /**
   * Provider: List
   */
  async providerList() {
    return this.providerContract.wfTemplates();
  }

  /**
   * Provider: Get
   */
   async providerGet(id: number) {
    return this.providerContract.wfTemplate(id);
  }

  /**
   * 
   * @param {*} accountId Near account id
   * @throws Error if account not exists
   * @returns state
   */
  async getAccountState(accountId: string) {
    const account = await this.near.account(accountId);
    const state = await account.state();
    return state;
  }

  /**
   * Get dao list
   * 
   * @returns Promise
   */
  async getDaoList() {
    return this.factoryContract.getDaoList(0, 100);
  }

  /**
   * Get tags
   * @returns
   */
  async getTags() {
    return this.factoryContract.getTags();
  }

  /**
   * Get dao info
   * 
   * @returns Promise
   */
  async getDaoInfo(daoId: string) {
    //return this.factoryContract.getDaoInfo(daoId);
    return null;
  }

  /**
   * Get dao stats
   * 
   * @returns Promise
   */
  async getDaoStats() {
    //return this.factoryContract.getDaoStats();
    return null;
  }

  /**
   * Get newest version hash of contract
   * 
   * @returns Promise
   */
  async getNewestVersionHash() {
    //return this.factoryContract.getNewestVersionHash(0);
    return null;
  }


  /**
   * Create DAO
   */
  // async createDao(
  //   accountId: string
  //   , publicKey: string
  //   , name: string
  //   , slogan: string
  //   , tags: number[]
  //   , founders: string[]
  //   , location: string
  //   , ftName: string
  //   , ftAmount: number
  //   , ftCouncilShare: number
  //   , ftCouncilInitDistribution: number
  //   , ftCouncilUnlockingFrom: number
  //   , ftCouncilUnlockingDuration: number
  //   , ftCommunityShare: number
  //   , ftCommunityUnlockingFrom: number
  //   , ftCommunityUnlockingDuration: number
  //   , ftFoundationShare: number
  //   , ftFoundationUnlockingFrom: number
  //   , ftFoundationUnlockingDuration: number
  //   , ftPublicSaleUnlockingFrom: number
  //   , ftPublicSaleUnlockingDuration: number
  //   , voteSpamThreshold: number
  //   , voteDurationDays: number
  //   , voteDurationHours: number
  //   , voteQuorum: number
  //   , voteApproveThreshold: number
  //   , voteOnlyOnce: boolean
  //   , amountToTransfer: number
  // ) {
  //   const info = {
  //     name: name,
  //     tags: tags,
  //     founded_s: new Decimal(Date.now()).dividedBy(1000).round().toNumber(),
  //     description: slogan,
  //     ft_name: ftName,
  //     ft_amount: ftAmount
  //   };
  //   // console.log(info)

  //   let releaseCouncilConfig: any = "None";
  //   let releaseCommunityConfig: any = "None";
  //   let releaseFoundationConfig: any = "None";
  //   let releasePublicSaleConfig: any = "None";

  //   if (ftCouncilUnlockingDuration != null) releaseCouncilConfig = {"Linear": {"from": ftCouncilUnlockingFrom, "duration": ftCouncilUnlockingDuration }}
  //   if (ftCommunityUnlockingDuration != null) releaseCommunityConfig = {"Linear": {"from": ftCommunityUnlockingFrom, "duration": ftCommunityUnlockingDuration }}
  //   if (ftFoundationUnlockingDuration != null) releaseFoundationConfig = {"Linear": {"from": ftFoundationUnlockingFrom, "duration": ftFoundationUnlockingDuration }}
  //   if (ftPublicSaleUnlockingDuration != null) releasePublicSaleConfig = {"Linear": {"from": ftPublicSaleUnlockingFrom, "duration": ftPublicSaleUnlockingDuration }}

  //   const args = {
  //     total_supply: ftAmount,
  //     founders_init_distribution: ftCouncilInitDistribution,
  //     ft_metadata: {
  //       spec: "ft-1.0.0",
  //       name: ftName,
  //       symbol: accountId.toUpperCase(),
  //       icon: null, // TODO: logo in DATA URL
  //       reference: null,
  //       reference_hash: null,
  //       decimals: 0
  //     },
  //     config: {
  //       name: name,
  //       lang: location,
  //       slogan: slogan,
  //       description: slogan,
  //       council_share: ftCouncilShare,
  //       //community_share: ftCommunityShare,
  //       //foundation_share: ftFoundationShare,
  //       vote_spam_threshold: voteSpamThreshold
  //     },
  //     release_config: [
  //       ["Council", releaseCouncilConfig],
  //       //["Community", releaseCommunityConfig],
  //       //["Foundation", releaseFoundationConfig],
  //     ],
  //     vote_policy_configs: [
  //       {
  //         proposal_kind: 'Pay',
  //         duration: DateHelper.toNanoseconds(voteDurationDays, voteDurationHours, 0, 0),
  //         quorum: voteQuorum,
  //         approve_threshold: voteApproveThreshold,
  //         vote_only_once: voteOnlyOnce,
  //         waiting_open_duration: 0
  //       },
  //       {
  //         proposal_kind: 'AddMember',
  //         duration: DateHelper.toNanoseconds(voteDurationDays, voteDurationHours, 0, 0),
  //         quorum: voteQuorum,
  //         approve_threshold: voteApproveThreshold,
  //         vote_only_once: voteOnlyOnce,
  //         waiting_open_duration: 0
  //       },
  //       {
  //         proposal_kind: 'RemoveMember',
  //         duration: DateHelper.toNanoseconds(voteDurationDays, voteDurationHours, 0, 0),
  //         quorum: voteQuorum,
  //         approve_threshold: voteApproveThreshold,
  //         vote_only_once: voteOnlyOnce,
  //         waiting_open_duration: 0
  //       },
  //       {
  //         proposal_kind: 'GeneralProposal',
  //         duration: DateHelper.toNanoseconds(voteDurationDays, voteDurationHours, 0, 0),
  //         quorum: voteQuorum,
  //         approve_threshold: voteApproveThreshold,
  //         vote_only_once: voteOnlyOnce,
  //         waiting_open_duration: 0
  //       },
  //       {
  //         proposal_kind: 'AddDocFile',
  //         duration: DateHelper.toNanoseconds(voteDurationDays, voteDurationHours, 0, 0),
  //         quorum: voteQuorum,
  //         approve_threshold: voteApproveThreshold,
  //         vote_only_once: voteOnlyOnce,
  //         waiting_open_duration: 0
  //       },
  //       {
  //         proposal_kind: 'InvalidateFile',
  //         duration: DateHelper.toNanoseconds(voteDurationDays, voteDurationHours, 0, 0),
  //         quorum: voteQuorum,
  //         approve_threshold: voteApproveThreshold,
  //         vote_only_once: voteOnlyOnce,
  //         waiting_open_duration: 0
  //       },
  //       {
  //         proposal_kind: 'DistributeFT',
  //         duration: DateHelper.toNanoseconds(voteDurationDays, voteDurationHours, 0, 0),
  //         quorum: voteQuorum,
  //         approve_threshold: voteApproveThreshold,
  //         vote_only_once: voteOnlyOnce,
  //         waiting_open_duration: 0
  //       },
  //       {
  //         proposal_kind: 'RightForActionCall',
  //         duration: DateHelper.toNanoseconds(voteDurationDays, voteDurationHours, 0, 0),
  //         quorum: voteQuorum,
  //         approve_threshold: voteApproveThreshold,
  //         vote_only_once: voteOnlyOnce,
  //         waiting_open_duration: 0
  //       }
  //     ],
  //     founders: founders
  //   }
  //   // console.log(args)

  //   const args_base64 = Buffer.from(JSON.stringify(args)).toString('base64')

  //   const amount = new Decimal(amountToTransfer);
  //   const amountYokto = amount.mul(NearUtils.yoctoNear).toFixed();

  //   return this.factoryContract.create(
  //     {
  //       acc_name: accountId,
  //       public_key: publicKey,
  //       dao_info: info,
  //       args: args_base64
  //     },
  //     Decimal.mul(300, NearUtils.tGas).toString(),
  //     amountYokto.toString()
  //   );
  // }


  /**
   * Create DAO
   */
  async createDao(
    name: string,
    account: string,
    purpose: string,
    ftName: string,
    ftAmount: number|string, // maybe better as a string, can be a large number
    councilMembers: any[],
    councilReleaseAmount: number|string, // maybe better as a string, can be a large number
    councilReleaseInitDistribution: number|string,
    councilReleaseDuration: number,
    approveThreshold: number,
    quorum: number,
    voteDurationDays: number,
    voteDurationHours: number,
    voteDurationMinutes: number,
    amountToTransfer: number
  ){

    const setFtMeta = {
      spec: "ft-1.0.0",
      name: name,
      symbol: ftName, 
      icon: null, // TODO: logo in DATA URL
      reference:null,
      reference_hash:null,
      decimals:0
    }
    const setSettings = {
      name: name,
      purpose: purpose,
      tags: [1,2,3],
      dao_admin_account_id: process.env.VUE_APP_CONTRACT_NAME,
      dao_admin_rights: ["TODO"],
      workflow_provider: "wf-provider." + process.env.VUE_APP_CONTRACT_NAME
    }
    const setGroups = [
      {
        settings:{
          name: "Council",
          leader: councilMembers[0].account_id
        },
        members: councilMembers,
        release:{
          amount: councilReleaseAmount,
          init_distribution: councilReleaseInitDistribution,
          start_from: 0, // co je to
          duration: councilReleaseDuration,
          model:"Linear"
        }
      }
    ]
    const setMedia = []
    const setTags = [
      {
        category:"global",
        values:[]
      },
      {
        category:"group",
        values:[]
      },
      {
        category:"media",
        values:[]
      }
    ]
    const setFnCalls = []
    const setFnCallMeta = []

    //load templates, which will be from dao create
    const templatesNums = [1,2,3,6]
    const loadTemplates = await Promise.all(
      templatesNums.map((id) => this.providerGet(id))
    ).catch((e) => {
      throw new Error("Storage data not louded" + e);
    });

    const setWfTemplate = loadTemplates.map((temp) => temp[0])  // [workflowTemplateWfAdd]
    const setWfSettings = worlflowTemplateSettingsBuilder(
      [[{'transition_limit': 1, 'cond': null}]],
      rightTokenGroupCouncil,
      [rightTokenHolder],
      [[rightTokenGroupCouncilLeader]],
      new Decimal(DateHelper.toNanoseconds(voteDurationDays, voteDurationHours, voteDurationMinutes, 0)).div(1000000000).toNumber(),
      quorum,
      approveThreshold,
      NearUtils.nearToYocto(0.000001), // TODO: NearUtils.nearToYocto(1.0),
      NearUtils.nearToYocto(0.0000000001), // TODO: NearUtils.nearToYocto(0.0001),
      0
    )

    const args = {
      total_supply: ftAmount,
      ft_metadata: setFtMeta,
      settings: setSettings,
      groups: setGroups,
      media: setMedia,
      tags: setTags,
      function_calls: setFnCalls,
      function_call_metadata: setFnCallMeta,
      workflow_templates: setWfTemplate,
      workflow_template_settings: loFill(Array(templatesNums.length), [setWfSettings]) // [[setWfSettings]]
    }

    const args_base64 = Buffer.from(JSON.stringify(args)).toString('base64')

    const callArgs = {
      acc_name: account, 
      dao_info: {
        founded_s: new Decimal(Date.now()).dividedBy(1000).round().toNumber(),
        name: name,
        description: purpose,
        ft_name: ftName,
        ft_amount: ftAmount,
        tags: [0]
      },
      args: args_base64
    };

    return this.factoryContract.create(
      callArgs,
      300,
      amountToTransfer
    );
  }  

  /////////////////
  // DAO changes //
  /////////////////
  /**
   * Add proposal to DAO
   * 
   * 
   */
  
  async addProposal(
    content: any,
    contractId: string,
    templateId: number,
    templateSettingsId: number,
    desc: string,
    binds: any,
    storage_key: string,
    amountToTransfer: number
  ) {
    /*
    return this.contractPool.getContract(contractId).propose(
      {
        content,
        template_id: templateId,
        template_settings_id: templateSettingsId,
        desc: desc,
        propose_settings: {
          binds: binds,
          storage_key: storage_key
        },
        template_settings: null,
      },
      NearUtils.toTGas(100),
      NearUtils.nearToYocto(amountToTransfer)
    );
    */
   return null;
  }

  async addWorkflow(
    contractId: string,
    templateSettingsId: number,
    transitionConstraints: any,
    canVote: DAORights,
    canPropose: DAORights[],
    activityRights: DAORights[][],
    desc: string,
    binds: any,
    storageKey: string,
    approveThreshold: number,
    quorum: number,
    voteDurationDays: number,
    voteDurationHours: number,
    voteDurationMinutes: number,
    depositPropose: string,
    depositVote: string,
    depositProposeReturn: number,
    amountToTransfer: number
  ) {
    const amount = new Decimal(amountToTransfer);
    const amountYokto = amount.mul(NearUtils.yoctoNear).toFixed();

    const setWfSettings = worlflowTemplateSettingsBuilder(
      transitionConstraints,
      canVote,//rightTokenGroupCouncil,
      canPropose,//[rightTokenHolder],
      activityRights,//[[rightTokenGroupCouncilLeader]],
      new Decimal(DateHelper.toNanoseconds(voteDurationDays, voteDurationHours, voteDurationMinutes, 0)).div(1000000000).toNumber(),
      quorum,
      approveThreshold,
      depositPropose, // TODO: .toString(),
      depositVote, // TODO: .toString(),
      depositProposeReturn
    )
      /*
    return this.contractPool.getContract(contractId).propose(
      {
        template_id: 1,
        template_settings_id: templateSettingsId,
        desc: desc,
        propose_settings: {
          binds: binds,
          storage_key: storageKey
        },
        template_settings: [setWfSettings],
      },
      Decimal.mul(100, NearUtils.tGas).toString(),
      amountYokto.toString()
    );
    */
   return null;
  }

  async addDoc(
    contractId: string
    , name: string
    , description: string
    , ipfs_cid: string
    , categoryId: number
    , category: string
    , ext: string
    , tagsIds: number[]
    , tags: string[]
    , version: string
    , description_vote: string
    , amountToTransfer: number
    , accountId: string
  ) {
    const amount = new Decimal(amountToTransfer);
    const amountYokto = amount.mul(NearUtils.yoctoNear).toFixed();

    const args = {
      proposal_input: {
        description: null,
        description_cid: null,
        tags: tags,
      },
      tx_input: {
        AddDocFile: {
          cid: ipfs_cid,
          metadata: {
            Curr: {
              name: name,
              description: description || "",
              tags: tagsIds,
              category: categoryId,
              ext: ext,
              valid: true,
              v: version
            },
          },
          new_tags: tags,
          new_category: category
        }
      },
      account_id: accountId
    }

    //console.log(args)

    //return this.contractPool.getContract(contractId).propose(args, Decimal.mul(100, NearUtils.tGas).toString(), amountYokto.toString());
    return null;
  }

  async invalideDoc(
    contractId: string
    , ipfs_hash: string
    , description: string
    , amountToTransfer: number
    , accountId: string
  ) {
    const amount = new Decimal(amountToTransfer);
    const amountYokto = amount.mul(NearUtils.yoctoNear).toFixed();

    /*
    return this.contractPool.getContract(contractId).proposa(
      {
        proposal_input: {
          description: null,
          description_cid: null,
          tags: [],
        },
        tx_input: {
          InvalidateFile: {
            uuid: ipfs_hash
          }
        },
        account_id: accountId
      },
      Decimal.mul(100, NearUtils.tGas).toString(),
      amountYokto.toString()
    );
    */
   return;
  }

  async distributeFt(
    contractId: string
    , amount: number
    , group: string
    , accounts: string[]
    , description: string
    , amountToTransfer: number
  ) {
    const amountToTransferDecimal = new Decimal(amountToTransfer);
    const amountYokto = amountToTransferDecimal.mul(NearUtils.yoctoNear).toFixed();
    /*
    return this.contractPool.getContract(contractId).propose(
      {
        proposal_input: {
          description: description,
          description_cid: null,
          tags: [],
        },
        tx_input: {
          DistributeFT: {
            total_amount: amount,
            from_group: group,
            accounts: accounts,
          },
        },
      },
      Decimal.mul(100, NearUtils.tGas).toString(),
      amountYokto.toString()
    );
    */
   return;
  }

  /**
   * Rights proposal
   * 
   * @param contractId 
   * @param rights 
   * @param time_from 
   * @param time_to 
   * @param description_cid 
   * @param amountToTransfer 
   * @returns Provise
   */
  async rightForActionCall(
    contractId: string,
    group: string,
    rights: string[],
    time_from: Date | null,
    time_to: Date | null,
    tags: string[],
    description_cid: string,
    amountToTransfer: number
  ) {
    const amountToTransferDecimal = new Decimal(amountToTransfer);
    const amountYokto = amountToTransferDecimal.mul(NearUtils.yoctoNear).toFixed();

    /*
    return this.contractPool.getContract(contractId).propose(
      {
        proposal_input: {
          description: null,
          description_cid: description_cid,
          tags: tags,
        },
        tx_input: {
          RightForActionCall: {
            to: {
              Group: {
                value: group
              },
            },
            rights: rights, // ["RefFinance","SkywardFinance"]
            time_from: time_from,
            time_to: time_to,
          },
        },
      },
      Decimal.mul(100, NearUtils.tGas).toString(),
      amountYokto.toString()
    );
    */
   return;
  }

  /**
   * Execution privileged action
   * 
   * @param contractId 
   * @param action 
   * @param params 
   * @param amountToTransfer 
   * @returns Promise
   */
  async executePrivilegedAction(
    contractId: string,
    action: string,
    params: object,
  ) {
    throw new DeprecatedError('executeProvilegedAction moved to Workflow');
    /*
    const actionBody = params !== null ? loSet({}, action, params) : action
    return this.contractPool.getContract(contractId).execute_privileged_action(
      {
        action: actionBody
      },
      Decimal.mul(300, NearUtils.tGas).toString()
    );
    */
  }

  /**
   * Voting in proposal
   */
  async vote(
    contractId: string,
    proposalId: number,
    vote: number
  ) {
    return this.contractPool.getContract(contractId).proposalVote(proposalId, vote, 10, 0.00125).actionsRun();
  }

  /**
   * Finalize proposal
   */
  async finalize(
    contractId: string,
    proposalId: number
  ) {
    return this.contractPool.getContract(contractId).proposalFinish(proposalId, 100).actionsRun();
  }

  async wfFinish(contractId: string, proposalId: number) {
    // return this.contractPool.getContract(contractId).wfFinish(proposalId, NearUtils.toTGas(10));
    return;
  }
  
  async unlockTokens(contractId: string, group: string) {
    throw new DeprecatedError('executeProvilegedAction moved to Workflow');
    // return this.contractPool.getContract(contractId).unlock_tokens({group: group}, Decimal.mul(10, NearUtils.tGas).toString());
  }

  
  async unlockAllTokens(contractId: string) {
    const account = this.walletConnection.account();

    return account.signAndSendTransaction({
       receiverId: contractId,
       actions: [
          transactions.functionCall('unlock_tokens', Buffer.from(JSON.stringify({group: 'Council'})), new BN(10).mul(new BN(NearUtils.tGas)), new BN(0)),
          // transactions.functionCall('unlock_tokens', Buffer.from(JSON.stringify({group: 'Community'})), new BN(10).mul(new BN(NearUtils.tGas)), new BN(0)),
          // transactions.functionCall('unlock_tokens', Buffer.from(JSON.stringify({group: 'Foundation'})), new BN(10).mul(new BN(NearUtils.tGas)), new BN(0)),
          transactions.functionCall('unlock_tokens', Buffer.from(JSON.stringify({group: 'Public'})), new BN(10).mul(new BN(NearUtils.tGas)), new BN(0)),
       ]
    });
  }

  async signAndSendTransactions(contractId: string, actions:  TransactionAction[]) {
    const account = this.walletConnection.account();

    return account.signAndSendTransaction({
        receiverId: contractId,
        actions: actions.map((action:  TransactionAction) => 
            transactions.functionCall(action.methodName, Buffer.from(JSON.stringify(action.args)), new BN(NearUtils.toTGas(action.tGas)), new BN(NearUtils.nearToYocto(action.nearDeposit)))
        )
    });
  }

  async downloadNewVersion(contractId: string){
    //return this.contractPool.getContract(contractId).upgradeDownload((this.walletConnection) ? this.walletConnection.getAccountId() : null, NearUtils.toTGas(300));
  }

  async upgrade(contractId: string){
    //return this.contractPool.getContract(contractId).upgradeMigrate((this.walletConnection) ? this.walletConnection.getAccountId() : null, NearUtils.toTGas(300));
  }

  ///////////////
  // DAO VIEWs //
  ///////////////
  async getDaoState(contractId: string) {
    const account = await this.near.account(contractId);

    return account.state();
  }

  async getDaoById(daoAccount: string) {
    return;
    const daoId = daoAccount.split('.')[0]

    // console.log(daoId)
    const data = await Promise.all([
      this.getDaoAmount(daoAccount),
      this.getDaoInfo(daoId),
      this.getStatisticsMembers(daoAccount),
      this.getStatisticsFt(daoAccount),
      this.getProposals(daoAccount, 0, 1000),
      this.getDocFiles(daoAccount),
      this.getDaoConfig(daoAccount),
      this.getTags(),
      this.getVotePolicies(daoAccount),
      this.getSkywardAuctions(daoAccount),
    ]).catch((e) => {
      console.log(e)
    });

    if (!data) {
      return null;
    }
    console.log(data)

    const amount = new Decimal(data[0])
    const amountDeposit = new Decimal(data[3].storage_locked_near).div(NearUtils.yoctoNear).mul(100).round().div(100)
    const ft_council_free = new Decimal(data[3].council_ft_stats.unlocked).minus(data[3].council_ft_stats.distributed).toNumber()
    //const ft_community_free = new Decimal(data[3].community_ft_stats.unlocked).minus(data[3].community_ft_stats.distributed).toNumber()
    //const ft_foundation_free = new Decimal(data[3].foundation_ft_stats.unlocked).minus(data[3].foundation_ft_stats.distributed).toNumber()
    const ft_public_free = new Decimal(data[3].public_ft_stats.unlocked).minus(data[3].public_ft_stats.distributed)

    // token state
    const members = data[2].council
    const member_promises: any[] = []
    members.forEach((accountId: string) => {
      member_promises.push(this.getFtBalanceOf(daoAccount, accountId))
    });

    // action rights
    let council_rights = []
    const now_nanoseconds = new Decimal(new Date().valueOf()).mul(1_000_000).toNumber()
    // council
    if (data[2].council_rights != undefined) {
      council_rights = data[2].council_rights.filter( right => right[1].from <= now_nanoseconds && now_nanoseconds <= right[1].to).map( right => right[0])
    }

    //console.log(member_promises)
    const balances = await Promise.all(member_promises).catch((e) => {
      console.log(e)
    });
    const token_account: {[index: string]: any} = {}
    members.forEach((accountId: string, index: number) => {
      token_account[accountId] = new Decimal((balances) ? balances[index] : 0).toNumber()
    });
    //console.log(token_account)

    // Mapping Doc files tags and categories
    const file_list: any[] = [];
    let doc: any = {}
    data[5].files.forEach((element: any[]) => {
      const elementData = element[1].Curr
      doc = {
        name: elementData.name,
        ext: elementData.ext,
        description: elementData.description,
        valid: elementData.valid,
        category: data[5].map["Doc"].categories[elementData.category],
        ipfs_cid: element[0],
        version: elementData.v ?? '1.0',
        tags: new Array(),
      }
      for (const [i, val] of elementData.tags.entries()) {
        //doc.tags[i] = data[5].map["Doc"].tags[val]
        doc.tags.push(loToString(data[5].map["Doc"].tags[val]))
      }
      file_list.push(doc)
    });    

    // vote policies
    const vote_policies: any = {}
    data[8].forEach(element => {
      loSet(vote_policies, element[0], element[1])
    });

      

    if (data !== null) {
      return {
        id: daoId,
        name: data[1].name,
        state: null,
        created: new Date(new Decimal(data[1].founded_s).mul(1000).toNumber()),
        slogan: data[1].description,
        description: data[1].description,
        wallet: daoAccount,
        address: null,
        domain: null,
        web: null,
        location: data[6].lang, // TODO: renameing at SC
        token: data[1].ft_amount,
        token_name: data[1].ft_name,
        version: data[6].version,
        token_stats: {
          decimals: data[3].decimals,
          council: {
            total: data[3].council_ft_stats.total,
            init: data[3].council_ft_stats.init_distribution,
            distributed: data[3].council_ft_stats.distributed,
            unlocked: data[3].council_ft_stats.unlocked,
            free: ft_council_free,
            algorithm: (typeof data[3].council_release_model === 'string') ? data[3].council_release_model : Object.keys(data[3].council_release_model)[0],
            duration: (data[3].council_release_model.Linear != undefined) ? data[3].council_release_model.Linear.duration : null,
            release_end: (data[3].council_release_model.Linear != undefined) ? data[3].council_release_model.Linear.release_end : null,
          },
          public: {total: data[3].public_ft_stats.total,
            init: data[3].public_ft_stats.init_distribution,
            distributed: data[3].public_ft_stats.distributed,
            unlocked: data[3].public_ft_stats.unlocked,
            free: ft_public_free,
            algorithm: (typeof data[3].public_release_model === 'string') ? data[3].public_release_model : Object.keys(data[3].public_release_model)[0],
            duration: (data[3].public_release_model.Linear != undefined) ? data[3].public_release_model.Linear.duration : null,
            release_end: (data[3].public_release_model.Linear != undefined) ? data[3].public_release_model.Linear.release_end : null,},
        },
        token_free: new Decimal(ft_council_free).plus(ft_public_free).toNumber(),
        token_holded: data[3].total_distributed,
        token_holders: token_account,
        groups: {
          council: {
            amount: data[2].council_share_percent,
            wallets: data[2].council,
            rights: council_rights,
          },
          public: {
            amount: NearUtils.getPublicSalePercent(data[2].council_share_percent, 0, 0),
            wallets: [],
            rights: [],
          },
        },
        tags: data[1].tags.map((tag: number) => data[7][tag]), // system tag
        treasury: {
          nearTotal: amount,
          nearStorageLocked: amountDeposit,
          near: amount.minus(amountDeposit),
          w_delta: null,
          currency: 'czk',
          currency_amount: null
        },
        market: {
          near: null,
          w_delta: null,
          eth: null,
          btc: null,
          currency: 'czk',
          currency_amount: null
        },
        auction: {
          skyward_finance: data[9],
        },
        proposals: data[4],
        docs: {
          files: file_list,
          map: data[5].map.Doc || {categories: []}
        },
        vote_policies: vote_policies,
      };
    }

    return null
  }

  async getDaoAmount(contractId: string) {
    const state = await this.getDaoState(contractId);
    const amountYokto = new Decimal(state.amount);

    return amountYokto.div(NearUtils.yoctoNear).toFixed(2);
  }

  async getDaosAmount(contractIds: string[]) {
    const result: {[index: string]: any} = {}

    const promises: any[] = []
    contractIds.forEach((accountId: string) => {
      promises.push(this.getDaoState(accountId))
    });
    //console.log(promises)
    const states = await Promise.all(promises).catch((e) => {
      console.log(e)
    });
    // console.log(states)

    contractIds.forEach((accountId: string, index: number) => {
      const amountYokto = new Decimal(states[index].amount)
      loSet(result, [index], amountYokto.div(NearUtils.yoctoNear).toFixed(2))
    })

    return result
  }

  async getStatisticsMembers(contractId: string) {
    // return this.contractPool.getContract(contractId).getStatisticsMembers();
    return new Promise(() => { return ;})
  }

  async getStatisticsFt(contractId: string) {
    // return this.contractPool.getContract(contractId).getStatisticsFt();
    return new Promise(() => { return ;})
  }

  async getProposals(contractId: string, fromIndex: number, limit: number) {
    return this.contractPool.getContract(contractId).proposals(fromIndex ?? 0, limit ?? 1000);
  }

  async getDocFiles(contractId: string) {
    // return this.contractPool.getContract(contractId).getDocFiles();
    return new Promise(() => { return ;})
  }

  async getFtBalanceOf(contractId: string, accountId: string) {
    //return this.contractPool.getContract(contractId).getFtBalanceOf(accountId);
    return new Promise(() => { return ;})
  }

  async getDaoConfig(contractId: string) {
    //return this.contractPool.getContract(contractId).getDaoConfig();
    return new Promise(() => { return ;})
  }

  async getVotePolicies(contractId: string) {
    //return this.contractPool.getContract(contractId).getVotePolicies();
    return new Promise(() => { return ;})
  }

  async getDaoVersionHash(contractId: string) {
    //return this.contractPool.getContract(contractId).getDaoVersionHash();
    return new Promise(() => { return ;})
  }

  async getSkywardAuctions(contractId: string) {
    //return this.contractPool.getContract(contractId).getSkywardAuctions();
    return new Promise(() => { return ;})
  }

  async getRefPools(contractId: string) {
    //return this.contractPool.getContract(contractId).getRefPools();
    return new Promise(() => { return ;})
  }

  async getWfTemplates(contractId: string) {
    return this.contractPool.getContract(contractId).wfTemplates();
  }

  async getGroups(contractId: string) {
    return this.contractPool.getContract(contractId).groups();
  }

  async getGroupTags(contractId: string) {
    return this.contractPool.getContract(contractId).tags('group');
  }

  async getMediaTags(contractId: string) {
    return this.contractPool.getContract(contractId).tags('media');
  }

  async getGlobalTags(contractId: string){
    return this.contractPool.getContract(contractId).tags('global');
  }

  async getMediaList(contractId: string) {
    //return this.contractPool.getContract(contractId).getMediaList();
    return new Promise(() => { return ;})
  }

  async getDaoSettings(contractId: string){
    return this.contractPool.getContract(contractId).settings()
  }

  async getWfInstance(contractId: string, proposalId: number){
    return this.contractPool.getContract(contractId).wfInstance(proposalId);
  }

  async getWfInstanceLog(contractId: string, proposalId: number){
    return this.contractPool.getContract(contractId).wfLog(proposalId);
  }

  async getStats(contractId: string){
    return this.contractPool.getContract(contractId).statistics();
  }

  async getFtMetadata(contractId: string){
    //return this.contractPool.getContract(contractId).getFtMetadata();
    return new Promise(() => { return ;})
  }

  async getStorage(contractId: string) {
    // getStorage keys
    const storageKeys: string[] = await this.contractPool.getContract(contractId).storageBuckets()
  
    // load data
    const data = await Promise.all(
      storageKeys.map((key: string) => this.contractPool.getContract(contractId).storageBucketDataAll(key))
    ).catch((e) => {
      throw new Error("Storage data not louded" + e);
    });

    const result: Record<string, unknown> = {}
    storageKeys.forEach((key, index) => loSet(result, [key], data[index]))
    
    return result
  }
}

export default NearService;
