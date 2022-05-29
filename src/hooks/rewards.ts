import { DAO } from "@/models/dao/types/dao";
import { Ref, ref, computed } from "vue";
import { Loader } from "@/loader";
import DaoRewards from "@/models/dao/DaoRewards";

export const useRewards = (dao: Ref<DAO>, loader: Ref<Loader>) => {
    const servicePool = loader.value.load('dao/ServicePool')
    const daoRewards = ref(new DaoRewards(servicePool.value.getContract(dao.value.wallet), servicePool.value.getWfProvider(dao.value.settings.workflow_provider)))

    const createSalary = (groupId: number, amountNear: number | null, amountToken: number | null, timeUnit: number, lockId: number) =>
        daoRewards.value.createSalary(dao.value, groupId, amountNear, amountToken, timeUnit, lockId, new Date())

    return { daoRewards, createSalary }
}

export const useRewardsList = (dao: Ref<DAO>) => {
    const rewardsSalary = computed(() => DaoRewards.getList(dao.value, 'salary'))
    const rewardsActivity = computed(() => DaoRewards.getList(dao.value, 'activity'))
    const rewardsEvent = computed(() => DaoRewards.getList(dao.value, 'event'))

    return { rewardsSalary, rewardsActivity, rewardsEvent }
}