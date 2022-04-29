import { Account, Near } from 'near-api-js';
import DaoContract from "./services/DaoContractService";
import NearAccount from "./services/NearAccountService";

export default class DaoContractPool {
    private near: Near;
    private account: Account;
    private pool: { [key: string]: DaoContract } = {};
    private accounts: { [key: string]: NearAccount } = {};

    constructor(near: Near, account: Account) {
        this.near = near;
        this.account = account;
    }

    get(contractId: string): DaoContract {
        if (this.pool[contractId]) {
            return this.pool[contractId];
        }

        const contract = new DaoContract(this.account, contractId);
        this.pool[contractId] = contract;

        return contract;
    }

    async getAccount(contractId: string): Promise<NearAccount> {
        if (this.accounts[contractId]) {
            return this.accounts[contractId];
        }

        const account = await this.near.account(contractId);
        const nearAccount = new NearAccount(account);
        this.accounts[contractId] = nearAccount;

        return nearAccount;
    }
}