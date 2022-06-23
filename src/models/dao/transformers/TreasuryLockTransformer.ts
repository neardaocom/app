import TransformerInterface from "@/models/interfaces/Transformer.interface";
import loMin from "lodash/min"
import { TreasuryLock, TreasuryLockAsset, TreasuryAssetUnlocking, TreasuryAssetUnlockingType } from "../types/treasury";
import { TreasuryPartition, AssetFT, PartitionAsset } from "../../nearBlockchain/types/dao";
import FtMetadataLoader from "@/models/ft/FtMetadataLoader";
import NearUtils from "../../nearBlockchain/Utils";
import TreasuryHelper from "../TreasuryHelper";
import NumberHelper from "@/models/utils/NumberHelper";
import DaoAssetTransformer from "./DaoAssetTransformer";
import { DaoAsset } from "../types/asset";

export default class TreasuryLockTransformer implements TransformerInterface {

    protected daoAssetTransformer: DaoAssetTransformer;

    constructor(ftMetadataLoader: FtMetadataLoader) {
        this.daoAssetTransformer = new DaoAssetTransformer(ftMetadataLoader)
    }

    async transform(value: any) {
        const data: [number, TreasuryPartition] = value

        // assets
        const assets: TreasuryLockAsset[] = []
        let lockAssetData: PartitionAsset
        let treasuryAsset: DaoAsset | null = null
        let totalLocked: number = 0
        let totalUnlocked: number = 0
        let unlocked: number = 0
        let unlocking: TreasuryAssetUnlocking[] = []
        //let locked: number = 0
        for (lockAssetData of data[1].assets) {
            treasuryAsset = await this.daoAssetTransformer.transform(lockAssetData.asset_id)

            totalLocked = lockAssetData.lock?.lock.amount_total_locked || 0
            totalUnlocked = lockAssetData.lock?.lock.amount_total_unlocked || 0
            unlocked = NumberHelper.parseNumber(NearUtils.amountFromDecimals(lockAssetData.amount.toString(), treasuryAsset.decimals))
            // locked = totalLocked - totalUnlocked + unlocked

            unlocking = []
            lockAssetData.lock?.lock.periods.forEach((period) => unlocking.push({
                targetDate: NearUtils.dateFromChain(period.end_at),
                type: period.type as TreasuryAssetUnlockingType,
                amount: period.amount
            }))

            assets.push({
                asset: treasuryAsset,
                startFrom: NearUtils.dateFromChain(lockAssetData.lock?.lock.start_from || 0),
                totalLocked,
                totalUnlocked,
                unlocked,
                unlocking: unlocking,
            })
        }

        const nextUnlock = loMin(assets.map((asset) => TreasuryHelper.getNextUnlock(asset))) || null

        const lock: TreasuryLock = {
            id: data[0],
            name: data[1].name,
            nextUnlock: nextUnlock,
            createdBy: null,
            assets: assets,
        }

        return lock;
    }
}