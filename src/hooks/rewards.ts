import { DAO } from "@/models/dao/types/dao";
import { Ref, ref, computed } from "vue";
import { Loader } from "@/loader";
import DaoRewards from "@/models/dao/DaoRewards";
import { Account } from "near-api-js";
import FtMetadataLoader from "@/models/ft/FtMetadataLoader";
import { Reward, RewardAssetStats, RewardPricelist } from "@/models/dao/types/rewards";
import loMin from 'lodash/min'
import loToString from 'lodash/toString'
import RewardsAnalytics from "@/models/dao/analytics/RewardsAnalytics";
import { DaoAsset } from "@/models/dao/types/asset";
import CollectionHelper from "@/models/utils/CollectionHelper";
import NearBlockchainUtils from '@/models/nearBlockchain/Utils'
import DateHelper from "@/models/utils/DateHelper";
import { activities } from "@/models/dao/data/rewards";
import { useI18n } from "vue-i18n";

export const useRewards = (dao: Ref<DAO>, loader: Ref<Loader>) => {
    const { t } = useI18n()
    const servicePool = loader.value.load('dao/ServicePool')
    const daoRewards = ref(new DaoRewards(servicePool.value))

    const createSalary = (name: string, groupId: number, amountNear: number | null, amountToken: number | null, timeUnit: number, lockId: number, startAt: Date, endAt?: Date) =>
        daoRewards.value.createSalary(dao.value, name, groupId, amountNear, amountToken, timeUnit, lockId, startAt, endAt)

    const createActivity = (name: string, amountNear: number | null, amountToken: number | null, activityIds: number[], lockId: number, startAt: Date, endAt?: Date) =>
        daoRewards.value.createActivity(dao.value, name, amountNear, amountToken, activityIds, lockId, startAt, endAt)
    
    const withdraw = (asset: DaoAsset, rewardsIds: number[]) =>
        daoRewards.value.withdraw(dao.value.wallet, asset, rewardsIds)

    const frequencyToTime = (frequency) => {
        const time =  NearBlockchainUtils.durationFromChain(frequency)
        const years =  `${time.years ? time.years + 'years' : '' }`
        const months =  `${time.months ? time.months + 'months' : '' }`
        const days =  `${time.days ? time.days + 'days' : '' }`
        const hours =  `${time.hours ? time.hours + 'h' : '' }`
        const minutes = `${time.minutes ? time.minutes + 'm' : '' }`
        const seconds = `${time.seconds ? time.seconds + 's' : '' }`
        return years + months + days + hours + minutes + seconds
    }

    const activityOptions = computed(() => CollectionHelper.toOptions(activities, ['value'], ['id']).map((item) => {
        item.text = t('default.reward_' + item.text)
        item.value = loToString(item.value)
        return item
    }))
    
        
    const amountFromPricelist = (pricelistAmounts, accountId) => {
        const asset = CollectionHelper.findDeep(pricelistAmounts, ['asset', 'accountId'], accountId)
        return asset.amount
    }

    const rewardsDateFormat = (date :Date) => DateHelper.format(date, DateHelper.formatDateLong)


    return { daoRewards, createSalary, createActivity, withdraw, frequencyToTime, amountFromPricelist, rewardsDateFormat, activityOptions }
}

export const useRewardComputed = (rewards: Ref<RewardPricelist[]>) => {
    const rewardsStartAtDate = computed (() => {
        const  rewardsDateFormat: string[] = []
        rewards.value.forEach(reward => {
            rewardsDateFormat.push(DateHelper.format(reward.startAt, DateHelper.formatDateLong))
        })
        return rewardsDateFormat 
    })

    const rewardsStartAtTime = computed (() => {
        const  rewardsDateFormat: string[] = []
        rewards.value.forEach(reward => {
            rewardsDateFormat.push(DateHelper.format(reward.startAt, DateHelper.formatTime))
        })
        return rewardsDateFormat 
    })

    const rewardsEndsDate = computed (() => {
        const  rewardsDateFormat: string[] = []
        rewards.value.forEach(reward => {
            if(reward.endAt !== null)
                rewardsDateFormat.push(DateHelper.format(reward.endAt, DateHelper.formatTime))
            else
                rewardsDateFormat.push('∞') 
        })
        return rewardsDateFormat 
    })

    const rewardsEndsTime = computed (() => {
        const  rewardsDateFormat: string[] = []
        rewards.value.forEach(reward => {
            if(reward.endAt !== null)
                rewardsDateFormat.push(DateHelper.format(reward.endAt, DateHelper.formatTime))
            else
                rewardsDateFormat.push('∞') 
        })
        return rewardsDateFormat 
    })

       

    return {
        rewardsStartAtDate, rewardsStartAtTime, rewardsEndsDate, rewardsEndsTime
    }
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