import {
    Account,
    connect,
    Contract,
    transactions,
    keyStores,
    WalletConnection,
    Near,
} from 'near-api-js';
import DaoContractPool from './DaoContractPool';
import DaoFactory from './DaoFactory';
import DaoContractService from './services/DaoContractService';
import ProviderContractService from './services/ProviderContractService';
import NearAccountService from './services/NearAccountService';
import FactoryContractService from "./services/FactoryContractService";

export default class Factory {
    private config: any;

    constructor(config: any) {
        this.config = config;
    }

    async createNear(): Promise<Near> {
        return connect(Object.assign({
            deps: {
                keyStore: new keyStores.BrowserLocalStorageKeyStore()
            }
        }, this.config));
    }

    createWalletConnection(near: Near): WalletConnection {
        return new WalletConnection(near, this.config.contractName);
    }

    createWalletAccount(wallet: WalletConnection): Account {
        return wallet.account();
    }

    createDaoContractPool(near: Near, account: Account): DaoContractPool {
        return new DaoContractPool(near, account);
    }

    createDaoFactory(service: FactoryContractService): DaoFactory {
        return new DaoFactory(service);
    }

    createDaoContractService(account: Account, contractId: string): DaoContractService {
        return new DaoContractService(account, contractId);
    }

    createFactoryContractService(account: Account): FactoryContractService {
        return new FactoryContractService(account, this.config.contractName);
    }

    createNearAccountService(account: Account): NearAccountService {
        return new NearAccountService(account);
    }

    // 'wf-provider.' + process.env.VUE_APP_CONTRACT_NAME
    createProviderContractService(account: Account, providerId: string): ProviderContractService {
        return new ProviderContractService(account, providerId);
    }
}