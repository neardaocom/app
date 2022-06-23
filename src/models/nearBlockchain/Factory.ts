import {
    Account,
    connect,
    keyStores,
    WalletConnection,
    Near,
} from 'near-api-js';
import DaoContractService from './DaoContractService';
import AdminContractService from "./AdminContractService";
import NearAccountService from './NearAccountService';
import WfProviderContractService from './WfProviderContractService';
import FtFactoryContractService from './FtFactoryContractService';
import FtContractService from './FtContractService';
import StakingContractService from './StakingContractService';
import { NearConfig } from '@/config/near';

export default class Factory {
    private config: NearConfig;

    constructor(config: NearConfig) {
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
        return new WalletConnection(near, this.config.name);
    }

    createWalletAccount(wallet: WalletConnection): Account {
        return wallet.account();
    }

    createDaoContractService(account: Account, contractId: string): DaoContractService {
        return new DaoContractService(account, contractId);
    }

    createAdminContractService(account: Account): AdminContractService {
        return new AdminContractService(account, this.config.adminAccountId);
    }

    createNearAccountService(account: Account): NearAccountService {
        return new NearAccountService(account);
    }

    createWfProviderContractService(account: Account): WfProviderContractService {
        return new WfProviderContractService(account, this.config.wfProviderAccountId);
    }

    createStakingContractService(account: Account): StakingContractService {
        return new StakingContractService(account, this.config.stakingAccountId);
    }

    createFtFactoryContractService(account: Account, contractId: string): FtFactoryContractService {
        return new FtFactoryContractService(account, contractId);
    }

    createFtContractService(account: Account, contractId: string): FtContractService {
        return new FtContractService(account, contractId);
    }
}