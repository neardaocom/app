import TransformerInterface from "@/models/interfaces/Transformer.interface";
import loFind from "lodash/find"
import loGet from "lodash/get"
import loMax from "lodash/max"
import loToPairs from "lodash/toPairs"
import loToString from "lodash/toString"
import FtMetadataLoader from "@/models/ft/FtMetadataLoader";
import NearUtils from "../../nearBlockchain/Utils";
import TreasuryHelper from "../TreasuryHelper";
import NumberHelper from "@/models/utils/NumberHelper";
import DaoAssetTransformer from "./DaoAssetTransformer";
import { DaoAsset } from "../types/asset";
import { RewardPricelist, RewardAmount, RewardType, Reward } from "../types/rewards";
import { DAOGroup } from "../types/dao";
import { NotImplementedError } from "@/models/utils/errors";
import { TreasuryLock } from "../types/treasury";
import RewardsHelper from "../RewardsHelper";
import { times } from "lodash";

export default class RewardsClaimableTransformer implements TransformerInterface {

    protected daoAssetTransformer: DaoAssetTransformer;
    protected rewardsPricelists: RewardPricelist[]
    protected locks: TreasuryLock[]

    constructor(rewardsPricelists: RewardPricelist[], locks: TreasuryLock[], ftMetadataLoader: FtMetadataLoader) {
        this.rewardsPricelists = rewardsPricelists
        this.locks = locks
        this.daoAssetTransformer = new DaoAssetTransformer(ftMetadataLoader)
    }

    async transform(value: any): Promise<Reward[]> {
        const rewards: Reward[] = []
        let valueRewardsItem: any
        let valueRewardsStats: any
        let valueClaimableItem: any
        let reward: Reward | undefined
        let pricelist: RewardPricelist | undefined
        let asset: DaoAsset

        for (let i = 0; i < value.rewards.length; i++) {
            valueRewardsItem = value.rewards[i]

            pricelist = loFind(this.rewardsPricelists, {id: valueRewardsItem.reward_id})

            reward = {
                id: i + 1,
                pricelistId: valueRewardsItem.reward_id,
                pricelist: pricelist,
                amounts: [],
            }

            for (let j = 0; j < valueRewardsItem.withdraw_stats.length; j++) {
                valueRewardsStats = valueRewardsItem.withdraw_stats[j]
                switch (pricelist?.type) {
                    case 'salary': {
                            asset = await this.daoAssetTransformer.transform(loGet(valueRewardsStats, ['wage', 'asset_id']))
                            reward.amounts.push({
                                asset,
                                lastWithdraw: NearUtils.dateFromChain(loMax([valueRewardsItem.time_added, loGet(valueRewardsStats, ['wage', 'timestamp_last_withdraw'])])),
                                amount: null,
                                amountDelta: null,
                                amountCounting: null,
                            })
                        }
                        break;
                    default:
                        break;
                }
            }

            rewards.push(reward)
        }

        
        for (let i = 0; i < value.claimable_rewards.length; i++) {
            valueClaimableItem = value.claimable_rewards[i]

            asset = await this.daoAssetTransformer.transform(valueClaimableItem.asset)
            reward = loFind(rewards, {pricelistId: valueClaimableItem.reward_id})

            if (reward !== undefined) {
                reward.lockId = valueClaimableItem.partition_id
                reward.lock = loFind(this.locks, {id: valueClaimableItem.partition_id})
                reward.amounts.forEach((item) => {
                    if (item.asset.accountId === asset.accountId) {
                        item.amount = NumberHelper.parseNumber(NearUtils.amountFromDecimals(loToString(valueClaimableItem.amount), asset.decimals))
                        item.amountDelta = RewardsHelper.getAmountDeltaInSecond(asset, reward!.pricelist!)
                        item.amountCounting = RewardsHelper.getAmountCounting(item)
                    }
                })
            }
        }

        return rewards;
    }
}