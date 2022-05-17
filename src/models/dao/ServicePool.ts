import { Account, Near } from 'near-api-js';
import DaoContractService from "../nearBlockchain/DaoContractService";
import NearAccountService from "../nearBlockchain/NearAccountService";

export default class ServicePool {
    private near: Near;
    private account: Account;
    private pool: { [key: string]: DaoContractService } = {};
    private accounts: { [key: string]: NearAccountService } = {};

    constructor(near: Near, account: Account) {
        this.near = near;
        this.account = account;
    }

    getContract(contractId: string): DaoContractService {
        if (this.pool[contractId]) {
            return this.pool[contractId];
        }

        const contract = new DaoContractService(this.account, contractId);
        this.pool[contractId] = contract;

        return contract;
    }

    async getAccount(contractId: string): Promise<NearAccountService> {
        if (this.accounts[contractId]) {
            return this.accounts[contractId];
        }

        const account = await this.near.account(contractId);
        const nearAccount = new NearAccountService(account);
        this.accounts[contractId] = nearAccount;

        return nearAccount;
    }
}