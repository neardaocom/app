import { useRoute, useRouter } from "vue-router";
import { computed } from "vue";
import loGet from "lodash/get";

export const useLinks = () => {
    const router = useRouter()
    const createDaoPage = () => router.push({name: 'dao-create'})

    return {
        createDaoPage
    }
}

export const useRouteFilter = () => {
    const route = useRoute()
    const rSearch = computed(() => loGet(route, ['query', 'search']))
    const rOrder = computed(() => loGet(route, ['query', 'order']))

    return {
        rSearch, rOrder
    }
}

export const useNearBlockchainTransaction = () => {
    const route = useRoute()
    const transactionHashes = computed(() => loGet(route, ['query', 'transactionHashes']))
    const transactionStatus = computed(() => {
        if (transactionHashes.value !== undefined) {
            return loGet(route, ['query', 'errorCode']) || 'success'
        } else {
            return undefined
        }
    })

    return {
        transactionHashes, transactionStatus
    }
}