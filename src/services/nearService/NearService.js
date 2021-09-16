import {
  connect,
  Contract,
  keyStores,
  WalletConnection,
} from 'near-api-js';
// import getConfig from "@/config/near"
import { toNanoseconds } from '@/utils/date';


import Decimal from 'decimal.js';

import { yoktoNear, TGas } from './constants';
import { ContractPool } from './ContractPool';



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
        'get_dao_info'
      ],
      changeMethods: [
        'create'
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
    , voteApproveTreshhold
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
    // console.log(info)

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
        config : {
            description: description,
            insiders_share: ftInsiderShare,
            fundation_share: ftFundationShare,
            community_share: ftCommunityShare,
            vote_spam_threshold: voteSpamThreshold
        },
        release_config: 'Voting',
        vote_policy_configs : [
            {
                proposal_kind: 'Pay',
                duration: toNanoseconds(voteDurationDays, voteDurationHours, 0, 0),
                quorum: voteQuorum,
                approve_threshold: voteApproveTreshhold,
                vote_only_once: voteOnlyOnce,
                waiting_open_duration: 0
            }
        ],
        founders: founders
    }
    // console.log(args)


    const args_base64 = Buffer.from(JSON.stringify(args)).toString('base64')

    const amount = new Decimal(amountToTransfer);
    const amountYokto = amount.mul(yoktoNear).toFixed();

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
  ) {
    const amount = new Decimal(amountToTransfer);
    const amountYokto = amount.mul(yoktoNear).toFixed();

    return this.contractPool.get(contractId).add_proposal(
      {
        proposal_input: {
          description: description,
          tags: tags,
          transaction: transactions
        }
      },
      Decimal.mul(30, TGas).toString(),
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
      Decimal.mul(30, TGas).toString()
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
      }
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
    const daoId = daoAccount.split('.').at(0)
    const daoDetails = await Promise.all([
      this.getDaoAmount(daoAccount),
      this.getDaoInfo(daoId),
      //this.getBond(daoId),
      //this.getPurpose(daoId),
      //this.getVotePeriod(daoId),
      //this.getNumProposals(daoId),
      //this.getCouncil(daoId),
    ]).catch(() => null);

    //id: daoId,
    //amount: ,
    //bond: daoDetails[1],
    //purpose: daoDetails[2],
    //votePeriod: daoDetails[3],
    //numberOfProposals: daoDetails[4],
    //numberOfMembers: daoDetails[5].length,
    //members: daoDetails[5],

    if (daoDetails !== null) {
      return {
        id: daoId,
        name: daoDetails[1].name,
        about: null,
        description: daoDetails[1].description,
        wallet: daoAccount,
        address: null,
        domain: null,
        web: null,
        token: daoDetails[1].ft_amount,
        token_name: daoDetails[1].ft_name,
        token_unlocked: {
          council: 30,
          community: 10,
          investor: 50,
          public_sale: 0
        },
        groups: {
          council: {
            amount: 40,
            wallets: [
              'petrfilla.near', 'chaplin.near', 'petrstudynka.near', 'jansladky.near'
            ]
          },
          community: {
            amount: 20,
            wallets: []
          },
          investor: {
            amount: 15,
            wallets: []
          },
          public_sale: {
            amount: 25,
            wallets: []
          },
        },
        tags: [
          daoDetails[1].tags
        ],
        treasury: {
          near: daoDetails[0],
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
        }
      };
    }

    return null
  }

  async getDaoAmount(contractId) {
    const state = await this.getDaoState(contractId);
    const amountYokto = new Decimal(state.amount);

    return amountYokto.div(yoktoNear).toFixed(2);
  }

  /*
  async getBond(contractId): Promise<string> {
    const bond = await this.contractPool.get(contractId).get_bond();

    return new Decimal(bond.toString()).div(yoktoNear).toString();
  }

  async getVotePeriod(contractId): Promise<string> {
    const votePeriod = await this.contractPool
      .get(contractId)
      .get_vote_period();

    return timestampToReadable(votePeriod);
  }

  async getNumProposals(contractId): Promise<number> {
    return this.contractPool.get(contractId).get_num_proposals();
  }

  async getPurpose(contractId): Promise<string> {
    return this.contractPool.get(contractId).get_purpose();
  }

  async getProposals(
    contractId,
    offset = 0,
    limit = 50,
  ): Promise<Proposal[]> {
    try {
      const numProposals = await this.getNumProposals(contractId);
      const newOffset = numProposals - (offset + limit);
      const newLimit = newOffset < 0 ? limit + newOffset : limit;
      const fromIndex = Math.max(newOffset, 0);

      console.log('info: ', {
        from_index: fromIndex,
        limit: newLimit,
      });

      const proposals = await this.contractPool.get(contractId).get_proposals({
        from_index: fromIndex,
        limit: newLimit,
      });

      console.log('proposals: ', proposals.length);

      return proposals.map((item: ProposalRaw, index: number) =>
        mapProposalRawToProposal(contractId, item, fromIndex + index),
      );
    } catch (err) {
      return [];
    }
  }

  async getProposal(
    contractId,
    index: number,
  ): Promise<Proposal | null> {
    try {
      const proposal = await this.contractPool
        .get(contractId)
        .get_proposal({ id: index });

      return mapProposalRawToProposal(contractId, proposal, index);
    } catch (e: unknown) {
      // eslint-disable-next-line no-console
      console.log('No such proposal');

      return Promise.resolve(null);
    }
  }

  async getCouncil(contractId): Promise<string[]> {
    return this.contractPool.get(contractId).get_council();
  }

  addProposal(contractId): Promise<void> {
    return this.contractPool.get(contractId).add_proposal;
  }

  vote(
    contractId,
    proposalId: number,
    vote: 'Yes' | 'No',
  ): Promise<void> {
    return this.contractPool.get(contractId).vote({
      id: proposalId,
      vote,
    });
  }

  finalize(contractId, proposalId: number): Promise<void> {
    return this.contractPool.get(contractId).finalize({
      id: proposalId,
    });
  }
  */
}

// const config = getConfig(process.env.NODE_ENV ?? 'development')

// const nearService = new NearService(config);

export default NearService;
