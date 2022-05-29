import TransformerInterface from "@/models/interfaces/Transformer.interface";
import loGet from "lodash/get"
import loToString from "lodash/toString"
import loToPairs from "lodash/toPairs"
import FtMetadataLoader from "@/models/ft/FtMetadataLoader";
import { NotImplementedError } from "@/models/utils/errors";
import { getMetadata } from "../../ft/data";
import { FungibleTokenMetadata } from "@/models/nearBlockchain/types/ft";
import { DaoAsset } from "../types/asset";

export default class DaoAssetTransformer implements TransformerInterface {

    protected ftMetadataLoader: FtMetadataLoader;

    constructor(ftMetadataLoader: FtMetadataLoader) {
        this.ftMetadataLoader = ftMetadataLoader
    }

    async transform(value: any): Promise<DaoAsset> {
        // console.log(value)
        let daoAsset: DaoAsset | null = null
        let ftAccountId: string | null = null
        let ftMetadata: FungibleTokenMetadata | null = null

        // FT
        if (loGet(value, ['f_t']) !== undefined) {
            ftAccountId = loGet(value, ['f_t', 'account_id'])
            ftMetadata = await this.ftMetadataLoader.load(ftAccountId!)
            daoAsset = {
                type: 'ft',
                accountId: ftAccountId!,
                name: ftMetadata.name,
                symbol: ftMetadata.symbol,
                icon: ftMetadata.icon,
                decimals: ftMetadata.decimals,
            }
        // near
        } else if (loToString(value) === 'near') {
            ftAccountId = 'near'
            ftMetadata = getMetadata(ftAccountId)
            daoAsset = {
                type: 'near',
                accountId: 'near',
                name: ftMetadata.name,
                symbol: ftMetadata.symbol,
                icon: ftMetadata.icon,
                decimals: ftMetadata.decimals,
            }
        // nft
        } else if (loGet(value, ['n_f_t']) !== undefined) {
            throw new NotImplementedError('NFT Asset not implemented')
        } else {
            console.log(loToPairs(value))
            throw new NotImplementedError('This asset type not implemented: ' + loToPairs(value))
        }

        return daoAsset;
    }
}