import {
  connect,
  Contract,
  transactions,
  keyStores,
  WalletConnection
} from 'near-api-js';
import { toNanoseconds } from '@/utils/date';

import Decimal from 'decimal.js';
import BN from 'bn.js';

import { yoctoNear, TGas } from './constants';
import { ContractPool } from './ContractPool';
import { getPublicSalePercent } from './utils';
import _ from "lodash"
import loSet from "lodash/set"
import { duration } from 'moment';
import { rightTokenGroupCouncil, rightTokenGroupCouncilLeader, rightTokenHolder } from '@/data/dao';
import { workflowTemplateWfAdd, workflowTemplateWfNearSend, worlflowTemplateSettingsBuilder } from '@/data/workflow';
import { nearToYocto, toTGas } from '@/utils/near';
import { DAORights } from '@/types/dao';
import { TransactionAction } from "@/types/blockchain";
import loFill from 'lodash/fill'

class NearService {
  // config of near
  config: any;

  // factory contract
  factoryContract!: Contract & any;

  // provider contract
  providerContract!: Contract & any;

  // wallet
  walletConnection!: WalletConnection & any;

  // near API
  near!: any;

  // contracts
  contractPool!: ContractPool;

  constructor(config: any) {
    this.config = config;
  }

  async init() {
    this.near = await connect(Object.assign({
      deps: {
        keyStore: new keyStores.BrowserLocalStorageKeyStore()
      }
    }, this.config));

    this.walletConnection = new WalletConnection(this.near, (process.env.VUE_APP_NEAR_CONTRACT_NAME || null));

    const account = this.walletConnection.account();

    this.factoryContract = new Contract(account, this.config.contractName, {
      viewMethods: [
        'get_dao_list',
        'get_dao_info',
        'get_tags',
        'get_stats',
        'version_hash'
      ],
      changeMethods: [
        'create',
        'add_tags',
      ],
    });

    this.providerContract = new Contract(account, 'wf-provider.' + process.env.VUE_APP_CONTRACT_NAME, {
      viewMethods: [
        'wf_templates',
        'wf_template',
        'wf_template_fncalls',
        'fncalls_metadata',
      ],
      changeMethods: [
      ],
    });

    this.contractPool = new ContractPool(account);
  }

  isInitialized() {
    return !!this.near && !!this.walletConnection && !!this.factoryContract;
  }

  isAuthorized() {
    return this.walletConnection.isSignedIn();
  }

  signIn() {
    return this.walletConnection.requestSignIn(this.config.contractName, this.config.name);
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
    return this.providerContract.wf_templates();
  }

  /**
   * Provider: Get
   */
   async providerGet(id: number) {
    return this.providerContract.wf_template({id: id});
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
    return this.factoryContract.get_dao_list({from_index: 0, limit: 100});
  }

  /**
   * Get tags
   * @returns
   */
  async getTags() {
    return this.factoryContract.get_tags();
  }

  /**
   * Get dao info
   * 
   * @returns Promise
   */
  async getDaoInfo(daoId: string) {
    return this.factoryContract.get_dao_info({account: daoId});
  }

  /**
   * Get dao stats
   * 
   * @returns Promise
   */
  async getDaoStats() {
    return this.factoryContract.get_stats();
  }

  /**
   * Get newest version hash of contract
   * 
   * @returns Promise
   */
  async getNewestVersionHash() {
    return this.factoryContract.version_hash({version:0});
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
  //         duration: toNanoseconds(voteDurationDays, voteDurationHours, 0, 0),
  //         quorum: voteQuorum,
  //         approve_threshold: voteApproveThreshold,
  //         vote_only_once: voteOnlyOnce,
  //         waiting_open_duration: 0
  //       },
  //       {
  //         proposal_kind: 'AddMember',
  //         duration: toNanoseconds(voteDurationDays, voteDurationHours, 0, 0),
  //         quorum: voteQuorum,
  //         approve_threshold: voteApproveThreshold,
  //         vote_only_once: voteOnlyOnce,
  //         waiting_open_duration: 0
  //       },
  //       {
  //         proposal_kind: 'RemoveMember',
  //         duration: toNanoseconds(voteDurationDays, voteDurationHours, 0, 0),
  //         quorum: voteQuorum,
  //         approve_threshold: voteApproveThreshold,
  //         vote_only_once: voteOnlyOnce,
  //         waiting_open_duration: 0
  //       },
  //       {
  //         proposal_kind: 'GeneralProposal',
  //         duration: toNanoseconds(voteDurationDays, voteDurationHours, 0, 0),
  //         quorum: voteQuorum,
  //         approve_threshold: voteApproveThreshold,
  //         vote_only_once: voteOnlyOnce,
  //         waiting_open_duration: 0
  //       },
  //       {
  //         proposal_kind: 'AddDocFile',
  //         duration: toNanoseconds(voteDurationDays, voteDurationHours, 0, 0),
  //         quorum: voteQuorum,
  //         approve_threshold: voteApproveThreshold,
  //         vote_only_once: voteOnlyOnce,
  //         waiting_open_duration: 0
  //       },
  //       {
  //         proposal_kind: 'InvalidateFile',
  //         duration: toNanoseconds(voteDurationDays, voteDurationHours, 0, 0),
  //         quorum: voteQuorum,
  //         approve_threshold: voteApproveThreshold,
  //         vote_only_once: voteOnlyOnce,
  //         waiting_open_duration: 0
  //       },
  //       {
  //         proposal_kind: 'DistributeFT',
  //         duration: toNanoseconds(voteDurationDays, voteDurationHours, 0, 0),
  //         quorum: voteQuorum,
  //         approve_threshold: voteApproveThreshold,
  //         vote_only_once: voteOnlyOnce,
  //         waiting_open_duration: 0
  //       },
  //       {
  //         proposal_kind: 'RightForActionCall',
  //         duration: toNanoseconds(voteDurationDays, voteDurationHours, 0, 0),
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
  //   const amountYokto = amount.mul(yoctoNear).toFixed();

  //   return this.factoryContract.create(
  //     {
  //       acc_name: accountId,
  //       public_key: publicKey,
  //       dao_info: info,
  //       args: args_base64
  //     },
  //     Decimal.mul(300, TGas).toString(),
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
        values:["test dao", "new", "top"]
      },
      {
        category:"group",
        values:["CEO", "CTO", "no idea", "good guy"]
      },
      {
        category:"media",
        values:["very important", "probably virus"]
      }
    ]
    const setFnCalls = []
    const setFnCallMeta = []

    //load templates, which will be from dao create
    const templatesNums = [1,2,3,4,5,6]
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
      new Decimal(toNanoseconds(voteDurationDays, voteDurationHours, voteDurationMinutes, 0)).div(1000000000).toNumber(),
      quorum,
      approveThreshold,
      nearToYocto(0.000001), // TODO: nearToYocto(1.0),
      nearToYocto(0.0000000001), // TODO: nearToYocto(0.0001),
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

    return this.factoryContract.create(
      {
        acc_name: account, 
        dao_info: {
          founded_s: new Decimal(Date.now()).dividedBy(1000).round().toNumber(),
          name: name,
          description: purpose,
          ft_name: ftName,
          ft_amount: ftAmount,
          tags: [0,1,2]
        },
          args: args_base64
      },
      toTGas(300),
      nearToYocto(amountToTransfer)
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
    contractId: string,
    templateId: number,
    templateSettingsId: number,
    binds: any,
    storage_key: string,
    amountToTransfer: number
  ) {
    return this.contractPool.get(contractId).propose(
      {
        template_id: templateId,
        template_settings_id: templateSettingsId,
        propose_settings: {
          binds: binds,
          storage_key: storage_key
        },
        template_settings: null,
      },
      toTGas(100),
      nearToYocto(amountToTransfer)
    );
  }

  async addWorkflow(
    contractId: string,
    templateSettingsId: number,
    transitionConstraints: any,
    canVote: DAORights,
    canPropose: DAORights[],
    activityRights: DAORights[][],
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
    const amountYokto = amount.mul(yoctoNear).toFixed();

    const setWfSettings = worlflowTemplateSettingsBuilder(
      transitionConstraints,
      canVote,//rightTokenGroupCouncil,
      canPropose,//[rightTokenHolder],
      activityRights,//[[rightTokenGroupCouncilLeader]],
      new Decimal(toNanoseconds(voteDurationDays, voteDurationHours, voteDurationMinutes, 0)).div(1000000000).toNumber(),
      quorum,
      approveThreshold,
      depositPropose, // TODO: .toString(),
      depositVote, // TODO: .toString(),
      depositProposeReturn
    )

    return this.contractPool.get(contractId).propose(
      {
        template_id: 1,
        template_settings_id: templateSettingsId,
        propose_settings: {
          binds: binds,
          storage_key: storageKey
        },
        template_settings: [setWfSettings],
      },
      Decimal.mul(100, TGas).toString(),
      amountYokto.toString()
    );
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
    const amountYokto = amount.mul(yoctoNear).toFixed();

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

    return this.contractPool.get(contractId).add_proposal(args, Decimal.mul(100, TGas).toString(), amountYokto.toString());
  }

  async invalideDoc(
    contractId: string
    , ipfs_hash: string
    , description: string
    , amountToTransfer: number
    , accountId: string
  ) {
    const amount = new Decimal(amountToTransfer);
    const amountYokto = amount.mul(yoctoNear).toFixed();

    return this.contractPool.get(contractId).add_proposal(
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
      Decimal.mul(100, TGas).toString(),
      amountYokto.toString()
    );
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
    const amountYokto = amountToTransferDecimal.mul(yoctoNear).toFixed();

    return this.contractPool.get(contractId).add_proposal(
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
      Decimal.mul(100, TGas).toString(),
      amountYokto.toString()
    );
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
    const amountYokto = amountToTransferDecimal.mul(yoctoNear).toFixed();

    return this.contractPool.get(contractId).add_proposal(
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
      Decimal.mul(100, TGas).toString(),
      amountYokto.toString()
    );
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

    const actionBody = params !== null ? _.set({}, action, params) : action
    
    return this.contractPool.get(contractId).execute_privileged_action(
      {
        action: actionBody
      },
      Decimal.mul(300, TGas).toString()
    );
  }

  /**
   * Voting in proposal
   */
  async vote(
    contractId: string,
    proposalId: number,
    vote: number
  ) {
    return this.contractPool.get(contractId).vote(
      {
        proposal_id: proposalId,
        vote_kind: vote,
      },
      toTGas(10),
      nearToYocto(0.00125) // TODO: Get from template settings
    );
  }

  /**
   * Finalize proposal
   */
  async finalize(
    contractId: string,
    proposalId: number
  ) {
    return this.contractPool.get(contractId).finish_proposal(
      {
        proposal_id: proposalId,
      },
      toTGas(100)
    );
  }

  async wfFinish(contractId: string, proposalId: number) {
    return this.contractPool.get(contractId).wf_finish({proposal_id: proposalId}, Decimal.mul(10, TGas).toString());
  }
  
  async unlockTokens(contractId: string, group: string) {
    return this.contractPool.get(contractId).unlock_tokens({group: group}, Decimal.mul(10, TGas).toString());
  }

  
  async unlockAllTokens(contractId: string) {
    const account = this.walletConnection.account();

    return account.signAndSendTransaction({
       receiverId: contractId,
       actions: [
          transactions.functionCall('unlock_tokens', Buffer.from(JSON.stringify({group: 'Council'})), new BN(10).mul(new BN(TGas)), new BN(0)),
          // transactions.functionCall('unlock_tokens', Buffer.from(JSON.stringify({group: 'Community'})), new BN(10).mul(new BN(TGas)), new BN(0)),
          // transactions.functionCall('unlock_tokens', Buffer.from(JSON.stringify({group: 'Foundation'})), new BN(10).mul(new BN(TGas)), new BN(0)),
          transactions.functionCall('unlock_tokens', Buffer.from(JSON.stringify({group: 'Public'})), new BN(10).mul(new BN(TGas)), new BN(0)),
       ]
    });
  }

  async signAndSendTransactions(contractId: string, actions:  TransactionAction[]) {
    const account = this.walletConnection.account();

    return account.signAndSendTransaction({
        receiverId: contractId,
        actions: actions.map((action:  TransactionAction) => 
            transactions.functionCall(action.methodName, Buffer.from(JSON.stringify(action.args)), new BN(action.gas).mul(new BN(TGas)), new BN(action.deposit))
        )
    });
  }

  async downloadNewVersion(contractId: string){
    return this.contractPool.get(contractId).download_new_version(
      {
        account_id: (this.walletConnection) ? this.walletConnection.getAccountId() : null
      },
      Decimal.mul(300, TGas).toString()
    );
  }

  async upgrade(contractId: string){
    return this.contractPool.get(contractId).upgrade_self(
      {
        account_id: (this.walletConnection) ? this.walletConnection.getAccountId() : null
      },
      Decimal.mul(300, TGas).toString()
    );
  }

  ///////////////
  // DAO VIEWs //
  ///////////////
  async getDaoState(contractId: string) {
    const account = await this.near.account(contractId);

    return account.state();
  }

  async getDaoById(daoAccount: string) {
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
    const amountDeposit = new Decimal(data[3].storage_locked_near).div(yoctoNear).mul(100).round().div(100)
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
        doc.tags.push(_.toString(data[5].map["Doc"].tags[val]))
      }
      file_list.push(doc)
    });    

    // vote policies
    const vote_policies: any = {}
    data[8].forEach(element => {
      _.set(vote_policies, element[0], element[1])
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
            amount: getPublicSalePercent(data[2].council_share_percent, 0, 0),
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

    return amountYokto.div(yoctoNear).toFixed(2);
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
      _.set(result, [index], amountYokto.div(yoctoNear).toFixed(2))
    })

    return result
  }

  async getStatisticsMembers(contractId: string) {
    return this.contractPool.get(contractId).statistics_members();
  }

  async getStatisticsFt(contractId: string) {
    return this.contractPool.get(contractId).statistics_ft();
  }

  async getProposals(contractId: string, fromIndex: number, limit: number) {
    return this.contractPool.get(contractId).proposals({
      from_index: fromIndex ?? 0,
      limit: limit ?? 1000
    });
  }

  async getDocFiles(contractId: string) {
    return this.contractPool.get(contractId).doc_files();
  }

  async getFtBalanceOf(contractId: string, accountId: string) {
    return this.contractPool.get(contractId).ft_balance_of({account_id: accountId});
  }

  async getDaoConfig(contractId: string) {
    return this.contractPool.get(contractId).dao_config();
  }

  async getVotePolicies(contractId: string) {
    return this.contractPool.get(contractId).vote_policies();
  }

  async getDaoVersionHash(contractId: string) {
    return this.contractPool.get(contractId).version_hash();
  }

  async getSkywardAuctions(contractId: string) {
    return this.contractPool.get(contractId).skyward_auctions();
  }

  async getRefPools(contractId: string) {
    return this.contractPool.get(contractId).ref_pools();
  }

  async getWfTemplates(contractId: string) {
    return this.contractPool.get(contractId).wf_templates();
  }

  async getGroups(contractId: string) {
    return this.contractPool.get(contractId).groups();
  }
  async getGroupTags(contractId: string) {
    return this.contractPool.get(contractId).tags({category: "group"});
  }
  async getMediaTags(contractId: string) {
    return this.contractPool.get(contractId).tags({category: "media"});
  }
  async getGlobalTags(contractId: string){
    return this.contractPool.get(contractId).tags({category: "global"});
  }
  async getMediaList(contractId: string) {
    return this.contractPool.get(contractId).media_list();
  }

  async getDaoSettings(contractId: string){
    return this.contractPool.get(contractId).dao_settings()
  }

  async getWfInstance(contractId: string, proposalId: number){
    return this.contractPool.get(contractId).wf_instance({proposal_id: proposalId})
  }

  async getWfInstanceLog(contractId: string, proposalId: number){
    return this.contractPool.get(contractId).wf_log({proposal_id: proposalId})
  }

  async getStats(contractId: string){
    return this.contractPool.get(contractId).stats()
  }

  async getFtMetadata(contractId: string){
    return this.contractPool.get(contractId).ft_metadata()
  }

  async getStorage(contractId: string) {
    // get keys
    const storageKeys: string[] = await this.contractPool.get(contractId).storage_buckets()
  
    // load data
    const data = await Promise.all(
      storageKeys.map((key: string) => this.contractPool.get(contractId).storage_bucket_data_all({bucket_id: key}))
    ).catch((e) => {
      throw new Error("Storage data not louded" + e);
    });

    const result: Record<string, unknown> = {}
    storageKeys.forEach((key, index) => loSet(result, [key], data[index]))
    
    return result
  }


}

export default NearService;
