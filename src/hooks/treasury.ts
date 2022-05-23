// import TreasuryAnalytics from "@/models/dao/analytics/TreasuryAnalytics";
import { DAO } from "@/models/dao/types/dao";
import { computed, Ref } from "vue";
import CollectionHelper from "@/models/utils/CollectionHelper";
import { TreasuryTotalAsset } from "@/models/dao/types/treasury"

export const useAnalytics = (dao: Ref<DAO>) => {
    const treasuryLocks = computed(() => dao.value.treasuryLocks)
    // const treasuryTotalAssets = computed(() => (TreasuryAnalytics.computeTotalAssetValueFromLocks(dao.value)))
    const treasuryTotalAssets: Ref<TreasuryTotalAsset[]> = computed(() => [])
    const treasuryNear = computed(() => CollectionHelper.findDeep(treasuryTotalAssets.value, ['asset', 'type'], 'near'))
    const treasuryToken = computed(() => CollectionHelper.findDeep(treasuryTotalAssets.value, ['asset', 'accountId'], dao.value.settings.token_id))
    const treasuryFtAssets = computed(() => 
        treasuryTotalAssets.value.filter((item) => item.asset.type !== 'near' && item.asset.accountId !== dao.value.settings.token_id)
    )

    return { treasuryLocks, treasuryTotalAssets, treasuryNear, treasuryToken, treasuryFtAssets }
}