import ProgressComputing from "../analytics/ProgressComputing";
import { Period, ProgressItem } from "../analytics/types";
import { TreasuryAssetUnlocking, TreasuryAssetUnlockingType, TreasuryLockAsset } from "./types/treasury";
import loClone from "lodash/clone"
import Utils from "../analytics/Utils";

export default class DaoAnalytics {

    computeUnlockingCashflow = (lockAsset: TreasuryLockAsset, period: Period = Period.Month): ProgressItem[] => {
        const list: ProgressItem[] = []
        let computed: number | undefined
        let unlockingItem: TreasuryAssetUnlocking | undefined = undefined
        let loopCounter: number

        //let increment: Date = loClone(begin)

        let target: Date = loClone(lockAsset.startFrom)
        let startAt: Date = loClone(lockAsset.startFrom)
        let startAmount: number = 0

        for (let index = 0; index < lockAsset.unlocking.length; index++) {
            loopCounter = 0
            unlockingItem = lockAsset.unlocking[index]

            while (target <= unlockingItem.targetDate && loopCounter < 1_000) {
                switch (unlockingItem.type) {
                    case TreasuryAssetUnlockingType.Linear:
                        computed = ProgressComputing.getAmountLinear(target, startAt, startAmount, unlockingItem.targetDate, unlockingItem.amount)
                        break;
                    case TreasuryAssetUnlockingType.None:
                        computed = ProgressComputing.getAmountNone(target, startAt, startAmount, unlockingItem.targetDate)
                        break;
                    default:
                        break;
                }

                list.push({date: loClone(target), value: computed || null})

                loopCounter += 1
                target = Utils.getPeriodStep(target, period)
            }

            startAt = unlockingItem.targetDate
            startAmount = unlockingItem.amount
        }

        // add last
        if (computed && unlockingItem && computed < unlockingItem.amount) {
            list.push({date: loClone(target), value: unlockingItem.amount})
        }

        return list
    }
}