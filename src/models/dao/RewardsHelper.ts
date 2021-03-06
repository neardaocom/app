import Decimal from "decimal.js";
import moment from "moment";
import { DaoAsset } from "./types/asset";
import { RewardAmount, RewardPricelist } from "./types/rewards";

export default class RewardsHelper {

  static getAmountDeltaInSecond(asset: DaoAsset, pricelist: RewardPricelist): number | null {
    let getAmountDeltaInSecond: number | null = null

    if (pricelist.type === 'salary') {
      pricelist.amounts.forEach((item) => {
        if (item.asset.accountId === asset.accountId && pricelist.unitSeconds) {
          getAmountDeltaInSecond = new Decimal(item.amount).div(pricelist.unitSeconds).mul(100_000_000).round().div(100_000_000).toNumber()
        }
      })
    }

    return getAmountDeltaInSecond
  }

  static getAmountCounting(rewardAmount: RewardAmount): number | null {
    let amountCounting: number | null = null
    if (rewardAmount.lastWithdraw && rewardAmount.amountDelta) {
      const fromLastWithdrawInSeconds = moment(new Date()).diff(rewardAmount.lastWithdraw, 'seconds')
      amountCounting = new Decimal(rewardAmount.amountDelta).mul(fromLastWithdrawInSeconds).minus(rewardAmount.amount || 0).toNumber()
    }
    return amountCounting
  }
}