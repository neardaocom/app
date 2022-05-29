// import TreasuryAnalytics from "@/models/dao/analytics/TreasuryAnalytics";
import { DAO } from "@/models/dao/types/dao";
import { onMounted, Ref, ref, computed } from "vue";
import CollectionHelper from "@/models/utils/CollectionHelper";
import { TreasuryLock, TreasuryLockAsset, TreasuryTotalAsset } from "@/models/dao/types/treasury"
import { Loader } from "@/loader";
import TreasuryAnalytics from "@/models/dao/analytics/TreasuryAnalytics";
import DaoTreasury from "@/models/dao/DaoTreasury";
import TreasuryHelper from "@/models/dao/TreasuryHelper";

export const useAnalytics = (dao: Ref<DAO>, loader: Ref<Loader>) => {
    const dataLoaded = ref<boolean>(false)

    const treasuryLocks = computed(() => dao.value.treasuryLocks)
    const treasuryTotalAssets = ref<TreasuryTotalAsset[]>([])
    const treasuryNear = ref<TreasuryTotalAsset|any|null>(null)
    const treasuryToken = ref<TreasuryTotalAsset|any|null>(null)
    const treasuryFtAssets = ref<TreasuryTotalAsset[]>([])

    const availableNearAmount = ref<number|null>(null)
    const availableTokenAmount = ref<number|null>(null)

    onMounted(async () => {
        const servicePool = await loader.value.get('dao/ServicePool')
        const treasuryAnalytics = new TreasuryAnalytics(servicePool.value)
        treasuryTotalAssets.value = await treasuryAnalytics.computeTotalAssetValueFromLocks(dao.value, treasuryLocks.value)
        treasuryNear.value = CollectionHelper.findDeep(treasuryTotalAssets.value, ['asset', 'type'], 'near') || null
        treasuryToken.value = CollectionHelper.findDeep(treasuryTotalAssets.value, ['asset', 'accountId'], dao.value.settings.token_id) || null
        treasuryFtAssets.value = treasuryTotalAssets.value.filter((item) => item.asset.type !== 'near' && item.asset.accountId !== dao.value.settings.token_id)
        availableNearAmount.value = (treasuryNear.value.amount - treasuryNear.value.amountLockedInLocks)
        availableTokenAmount.value = (treasuryToken.value.amount - treasuryToken.value.amountLockedInLocks)
        dataLoaded.value = true
    })

    return { dataLoaded, treasuryLocks, treasuryTotalAssets, treasuryNear, treasuryToken, treasuryFtAssets, availableNearAmount,  availableTokenAmount }
}

export const useTreasury = (dao: Ref<DAO>, loader: Ref<Loader>) => {
    const servicePool = loader.value.load('dao/ServicePool')
    const daoTreasury = ref(new DaoTreasury(servicePool.value.getContract(dao.value.wallet), servicePool.value.getWfProvider(dao.value.settings.workflow_provider)))

    const createLockSimple = (name: string, amountNear: number | null, amountToken: number | null) =>
        daoTreasury.value.createLockSimple(dao.value, name, amountNear, amountToken)
    const unlock = (lockId: number) =>
        daoTreasury.value.unlock(lockId)

    return { daoTreasury, createLockSimple, unlock }
}

export const useTreasuryLock = (lock: Ref<TreasuryLock>) => {
    const isUnlocked = computed(() => TreasuryHelper.isUnlocked(lock.value))
    const canUnlock = computed(() => TreasuryHelper.canUnlock(lock.value))

    const computeUnlocked = (lockAsset: TreasuryLockAsset) => TreasuryHelper.getLocked(lockAsset)

    return { isUnlocked, canUnlock, computeUnlocked }
}