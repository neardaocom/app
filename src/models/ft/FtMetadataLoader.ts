import { FungibleTokenMetadata } from "../nearBlockchain/types/ft";
import ServicePool from "../dao/ServicePool";
import { list } from "./data";

export default class FtMetadataLoader {
    private assets: { [key: string]: FungibleTokenMetadata } = {};
    private data: { [key: string]: FungibleTokenMetadata } = {};

    protected servicePool: ServicePool;

    constructor(servicePool: ServicePool) {
        this.servicePool = servicePool
        this.data = list
    }

    async load(ftAccountId: string): Promise<FungibleTokenMetadata> {
        if (this.assets[ftAccountId]) {
            return this.assets[ftAccountId]
        } else if (this.data[ftAccountId]) {
            return this.data[ftAccountId]
        }

        const ftService = this.servicePool.getFt(ftAccountId)
        const metadata = await ftService.ftMetadata()
        
        this.assets[ftAccountId] = metadata;

        return metadata;
    }
}