import { Account, Contract } from 'near-api-js';
import DaoContract from "./services/DaoContract";

export default class DaoContractPool {
    private account: Account;
    private pool: { [key: string]: DaoContract } = {};

    constructor(account: Account) {
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
}