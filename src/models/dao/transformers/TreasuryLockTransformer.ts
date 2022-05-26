import TransformerInterface from "@/models/interfaces/Transformer.interface";
import loFind from "lodash/find"
import loGet from "lodash/get"
import loMin from "lodash/min"
import loFindKey from "lodash/findKey"
import loToPairs from "lodash/toPairs"
import { TreasuryAsset, TreasuryLock, TreasuryLockAsset, TreasuryAssetUnlocking } from "../types/treasury";
import { TreasuryPartition, AssetFT, PartitionAsset } from "../../nearBlockchain/types/dao";
import FtMetadataLoader from "@/models/ft/FtMetadataLoader";
import { NotImplementedError } from "@/models/utils/errors";
import { getMetadata } from "../../ft/data";
import { FungibleTokenMetadata } from "@/models/nearBlockchain/types/ft";
import NearUtils from "../../nearBlockchain/Utils";
import TreasuryHelper from "../TreasuryHelper";

export default class TreasuryLockTransformer implements TransformerInterface {

    protected ftMetadataLoader: FtMetadataLoader;

    constructor(ftMetadataLoader: FtMetadataLoader) {
        this.ftMetadataLoader = ftMetadataLoader
    }

    async transform(value: any) {
        const data: [number, TreasuryPartition] = value

        // assets
        const assets: TreasuryLockAsset[] = []
        let lockAssetData: PartitionAsset
        let treasuryAsset: TreasuryAsset | null = null
        let ftAccountId: string | null = null
        let ftMetadata: FungibleTokenMetadata | null = null
        let totalLocked: number = 0
        let totalUnlocked: number = 0
        let unlocked: number = 0
        let unlocking: TreasuryAssetUnlocking[] = []
        //let locked: number = 0
        for (lockAssetData of data[1].assets) {
            // FT
            if (loGet(lockAssetData, ['asset_id', 'f_t']) !== undefined) {
                ftAccountId = loGet(lockAssetData, ['asset_id', 'f_t', 'account_id'])
                ftMetadata = await this.ftMetadataLoader.load(ftAccountId!)
                treasuryAsset = {
                    type: 'ft',
                    accountId: ftAccountId!,
                    name: ftMetadata.name,
                    symbol: ftMetadata.symbol,
                    icon: ftMetadata.icon,
                    decimals: ftMetadata.decimals,
                }
            // near
            } else if (loGet(lockAssetData, ['asset_id']) === 'near') {
                ftAccountId = 'near'
                ftMetadata = getMetadata(ftAccountId)
                treasuryAsset = {
                    type: 'near',
                    accountId: 'near',
                    name: ftMetadata.name,
                    symbol: ftMetadata.symbol,
                    icon: ftMetadata.icon,
                    decimals: ftMetadata.decimals,
                }
            // nft
            } else if (loGet(lockAssetData, ['asset_id', 'n_f_t']) !== undefined) {
                throw new NotImplementedError('NFT Asset not implemented')
            } else {
                console.log(loToPairs(lockAssetData))
                throw new NotImplementedError('This asset type not implemented: ' + loToPairs(lockAssetData))
            }

            totalLocked = lockAssetData.lock?.lock.amount_total_locked || 0
            totalUnlocked = lockAssetData.lock?.lock.amount_total_unlocked || 0
            unlocked = lockAssetData.amount
            // locked = totalLocked - totalUnlocked + unlocked

            unlocking = []
            lockAssetData.lock?.lock.periods.forEach((period) => unlocking.push({
                targetDate: NearUtils.dateFromChain(period.end_at),
                type: period.type,
                amount: period.amount
            }))

            assets.push({
                asset: treasuryAsset!,
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