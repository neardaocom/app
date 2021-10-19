import {
  connect,
  Contract,
  keyStores,
  WalletConnection,
} from 'near-api-js';
import { toNanoseconds } from '@/utils/date';


import Decimal from 'decimal.js';

import { yoctoNear, TGas } from './constants';
import { ContractPool } from './ContractPool';
import { getPublicSalePercent } from './utils';



class NearService {
  // config of near
  config;

  // factory contract
  factoryContract;

  // wallet
  walletConnection;

  // near API
  near;

  // contracts
  contractPool;

  constructor(config) {
    this.config = config;
  }

  async init() {
    this.near = await connect(Object.assign({
      deps: {
        keyStore: new keyStores.BrowserLocalStorageKeyStore()
      }
    }, this.config));

    this.walletConnection = new WalletConnection(this.near, process.env.VUE_APP_NEAR_CONTRACT_NAME);

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
    return this.walletConnection.requestSignIn(
      this.config.contractName,
      this.config.name,
    );
  }

  async signOut() {
    this.walletConnection.signOut();
  }

  async getAccount() {
    return this.walletConnection.getAccountId();
  }

  /**
   * Get dao list
   * 
   * @returns Promise
   */
  async getDaoList() {
    return this.factoryContract.get_dao_list();
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
  async getDaoInfo(daoId) {
    return this.factoryContract.get_dao_info({
      account: daoId
    });
  }

  /**
   * Create DAO
   */
  async createDao(
    accountId
    , publicKey
    , name
    , description
    , tags
    , founders
    , politicalState
    , ftName
    , ftAmount
    , ftInsiderInitDistribution
    , ftInsiderShare
    , ftFundationShare
    , ftCommunityShare
    , voteSpamThreshold
    , voteDurationDays
    , voteDurationHours
    , voteQuorum
    , voteApproveThreshold
    , voteOnlyOnce
    , amountToTransfer
  ) {
    const info = {
      name: name,
      description: description,
      tags: tags,
      ft_name: ftName,
      ft_amount: ftAmount
    };
    console.log(info)

    const args = {
      name: name,
      total_supply: ftAmount,
      init_distribution: ftInsiderInitDistribution,
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
        lang: politicalState,
        description: description,
        insiders_share: ftInsiderShare,
        fundation_share: ftFundationShare,
        community_share: ftCommunityShare,
        vote_spam_threshold: voteSpamThreshold
      },
      release_config: 'Voting',
      vote_policy_configs: [
        {
          proposal_kind: 'Pay',
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
        }
      ],
      founders: founders
    }
    console.log(args)

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
    contractId
    , description
    , tags
    , transactions
    , amountToTransfer
    , accountId
  ) {
    const amount = new Decimal(amountToTransfer);
    const amountYokto = amount.mul(yoctoNear).toFixed();

    return this.contractPool.get(contractId).add_proposal(
      {
        proposal_input: {
          description: description,
          tags: tags,
          transaction: transactions
        },
        account_id: accountId
      },
      Decimal.mul(100, TGas).toString(),
      amountYokto.toString()
    );
  }

  async addDoc(
    contractId
    , name
    , description
    , ipfs_hash
    , categoryId
    , category
    , ext
    , tagsIds
    , tags
    , version
    , amountToTransfer
    , accountId
  ) {
    const amount = new Decimal(amountToTransfer);
    const amountYokto = amount.mul(yoctoNear).toFixed();

    return this.contractPool.get(contractId).add_proposal(
      {
        proposal_input: {
          description: description,
          tags: tags,
          transaction: {
            AddDocFile: {
              uuid: ipfs_hash,
              metadata: {
                name: name,
                description: description,
                tags: tagsIds,
                category: categoryId,
                ext: ext,
                valid: true,
                v: version
              },
              new_tags: tags,
              new_category: category
            }
          }
        },
        account_id: accountId
      },
      Decimal.mul(100, TGas).toString(),
      amountYokto.toString()
    );
  }

  async invalideDoc(
    contractId
    , ipfs_hash
    , description
    , amountToTransfer
    , accountId
  ) {
    const amount = new Decimal(amountToTransfer);
    const amountYokto = amount.mul(yoctoNear).toFixed();

    return this.contractPool.get(contractId).add_proposal(
      {
        proposal_input: {
          description: description,
          tags: [],
          transaction: {
            InvalidateFile: {
              uuid: ipfs_hash
            }
          }
        },
        account_id: accountId
      },
      Decimal.mul(100, TGas).toString(),
      amountYokto.toString()
    );
  }

  /**
   * Voting in proposal
   */
  async vote(
    contractId,
    proposalId,
    vote
  ) {
    return this.contractPool.get(contractId).vote(
      {
        proposal_id: proposalId,
        vote_kind: vote,
        account_id: this.walletConnection.getAccountId()
      },
      Decimal.mul(10, TGas).toString(),
      new Decimal(1).mul(yoctoNear).toFixed()
    );
  }

  /**
   * Finalize proposal
   */
  async finalize(
    contractId,
    proposalId
  ) {
    return this.contractPool.get(contractId).finish_proposal(
      {
        proposal_id: proposalId,
        account_id: this.walletConnection.getAccountId()
      },
      Decimal.mul(100, TGas).toString()
    );
  }

  ///////////////
  // DAO VIEWs //
  ///////////////
  async getDaoState(contractId) {
    const account = await this.near.account(contractId);

    return account.state();
  }

  async getDaoById(daoAccount) {
    const daoId = daoAccount.split('.')[0]
    console.log(daoId)
    const data = await Promise.all([
      this.getDaoAmount(daoAccount),
      this.getDaoInfo(daoId),
      this.getStatisticsMembers(daoAccount),
      this.getStatisticsFt(daoAccount),
      this.getProposals(daoAccount, 0, 1000),
      this.getDocFiles(daoAccount),
      this.getDaoConfig(daoAccount),
    ]).catch((e) => {
      console.log(e)
    });

    console.log(data)

    const amount = new Decimal(data[0]).toNumber()
    const ft_total_released = new Decimal(data[3].total_released);
    const ft_free_released = new Decimal(data[3].free);
    const ft_shared = ft_total_released.minus(data[3].free);
    const ft_insiders_shared = new Decimal(data[3].insiders_ft_shared)
    const ft_community_shared = new Decimal(data[3].community_ft_shared)
    const ft_foundation_shared = new Decimal(data[3].foundation_ft_shared)
    const ft_public_sale_shared = ft_shared.minus(ft_insiders_shared).minus(ft_community_shared).minus(ft_foundation_shared)

    // token state
    const members = data[2].insiders.concat(data[2].community, data[2].foundation)
    let member_promises = []
    members.forEach(accountId => {
      member_promises.push(this.getFtBalanceOf(daoAccount, accountId))
    });
    console.log(member_promises)
    const balances = await Promise.all(member_promises).catch((e) => {
      console.log(e)
    });
    let token_account = {}
    members.forEach((accountId, index) => {
      token_account[accountId] = new Decimal(balances[index]).toNumber()
    });
    //console.log(token_account)

    // Mapping Doc files tags and categories
    let file_list = [];
    data[5].files.forEach(element => {
      let doc = { tags: [] }
      for (let [i, val] of element[1].tags.entries()) {
        doc.tags[i] = data[5].map["Doc"].tags[val]
      }
      doc.name = element[1].name
      doc.ext = element[1].ext
      doc.description = element[1].description
      doc.valid = element[1].valid
      doc.category = data[5].map["Doc"].categories[element[1].category]
      doc.ipfs_hash = element[0]
      doc.version = element[1].v ?? '1.0'

      file_list.push(doc)
    });

    if (data !== null) {
      return {
        id: daoId,
        name: data[1].name,
        state: null,
        about: data[1].description,
        description: data[1].description,
        wallet: daoAccount,
        address: null,
        domain: null,
        web: null,
        lang: data[6].lang,
        token: data[1].ft_amount,
        token_name: data[1].ft_name,
        token_unlocked: {
          council: ft_insiders_shared.dividedBy(ft_shared).times(100).round().toNumber(),
          community: ft_community_shared.dividedBy(ft_shared).times(100).round().toNumber(),
          investor: ft_foundation_shared.dividedBy(ft_shared).times(100).round().toNumber(),
          public_sale: ft_public_sale_shared.dividedBy(ft_shared).times(100).round().toNumber()
        },
        token_released: ft_total_released.toNumber(),
        token_free: ft_free_released.toNumber(),
        token_holders: token_account,
        groups: {
          council: {
            amount: data[2].insiders_share_percent,
            wallets: data[2].insiders
          },
          community: {
            amount: data[2].community_share_percent,
            wallets: data[2].community
          },
          investor: {
            amount: data[2].foundation_share_percent,
            wallets: data[2].foundation
          },
          public_sale: {
            amount: getPublicSalePercent(data[2].insiders_share_percent, data[2].community_share_percent, data[2].foundation_share_percent),
            wallets: []
          },
        },
        tags: [
          data[1].tags[0]
        ],
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
          map: data[5].map.Doc
        }
      };
    }

    return null
  }

  async getDaoAmount(contractId) {
    const state = await this.getDaoState(contractId);
    const amountYokto = new Decimal(state.amount);

    return amountYokto.div(yoctoNear).toFixed(2);
  }

  async getStatisticsMembers(contractId) {
    return this.contractPool.get(contractId).statistics_members();
  }

  async getStatisticsFt(contractId) {
    return this.contractPool.get(contractId).statistics_ft();
  }

  async getProposals(contractId, fromIndex, limit) {
    return this.contractPool.get(contractId).proposals({
      from_index: fromIndex ?? 0,
      limit: limit ?? 1000
    });
  }

  async getDocFiles(contractId) {
    return this.contractPool.get(contractId).doc_files();
  }

  async getFtBalanceOf(contractId, accountId) {
    return this.contractPool.get(contractId).ft_balance_of({
      account_id: accountId
    });
  }

  async getDaoConfig(contractId) {
    return this.contractPool.get(contractId).dao_config();
  }

}

export default NearService;
