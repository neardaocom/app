import { DAO } from "@/models/dao/types/dao";
import { Ref, ref, computed } from "vue";
import { Loader } from "@/loader";
import DaoRewards from "@/models/dao/DaoRewards";
import { Account } from "near-api-js";
import FtMetadataLoader from "@/models/ft/FtMetadataLoader";
import { Reward, RewardAssetStats } from "@/models/dao/types/rewards";
import loMin from 'lodash/min'
import RewardsAnalytics from "@/models/dao/analytics/RewardsAnalytics";
import { DaoAsset } from "@/models/dao/types/asset";

export const useRewards = (dao: Ref<DAO>, loader: Ref<Loader>) => {
    const servicePool = loader.value.load('dao/ServicePool')
    const daoRewards = ref(new DaoRewards(servicePool.value))

    const createSalary = (groupId: number, amountNear: number | null, amountToken: number | null, timeUnit: number, lockId: number) =>
        daoRewards.value.createSalary(dao.value, groupId, amountNear, amountToken, timeUnit, lockId, new Date())
    const withdraw = (asset: DaoAsset, rewardsIds: number[]) =>
        daoRewards.value.withdraw(dao.value.wallet, asset, rewardsIds)

    return { daoRewards, createSalary, withdraw }
}

export const useRewardsList = (dao: Ref<DAO>) => {
    const rewardsSalary = computed(() => DaoRewards.getList(dao.value, 'salary'))
    const rewardsActivity = computed(() => DaoRewards.getList(dao.value, 'activity'))
    const rewardsEvent = computed(() => DaoRewards.getList(dao.value, 'event'))

    return { rewardsSalary, rewardsActivity, rewardsEvent }
}

export const useClaimableRewards = (dao: Ref<DAO>, walled: Ref<Account>, daoRewards: Ref<DaoRewards>, loader: Ref<Loader>) => {
    const servicePool = loader.value.load('dao/ServicePool')
    const rewardsClaimable = ref<Reward[]|null>(null)
    const rewardsAssetStats = ref<RewardAssetStats[]|null>(null)
    
    const rewardsLoadClaimable = async () => {
        rewardsClaimable.value = await daoRewards.value.loadClaimable(walled.value.accountId, dao.value, new FtMetadataLoader(servicePool.value))
    }
    const rewardsLoadIntervalStep = computed(() => loMin(dao.value?.rewardsPricelists.map((item) => item.unitSeconds)))
    const rewardsLoadIntervalId = ref<number|undefined>()
    const rewardsLoadTurnOn = () => {
        rewardsLoadIntervalId.value = window.setInterval(rewardsLoadClaimable, ((rewardsLoadIntervalStep.value ?? 60 ) * 1_000))
    }
    const rewardsLoadTurnOff = () => {
        window.clearInterval(rewardsLoadIntervalId.value)
    }

    const rewardsCounting = () => {
        DaoRewards.recomputeCounting(rewardsClaimable.value as Reward[])
        rewardsAssetStats.value = RewardsAnalytics.computeAssetStats(rewardsClaimable.value as Reward[])
    }
    const rewardsCountingIntervalId = ref<number|undefined>()
    const rewardsCountingTurnOn = () => {
        rewardsCountingIntervalId.value = window.setInterval(rewardsCounting, 2_000)
    }
    const rewardsCountingTurnOff = () => {
        window.clearInterval(rewardsCountingIntervalId.value)
    }

    return {
        rewardsClaimable, rewardsLoadClaimable, rewardsAssetStats,
        rewardsLoadIntervalStep, rewardsLoadIntervalId, rewardsLoadTurnOn, rewardsLoadTurnOff,
        rewardsCounting, rewardsCountingIntervalId, rewardsCountingTurnOn, rewardsCountingTurnOff,
    }
}