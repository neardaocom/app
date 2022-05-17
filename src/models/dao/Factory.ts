import {
    Account,
    Near as NearCli,
} from 'near-api-js';
import ServicePool from './ServicePool';
import DaoList from './DaoList';
import DaoFactory from './DaoFactory';
import Near from './Near';
import NearBlockchainFactory from "../nearBlockchain/Factory";
import DaoLoader from './DaoLoader';

export default class Factory {
    private near: NearCli;
    private account: Account;
    private nearBlockchainFactory: NearBlockchainFactory;

    constructor(near: NearCli, account: Account, nearBlockchainFactory: NearBlockchainFactory) {
        this.near = near;
        this.account = account;
        this.nearBlockchainFactory = nearBlockchainFactory
    }

    createNear(): Near {
        return new Near(new ServicePool(this.near, this.account));
    }

    createServicePool(): ServicePool {
        return new ServicePool(this.near, this.account);
    }

    createDaoFactory(): DaoFactory {
        return new DaoFactory(this.nearBlockchainFactory.createFactoryContractService(this.account));
    }
}