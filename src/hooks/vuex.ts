import { Config } from "@/config";
import { computed } from "vue";
import { useStore } from 'vuex';

export const useIPFS = () => {
    const store = useStore()
    const ipfsService = computed(() => store.getters['ipfs/getService'])

    return { ipfsService }
}

export const useNear = (config: Config) => {
    const store = useStore()

    const nearService = computed(() => store.getters['near/getService'])
    const wallet = computed(() => store.getters['near/getWallet'])
    const walletUrl = computed(() => store.getters['near/getWalletUrl'])
    const provider = computed(() => store.getters['near/getProviderContract'])
    const factoryAccount = computed(() => (config.near.daoFactoryAccountId))
    const accountId = computed(() => ( store.getters['near/getAccountId']))

    return { nearService, wallet, walletUrl, provider, factoryAccount, accountId }
}

export const useWallet = () => {
    const store = useStore()
    const wallet = computed(() => store.getters['near/getWallet'])

    return { wallet }
}
