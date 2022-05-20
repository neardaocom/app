import { onMounted, onUnmounted, ref, inject, toRaw, Ref, computed, watchEffect } from "vue";
import { useI18n } from "vue-i18n";
import IntegerHelper from "@/models/utils/IntegerHelper";
import DaoList from "@/models/dao/DaoList";
import { ListItemDto } from "@/models/dao/types/factory";
import { useStore } from "vuex";
import { Loader } from "@/loader";
import Decimal from "decimal.js";
import { Config } from "@/config";

export const useLoad = (loader: Ref<Loader>, logger: any, notify: any, config: Config) => {
    const store = useStore()
    const { t, n } = useI18n()

    const listInterval = ref<any>(null)
    const listResolve = async () => {
        try {
            const nearPriceUsd = store.getters['market/getNearPrice']
            const daoFactory = await loader?.value.get('dao/Factory')
            const daoList = new DaoList(daoFactory.value.createDaoFactory(), daoFactory.value.createNear(), t, n)
            await daoList.load(0, 100, nearPriceUsd)
            store.commit('near/setList', daoList.getList())
        } catch (e) {
            logger.error('D', 'app@pages/DaoList', 'FetchingDaoList', 'Fetching Dao list failed')
            logger.error('B', 'app@pages/DaoList', 'FetchingDaoList', 'Fetching Dao list failed')
            notify.warning(t('default.notify_dao_list_fetching_fail_title'), t('default.notify_blockchain_fail') + " " + t('default.notify_dao_list_fetching_fail_message'))
            notify.flush()
            console.log(e)
        }
    }

    onMounted(async () => {
        listInterval.value = setInterval(listResolve, 5 * 60 * 1_000) // 5 minutes
    })

    onUnmounted(() => {
        clearInterval(listInterval.value)
    })

    return {
        listInterval, listResolve
    }
}

export const useList = (config: Config) => {
    const store = useStore()
    const factoryAccount = computed(() => (config.near.daoFactoryAccountId))

    const loadingProgress = ref(0)
    const list = computed(() => store.getters['near/getList'] ?? [])

    onMounted(async () => {
        // loadingProgress.value = IntegerHelper.getRandom(5, 15)
        loadingProgress.value = 100
    })

    return {
        loadingProgress, list, factoryAccount
    }
}

export const useListTop = (count: number = 3, config: Config) => {
    const store = useStore()
    const factoryAccount = computed(() => (config.near.daoFactoryAccountId))

    const list = computed(() => store.getters['near/getList'] ?? [])
    const topList = ref([])
    watchEffect(() => {
        const data = toRaw(list.value)
        if (data.length > 0) {
            topList.value = data.sort((first, second) => new Decimal(second.treasuryAmount).minus(first.treasuryAmount).toNumber()).slice(0, count)
        }
    })

    return {
        list, topList, factoryAccount
    }
}