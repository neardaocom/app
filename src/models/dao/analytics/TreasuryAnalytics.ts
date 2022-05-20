import { TreasuryLock, TreasuryTotalLocked } from "../types/treasury";
import loFind from "lodash/find";


export default class TreasuryAnalytics {
    static computeTotalAssetValueFromLocks (locks: TreasuryLock[]): TreasuryTotalLocked[] {
        const resutls: TreasuryTotalLocked[] = []

        let locked: TreasuryTotalLocked|undefined = undefined

        locks.forEach((lock) => {
            lock.assets.forEach((asset) => {
                locked = loFind(resutls, {assetAccountId: asset.asset.accountId})
                if (locked) {
                    locked.amountLocked += asset.locked
                    locked.amountUnlocked += asset.unlocked
                } else {
                    resutls.push({
                        assetAccountId: asset.asset.accountId,
                        assetSymbol: asset.asset.symbol,
                        assetIcon: asset.asset.icon,
                        amountLocked: asset.locked,
                        amountUnlocked: asset.unlocked,
                    })
                }
            })
        })

        return resutls
    }
}
