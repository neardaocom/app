import { TreasuryLock, TreasuryTotalAsset, TreasuryLockAsset } from "../types/treasury";
import ServicePool from "../ServicePool";
import CollectionHelper from "@/models/utils/CollectionHelper";
import { DAO } from "../types/dao";
import { getMetadata } from '../../ft/data'
import { NotImplementedError } from "@/models/utils/errors";
import FtContractService from "@/models/nearBlockchain/FtContractService";
import NearUtils from "@/models/nearBlockchain/Utils";
import NumberHelper from "@/models/utils/NumberHelper";
import FtMetadataLoader from "@/models/ft/FtMetadataLoader";

export default class TreasuryAnalytics {
    private servicePool: ServicePool;

    constructor(servicePool: ServicePool) {
        this.servicePool = servicePool
    }

    async computeTotalAssetValueFromLocks (dao: DAO, locks: TreasuryLock[]): Promise<TreasuryTotalAsset[]> {
        const assets = this.computeLockAssetSummary(locks)

        // check if there is near
        if (assets.filter((item) => item.asset.type === 'near').length == 0) {
            const nearMetadata = getMetadata('near')
            assets.push({
                asset: {
                    type: 'near',
                    accountId: 'near',
                    name: nearMetadata.name,
                    symbol: nearMetadata.symbol,
                    icon: nearMetadata.icon,
                    decimals: nearMetadata.decimals,
                },
                totalLocked: 0,
                totalUnlocked: 0,
                unlocked: 0,
                unlocking: [],
            })
        }
        // check if there is token
        if (assets.filter((item) => item.asset.accountId === dao.settings.token_id).length == 0) {
            const metadataLoader = new FtMetadataLoader(this.servicePool)
            const tokenMetadata = await metadataLoader.load(dao.settings.token_id)
            assets.push({
                asset: {
                    type: 'ft',
                    accountId: dao.settings.token_id,
                    name: tokenMetadata.name,
                    symbol: tokenMetadata.symbol,
                    icon: tokenMetadata.icon,
                    decimals: tokenMetadata.decimals,
                },
                totalLocked: 0,
                totalUnlocked: 0,
                unlocked: 0,
                unlocking: [],
            })
        }

        let assetAmount: number = 0
        let lockAsset: TreasuryLockAsset
        let assetAmountString: string
        let ftService: FtContractService

        const resutls: TreasuryTotalAsset[] = []

        for (lockAsset of assets) {
            switch (lockAsset.asset.type) {
                case 'near': {
                        assetAmount = dao.treasury.near
                    }
                    break;
                case 'ft': {
                        ftService = this.servicePool.getFt(lockAsset.asset.accountId)
                        assetAmountString = await ftService.ftBalanceOf(dao.wallet)
                        assetAmount = NumberHelper.parseNumber(NearUtils.amountFromDecimals(assetAmountString, lockAsset.asset.decimals))
                    }
                    break;
                default:
                    throw new NotImplementedError('Unsupported type: ' + lockAsset.asset.type)
            }
            resutls.push({
                asset: lockAsset.asset,
                amount: assetAmount,
                amountLockedInLocks: (lockAsset.totalLocked - lockAsset.totalUnlocked),
            })
        }

        return resutls
    }

    computeLockAssetSummary(locks: TreasuryLock[]): TreasuryLockAsset[] {
        const resutls: TreasuryLockAsset[] = []

        let totalAsset: TreasuryLockAsset | any | undefined = undefined

        locks.forEach((lock) => {
            lock.assets.forEach((asset) => {
                totalAsset = CollectionHelper.findDeep(resutls, ['asset', 'accountId'], asset.asset.accountId)
                if (totalAsset) {
                    totalAsset.totalLocked += asset.totalLocked
                    totalAsset.totalUnlocked += asset.totalUnlocked
                    totalAsset.unlocked += asset.unlocked
                } else {
                    resutls.push({
                        ...asset,
                        unlocking: [],
                    })
                }
            })
        })

        return resutls
    }
}
