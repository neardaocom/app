import TreasuryAnalytics from "@/models/dao/analytics/TreasuryAnalytics";
import { DAO } from "@/models/dao/types/dao";
import { computed, Ref } from "vue";

export const useAnalytics = (dao: Ref<DAO>) => {
    const treasuryTotalLocked = computed(() => (TreasuryAnalytics.computeTotalAssetValueFromLocks(dao.value.treasuryLocks || [])))
    return { treasuryTotalLocked }
}