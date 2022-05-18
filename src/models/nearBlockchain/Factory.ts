import {
    Account,
    connect,
    Contract,
    transactions,
    keyStores,
    WalletConnection,
    Near,
} from 'near-api-js';
import DaoContractService from './DaoContractService';
import FactoryContractService from "./FactoryContractService";
import NearAccountService from './NearAccountService';
import ProviderContractService from './ProviderContractService';
import FtFactoryContractService from './FtFactoryContractService';
import FtContractService from './FtContractService';

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
        return new WalletConnection(near, this.config.domainAccountId);
    }

    createWalletAccount(wallet: WalletConnection): Account {
        return wallet.account();
    }

    createDaoContractService(account: Account, contractId: string): DaoContractService {
        return new DaoContractService(account, contractId);
    }

    createFactoryContractService(account: Account): FactoryContractService {
        return new FactoryContractService(account, this.config.daoFactoryAccountId);
    }

    createNearAccountService(account: Account): NearAccountService {
        return new NearAccountService(account);
    }

    // 'wf-provider.' + process.env.VUE_APP_CONTRACT_NAME
    createProviderContractService(account: Account, providerId: string): ProviderContractService {
        return new ProviderContractService(account, providerId);
    }

    createFtFactoryContractService(account: Account, contractId: string): FtFactoryContractService {
        return new FtFactoryContractService(account, contractId);
    }

    createFtContractService(account: Account, contractId: string): FtContractService {
        return new FtContractService(account, contractId);
    }
}