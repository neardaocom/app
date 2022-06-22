import ServicePool from "../dao/ServicePool";
import NearUtils from "../nearBlockchain/Utils";
import FtMetadataLoader from "./FtMetadataLoader";

export default class Ft {
    protected servicePool: ServicePool;
    protected metadataLoader: FtMetadataLoader;

    constructor(servicePool: ServicePool, ftMetadataLoader: FtMetadataLoader) {
        this.servicePool = servicePool
        this.metadataLoader = ftMetadataLoader
    }

    async getBalance(ftAccountId: string, accountId: string): Promise<string> {
        const balance = await this.servicePool.getFt(ftAccountId).ftBalanceOf(accountId)
        const meta = await this.metadataLoader.load(ftAccountId)
        return NearUtils.amountFromDecimals(balance, meta.decimals)
    }
}