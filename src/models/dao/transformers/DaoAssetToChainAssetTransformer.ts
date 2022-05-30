import TransformerInterface from "@/models/interfaces/Transformer.interface";
import loToPairs from "lodash/toPairs"
import FtMetadataLoader from "@/models/ft/FtMetadataLoader";
import { NotImplementedError } from "@/models/utils/errors";
import { DaoAsset } from "../types/asset";
import { Asset } from "@/models/nearBlockchain/types/dao";

export default class DaoAssetToChainAssetTransformer implements TransformerInterface {

    transform(value: any): Asset {
        const data: DaoAsset = value as DaoAsset
        let asset: Asset

        switch (data.type) {
            case 'near':
                asset = 'near'
                break;
            case 'ft':
                    asset = {
                        f_t: {
                            account_id: data.accountId,
                            decimals: data.decimals,
                        }
                    }
                    break;
            case 'nft':
                throw new NotImplementedError('NFT Asset not implemented')
            default:
                throw new NotImplementedError('This asset type not implemented: ' + loToPairs(data))
        }

        return asset;
    }
}