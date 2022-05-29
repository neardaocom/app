import { TreasuryLock, TreasuryTotalAsset, TreasuryLockAsset } from "../types/treasury";
import ServicePool from "../ServicePool";
import CollectionHelper from "@/models/utils/CollectionHelper";
import { Reward, RewardAssetStats } from "../types/rewards";

export default class RewardsAnalytics {

    constructor() {
        
    }

    static computeAssetStats(rewards: Reward[]): RewardAssetStats[] {
        const resutls: RewardAssetStats[] = []
        let resultItem: RewardAssetStats | any | undefined = undefined

        rewards?.forEach((reward) => {
            reward.amounts.forEach((rewardAmount) => {
                resultItem = CollectionHelper.findDeep(resutls, ['asset', 'accountId'], rewardAmount.asset.accountId)
                if (resultItem) {
                    resultItem.amount += rewardAmount.amount || 0
                    resultItem.amountCounting += rewardAmount.amountCounting || 0
                    resultItem.pricelistIds.push(reward.pricelistId)
                } else {
                    resutls.push({
                        asset: rewardAmount.asset,
                        pricelistIds: [reward.pricelistId],
                        amount: rewardAmount.amount || 0,
                        amountCounting: rewardAmount.amountCounting || 0,
                    })
                }
            })
        })

        return resutls
    }
}
