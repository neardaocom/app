/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  connect,
  Contract,
  keyStores,
  Near,
  WalletConnection,
} from 'near-api-js';
import { NearConfig, nearConfig } from 'config';
import Decimal from 'decimal.js';
import { CreateDaoParams, DaoItem } from 'types/dao';
import { AccountState } from 'near-api-js/lib/account';
import { timestampToReadable } from 'utils/getVotePeriod';
import {
  CreateProposalParams,
  Proposal,
  ProposalRaw,
  ProposalType,
} from 'types/proposal';
import { isNotNull } from 'types/guards';
import { ContractPool } from './ContractPool';
import { yoktoNear, TGas } from './constants';
import { mapProposalRawToProposal } from './utils';

class NearService {
  private readonly config: NearConfig;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private factoryContract!: Contract & any;

  private walletConnection!: WalletConnection;

  private near!: Near;

  private contractPool!: ContractPool;

  constructor(config: NearConfig) {
    this.config = config;
  }

  public async init(): Promise<void> {
    this.near = await connect({
      deps: { keyStore: new keyStores.BrowserLocalStorageKeyStore() },
      ...this.config,
    });

    this.walletConnection = new WalletConnection(this.near, 'sputnik');

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

  public isInitialized(): boolean {
    return !!this.near && !!this.walletConnection && !!this.factoryContract;
  }

  public isAuthorized(): boolean {
    return this.walletConnection.isSignedIn();
  }

  public login(): Promise<void> {
    return this.walletConnection.requestSignIn(
      this.config.contractName,
      'Sputnik DAO',
    );
  }

  public async logout(): Promise<void> {
    this.walletConnection.signOut();
  }

  public async getAccount() {
    return this.walletConnection.getAccountId();
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public async createDao(params: CreateDaoParams): Promise<any> {
    const argsList = {
      purpose: params.purpose,
      council: params.council.split('\n').filter((item) => item),
      bond: new Decimal(params.bond).mul(yoktoNear).toFixed(),
      vote_period: new Decimal(params.votePeriod).mul('3.6e12').toFixed(),
      grace_period: new Decimal(params.gracePeriod).mul('3.6e12').toFixed(),
    };

    const amount = new Decimal(params.amountToTransfer);
    const amountYokto = amount.mul(yoktoNear).toFixed();
    const args = Buffer.from(JSON.stringify(argsList)).toString('base64');

    return this.factoryContract.create(
      {
        name: params.name,
        args,
      },
      TGas,
      amountYokto.toString(),
    );
  }

  public async createProposal(params: CreateProposalParams): Promise<any> {
    const data: any = {
      target: params.target,
      description: params.description,
      kind: {
        type: params.kind.type,
      },
    };

    if (params.link) {
      data.description = `${params.description} ---${params.link}`.trim();
    }

    if (params.kind.type === ProposalType.Payout) {
      const amount = new Decimal(params.kind.amount);
      const amountYokto = amount.mul(yoktoNear).toFixed();

      data.kind.amount = amountYokto;
    }

    if (params.kind.type === ProposalType.ChangeVotePeriod) {
      const votePeriod = new Decimal(params.kind.votePeriod).mul('3.6e12');

      data.kind.vote_period = votePeriod;
    }

    if (params.kind.type === ProposalType.ChangePurpose) {
      data.kind.purpose = params.kind.purpose;
    }

    return this.contractPool.get(params.daoId).add_proposal(
      {
        proposal: data,
      },
      new Decimal('30_000_000_000_000').toString(),
      params.bond,
    );
  }

  public async getDaoList(): Promise<DaoItem[]> {
    const list: string[] = await this.factoryContract.get_dao_list();

    const daos = await Promise.all(
      list.map((daoId: string) => this.getDaoById(daoId)),
    );

    return daos.filter(<(item: DaoItem | null) => item is DaoItem>(
      ((item) => isNotNull(item))
    ));
  }

  public async getDaoById(daoId: string): Promise<DaoItem | null> {
    const daoDetails = await Promise.all([
      this.getDaoAmount(daoId),
      this.getBond(daoId),
      this.getPurpose(daoId),
      this.getVotePeriod(daoId),
      this.getNumProposals(daoId),
      this.getCouncil(daoId),
    ]).catch(() => null);

    if (isNotNull(daoDetails)) {
      return {
        id: daoId,
        amount: daoDetails[0],
        bond: daoDetails[1],
        purpose: daoDetails[2],
        votePeriod: daoDetails[3],
        numberOfProposals: daoDetails[4],
        numberOfMembers: daoDetails[5].length,
        members: daoDetails[5],
      };
    }

    return null;
  }

  public async getDaoState(contractId: string): Promise<AccountState> {
    const account = await this.near.account(contractId);

    return account.state();
  }

  public async getDaoAmount(contractId: string): Promise<string> {
    const state = await this.getDaoState(contractId);
    const amountYokto = new Decimal(state.amount);

    return amountYokto.div(yoktoNear).toFixed(2);
  }

  public async getBond(contractId: string): Promise<string> {
    const bond = await this.contractPool.get(contractId).get_bond();

    return new Decimal(bond.toString()).div(yoktoNear).toString();
  }

  public async getVotePeriod(contractId: string): Promise<string> {
    const votePeriod = await this.contractPool
      .get(contractId)
      .get_vote_period();

    return timestampToReadable(votePeriod);
  }

  public async getNumProposals(contractId: string): Promise<number> {
    return this.contractPool.get(contractId).get_num_proposals();
  }

  public async getPurpose(contractId: string): Promise<string> {
    return this.contractPool.get(contractId).get_purpose();
  }

  public async getProposals(
    contractId: string,
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

  public async getProposal(
    contractId: string,
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

  public async getCouncil(contractId: string): Promise<string[]> {
    return this.contractPool.get(contractId).get_council();
  }

  public addProposal(contractId: string): Promise<void> {
    return this.contractPool.get(contractId).add_proposal;
  }

  public vote(
    contractId: string,
    proposalId: number,
    vote: 'Yes' | 'No',
  ): Promise<void> {
    return this.contractPool.get(contractId).vote({
      id: proposalId,
      vote,
    });
  }

  public finalize(contractId: string, proposalId: number): Promise<void> {
    return this.contractPool.get(contractId).finalize({
      id: proposalId,
    });
  }
}

const nearService = new NearService(nearConfig);

export default nearService;
