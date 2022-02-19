import { computed } from "vue";
import { useStore } from 'vuex';

export const useIPFSService = () => {
    const store = useStore()
    const ipfsService = computed(() => store.getters['ipfs/getService'])

    return ipfsService
}

export const useNearProvider = () => {
    const store = useStore()
    const provider = computed(() => store.getters['near/getProviderContract'])

    return { provider }
}

export const useNearService = () => {
    const store = useStore()
    const nearService = computed(() => store.getters['near/getService'])
    const factoryAccount = computed(() => (store.getters['near/getFactoryAccount']))
    const accountId = computed(() => ( store.getters['near/getAccountId']))
    

    return { nearService, factoryAccount, accountId }
}