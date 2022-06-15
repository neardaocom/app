import TransformerInterface from "@/models/interfaces/Transformer.interface";
import loFind from "lodash/find"
import loGet from "lodash/get"
import loToPairs from "lodash/toPairs"
import loToString from "lodash/toString"
import FtMetadataLoader from "@/models/ft/FtMetadataLoader";
import NearUtils from "../../nearBlockchain/Utils";
import NumberHelper from "@/models/utils/NumberHelper";
import DaoAssetTransformer from "./DaoAssetTransformer";
import { DaoAsset } from "../types/asset";
import { RewardPricelist, RewardPricelistAmount, RewardType } from "../types/rewards";
import { DAOGroup } from "../types/dao";
import { NotImplementedError } from "@/models/utils/errors";

export default class RewardsPricelistTransformer implements TransformerInterface {

    protected daoAssetTransformer: DaoAssetTransformer;
    protected daoGroups: DAOGroup[]

    constructor(ftMetadataLoader: FtMetadataLoader, daoGroups: DAOGroup[]) {
        this.daoAssetTransformer = new DaoAssetTransformer(ftMetadataLoader)
        this.daoGroups = daoGroups
    }

    async transform(value: any): Promise<RewardPricelist> {
        let type: RewardType
        let group: DAOGroup | undefined = undefined
        let unitSeconds: number | undefined = undefined

        if (loGet(value, [1, 'type', 'wage']) !== undefined) {
            type = RewardType.Salary
            group = loFind(this.daoGroups, {id: value[1].group_id})
            unitSeconds = loGet(value, [1, 'type', 'wage', 'unit_seconds'])
        } else if (loGet(value, [1, 'type', 'user_activity']) !== undefined) {
            type = RewardType.Activity
            group = loFind(this.daoGroups, {id: value[1].group_id})
        } else {
            console.log(loToPairs(value))
            throw new NotImplementedError('This asset type not implemented: ' + loToPairs(value))
        }

        // amounts
        const amounts: RewardPricelistAmount[] = []
        let amountChain: any[]
        let asset: DaoAsset
        for (amountChain of value[1].reward_amounts) {
            asset = await this.daoAssetTransformer.transform(amountChain[0])

            amounts.push({
                asset,
                amount: NumberHelper.parseNumber(NearUtils.amountFromDecimals(loToString(amountChain[1]), asset.decimals)),
            })
        }

        const pricelist: RewardPricelist = {
            id: value[0],
            type,
            name: value[1].name,
            targetGroup: group,
            amounts: amounts,
            unitSeconds: unitSeconds,
            startAt: NearUtils.dateFromChain(value[1].time_valid_from),
            endAt: (value[1].time_valid_to !== NearUtils.dateIninity) ? NearUtils.dateFromChain(value[1].time_valid_to) : null,
        }

        return pricelist;
    }
}