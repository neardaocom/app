import {
    Account,
    Near as NearCli,
} from 'near-api-js';
import ServicePool from './ServicePool';
import DaoList from './DaoList';
import DaoAdmin from './DaoAdmin';
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

    createDaoAdmin(): DaoAdmin {
        return new DaoAdmin(this.nearBlockchainFactory.createAdminContractService(this.account));
    }
}