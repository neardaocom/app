import {
  connect,
  Contract,
  transactions,
  keyStores,
  WalletConnection,
} from 'near-api-js';
import { toNanoseconds } from '@/utils/date';


import Decimal from 'decimal.js';
import BN from 'bn.js';

import { yoctoNear, TGas } from './constants';
import { ContractPool } from './ContractPool';
import { getPublicSalePercent } from './utils';
import _ from "lodash"

class NearService {
  // config of near
  config: any;

  // factory contract
  factoryContract!: Contract & any;

  // wallet
  walletConnection!: WalletConnection;

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
      ],
      changeMethods: [
        'create',
        'add_tags',
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

  async signOut() {
    this.walletConnection.signOut();
  }

  async getAccount() {
    return this.walletConnection.getAccountId();
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
   * Create DAO
   */
  async createDao(
    accountId: string
    , publicKey: string
    , name: string
    , slogan: string
    , tags: number[]
    , founders: string[]
    , location: string
    , ftName: string
    , ftAmount: number
    , ftCouncilShare: number
    , ftCouncilInitDistribution: number
    , ftCouncilUnlockingFrom: number
    , ftCouncilUnlockingDuration: number
    , ftCommunityShare: number
    , ftCommunityUnlockingFrom: number
    , ftCommunityUnlockingDuration: number
    , ftFoundationShare: number
    , ftFoundationUnlockingFrom: number
    , ftFoundationUnlockingDuration: number
    , ftPublicSaleUnlockingFrom: number
    , ftPublicSaleUnlockingDuration: number
    , voteSpamThreshold: number
    , voteDurationDays: number
    , voteDurationHours: number
    , voteQuorum: number
    , voteApproveThreshold: number
    , voteOnlyOnce: boolean
    , amountToTransfer: number
  ) {
    const info = {
      name: name,
      tags: tags,
      founded_s: new Decimal(Date.now()).dividedBy(1000).round().toNumber(),
      description: slogan,
      ft_name: ftName,
      ft_amount: ftAmount
    };
    // console.log(info)

    let releaseCouncilConfig: any = "None";
    let releaseCommunityConfig: any = "None";
    let releaseFoundationConfig: any = "None";
    let releasePublicSaleConfig: any = "None";

    if (ftCouncilUnlockingDuration != null) releaseCouncilConfig = {"Linear": {"from": ftCouncilUnlockingFrom, "duration": ftCouncilUnlockingDuration }}
    if (ftCommunityUnlockingDuration != null) releaseCommunityConfig = {"Linear": {"from": ftCommunityUnlockingFrom, "duration": ftCommunityUnlockingDuration }}
    if (ftFoundationUnlockingDuration != null) releaseFoundationConfig = {"Linear": {"from": ftFoundationUnlockingFrom, "duration": ftFoundationUnlockingDuration }}
    if (ftPublicSaleUnlockingDuration != null) releasePublicSaleConfig = {"Linear": {"from": ftPublicSaleUnlockingFrom, "duration": ftPublicSaleUnlockingDuration }}

    const args = {
      total_supply: ftAmount,
      founders_init_distribution: ftCouncilInitDistribution,
      ft_metadata: {
        spec: "ft-1.0.0",
        name: ftName,
        symbol: accountId.toUpperCase(),
        icon: null,
        reference: null,
        reference_hash: null,
        decimals: 0
      },
      config: {
        name: name,
        lang: location,
        slogan: slogan,
        description: slogan,
        council_share: ftCouncilShare,
        community_share: ftCommunityShare,
        foundation_share: ftFoundationShare,
        vote_spam_threshold: voteSpamThreshold
      },
      release_config: [
        ["Council", releaseCouncilConfig],
        ["Community", releaseCommunityConfig],
        ["Foundation", releaseFoundationConfig],
      ],
      vote_policy_configs: [
        {
          proposal_kind: 'SendNear',
          duration: toNanoseconds(voteDurationDays, voteDurationHours, 0, 0),
          quorum: voteQuorum,
          approve_threshold: voteApproveThreshold,
          vote_only_once: voteOnlyOnce,
          waiting_open_duration: 0
        },
        {
          proposal_kind: 'AddMember',
          duration: toNanoseconds(voteDurationDays, voteDurationHours, 0, 0),
          quorum: voteQuorum,
          approve_threshold: voteApproveThreshold,
          vote_only_once: voteOnlyOnce,
          waiting_open_duration: 0
        },
        {
          proposal_kind: 'RemoveMember',
          duration: toNanoseconds(voteDurationDays, voteDurationHours, 0, 0),
          quorum: voteQuorum,
          approve_threshold: voteApproveThreshold,
          vote_only_once: voteOnlyOnce,
          waiting_open_duration: 0
        },
        {
          proposal_kind: 'RegularPayment',
          duration: toNanoseconds(voteDurationDays, voteDurationHours, 0, 0),
          quorum: voteQuorum,
          approve_threshold: voteApproveThreshold,
          vote_only_once: voteOnlyOnce,
          waiting_open_duration: 0
        },
        {
          proposal_kind: 'GeneralProposal',
          duration: toNanoseconds(voteDurationDays, voteDurationHours, 0, 0),
          quorum: voteQuorum,
          approve_threshold: voteApproveThreshold,
          vote_only_once: voteOnlyOnce,
          waiting_open_duration: 0
        },
        {
          proposal_kind: 'AddDocFile',
          duration: toNanoseconds(voteDurationDays, voteDurationHours, 0, 0),
          quorum: voteQuorum,
          approve_threshold: voteApproveThreshold,
          vote_only_once: voteOnlyOnce,
          waiting_open_duration: 0
        },
        {
          proposal_kind: 'InvalidateFile',
          duration: toNanoseconds(voteDurationDays, voteDurationHours, 0, 0),
          quorum: voteQuorum,
          approve_threshold: voteApproveThreshold,
          vote_only_once: voteOnlyOnce,
          waiting_open_duration: 0
        },
        {
          proposal_kind: 'DistributeFT',
          duration: toNanoseconds(voteDurationDays, voteDurationHours, 0, 0),
          quorum: voteQuorum,
          approve_threshold: voteApproveThreshold,
          vote_only_once: voteOnlyOnce,
          waiting_open_duration: 0
        }
      ],
      founders: founders
    }
    // console.log(args)

    const args_base64 = Buffer.from(JSON.stringify(args)).toString('base64')

    const amount = new Decimal(amountToTransfer);
    const amountYokto = amount.mul(yoctoNear).toFixed();

    return this.factoryContract.create(
      {
        acc_name: accountId,
        public_key: publicKey,
        dao_info: info,
        args: args_base64
      },
      Decimal.mul(300, TGas).toString(),
      amountYokto.toString()
    );
  }

  /////////////////
  // DAO changes //
  /////////////////
  /**
   * Add proposal to DAO
   */
  async addProposal(
    contractId: string
    , description: string
    , tags: any
    , transactions: any
    , amountToTransfer: number
    , accountId: string
  ) {
    const amount = new Decimal(amountToTransfer);
    const amountYokto = amount.mul(yoctoNear).toFixed();

    return this.contractPool.get(contractId).add_proposal(
      {
        proposal_input: {
          description: description,
          tags: tags,
        },
        tx_input: transactions,
        account_id: accountId
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
        account_id: (this.walletConnection) ? this.walletConnection.getAccountId() : null
      },
      Decimal.mul(10, TGas).toString()
      , new Decimal(0.00125).mul(yoctoNear).toFixed()
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
        account_id: (this.walletConnection) ? this.walletConnection.getAccountId() : null
      },
      Decimal.mul(100, TGas).toString()
    );
  }

  
  async unlockTokens(contractId: string, group: string) {
    return this.contractPool.get(contractId).unlock_tokens({group: group}, Decimal.mul(10, TGas).toString());
  }

  async unlockAllTokens(contractId: string) {
    // const account = this.walletConnection._connectedAccount;
    const account = await this.near.account('neardao.testnet')
    console.log(account)
    return account.signAndSendTransaction({
        receiverId: contractId,
        actions: [
            transactions.functionCall('unlock_tokens', Buffer.from(JSON.stringify({group: 'Council'})), new BN(10).mul(new BN(TGas)), new BN(0)),
            // transactions.functionCall('unlock_tokens', Buffer.from(JSON.stringify({group: 'Community'})), new BN(10).mul(new BN(TGas)), new BN(0)),
            // transactions.functionCall('unlock_tokens', Buffer.from(JSON.stringify({group: 'Foundation'})), new BN(10).mul(new BN(TGas)), new BN(0)),
            // transactions.functionCall('unlock_tokens', Buffer.from(JSON.stringify({group: 'Public'})), new BN(10).mul(new BN(TGas)), new BN(0)),
        ],
    });
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
    ]).catch((e) => {
      console.log(e)
    });

    console.log(data)
    if (!data) {
      return null;
    }

    const amount = new Decimal(data[0]).toNumber()
    const ft_council_free = new Decimal(data[3].council_ft_stats.unlocked).minus(data[3].council_ft_stats.distributed).toNumber()
    const ft_community_free = new Decimal(data[3].community_ft_stats.unlocked).minus(data[3].community_ft_stats.distributed).toNumber()
    const ft_foundation_free = new Decimal(data[3].foundation_ft_stats.unlocked).minus(data[3].foundation_ft_stats.distributed).toNumber()
    const ft_public_sale_free = new Decimal(data[3].public_ft_stats.unlocked).minus(data[3].public_ft_stats.distributed).toNumber()

    // token state
    const members = data[2].council.concat(data[2].community, data[2].foundation)
    const member_promises: any[] = []
    members.forEach((accountId: string) => {
      member_promises.push(this.getFtBalanceOf(daoAccount, accountId))
    });
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
        token_stats: {
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
          community: {
            total: data[3].community_ft_stats.total,
            init: data[3].community_ft_stats.init_distribution,
            distributed: data[3].community_ft_stats.distributed,
            unlocked: data[3].community_ft_stats.unlocked,
            free: ft_community_free,
            algorithm: (typeof data[3].community_release_model === 'string') ? data[3].community_release_model : Object.keys(data[3].community_release_model)[0],
            duration: (data[3].community_release_model.Linear != undefined) ? data[3].community_release_model.Linear.duration : null,
            release_end: (data[3].community_release_model.Linear != undefined) ? data[3].community_release_model.Linear.release_end : null,
          },
          foundation: {
            total: data[3].foundation_ft_stats.total,
            init: data[3].foundation_ft_stats.init_distribution,
            distributed: data[3].foundation_ft_stats.distributed,
            unlocked: data[3].foundation_ft_stats.unlocked,
            free: ft_foundation_free,
            algorithm: (typeof data[3].foundation_release_model === 'string') ? data[3].foundation_release_model : Object.keys(data[3].foundation_release_model)[0],
            duration: (data[3].foundation_release_model.Linear != undefined) ? data[3].foundation_release_model.Linear.duration : null,
            release_end: (data[3].foundation_release_model.Linear != undefined) ? data[3].foundation_release_model.Linear.release_end : null,
          },
          public_sale: {total: data[3].public_ft_stats.total,
            init: data[3].public_ft_stats.init_distribution,
            distributed: data[3].public_ft_stats.distributed,
            unlocked: data[3].public_ft_stats.unlocked,
            free: ft_public_sale_free,
            algorithm: (typeof data[3].public_release_model === 'string') ? data[3].public_release_model : Object.keys(data[3].public_release_model)[0],
            duration: (data[3].public_release_model.Linear != undefined) ? data[3].public_release_model.Linear.duration : null,
            release_end: (data[3].public_release_model.Linear != undefined) ? data[3].public_release_model.Linear.release_end : null,},
        },
        token_free: new Decimal(ft_council_free).plus(ft_community_free).plus(ft_foundation_free).plus(ft_public_sale_free).toNumber(),
        token_holded: data[3].total_distributed,
        token_holders: token_account,
        groups: {
          council: {
            amount: data[2].council_share_percent,
            wallets: data[2].council
          },
          community: {
            amount: data[2].community_share_percent,
            wallets: data[2].community
          },
          foundation: {
            amount: data[2].foundation_share_percent,
            wallets: data[2].foundation
          },
          public_sale: {
            amount: getPublicSalePercent(data[2].council_share_percent, data[2].community_share_percent, data[2].foundation_share_percent),
            wallets: []
          },
        },
        tags: data[1].tags.map((tag: number) => data[7][tag]), // system tag
        treasury: {
          near: amount,
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

}

export default NearService;