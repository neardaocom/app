import { Account, Near } from 'near-api-js';
import DaoContractService from "../nearBlockchain/DaoContractService";
import FtContractService from "../nearBlockchain/FtContractService";
import NearAccountService from "../nearBlockchain/NearAccountService";
import StakingContractService from "../nearBlockchain/StakingContractService";
import WfProviderContractService from "../nearBlockchain/WfProviderContractService";

export default class ServicePool {
    private near: Near;
    private account: Account;
    private daoPool: { [key: string]: DaoContractService } = {};
    private ftPool: { [key: string]: FtContractService } = {};
    private accountPool: { [key: string]: NearAccountService } = {};
    private stakingPool: { [key: string]: StakingContractService } = {};
    private wfProviderPool: { [key: string]: WfProviderContractService } = {};

    constructor(near: Near, account: Account) {
        this.near = near;
        this.account = account;
    }

    getContract(contractId: string): DaoContractService {
        if (this.daoPool[contractId]) {
            return this.daoPool[contractId];
        }

        const contract = new DaoContractService(this.account, contractId);
        this.daoPool[contractId] = contract;

        return contract;
    }

    getFt(contractId: string): FtContractService {
        if (this.ftPool[contractId]) {
            return this.ftPool[contractId];
        }

        const contract = new FtContractService(this.account, contractId);
        this.ftPool[contractId] = contract;

        return contract;
    }

    async getAccount(contractId: string): Promise<NearAccountService> {
        if (this.accountPool[contractId]) {
            return this.accountPool[contractId];
        }

        const account = await this.near.account(contractId);
        const nearAccount = new NearAccountService(account);
        this.accountPool[contractId] = nearAccount;

        return nearAccount;
    }

    getStaking(contractId: string): StakingContractService {
        if (this.stakingPool[contractId]) {
            return this.stakingPool[contractId];
        }

        const contract = new StakingContractService(this.account, contractId);
        this.stakingPool[contractId] = contract;

        return contract;
    }

    getWfProvider(contractId: string): WfProviderContractService {
        if (this.wfProviderPool[contractId]) {
            return this.wfProviderPool[contractId];
        }

        const contract = new WfProviderContractService(this.account, contractId);
        this.wfProviderPool[contractId] = contract;

        return contract;
    }
}