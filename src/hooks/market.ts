import { ref, Ref, reactive, onMounted, onUnmounted, computed } from "vue";
import { Account } from 'near-api-js';
import { useStore } from 'vuex'
import { RefFinanceService } from '@/models/services/refFinanceService'
import { GeneralTokenService } from '@/models/services/generalTokenService';
import { CoinGeckoExchange } from "@/models/services/exchangeService"
import { Config } from "@/config";
import { Loader } from "@/loader";
import DaoMarket from "@/models/dao/DaoMarket";

export const useMarket = (loader: Ref<Loader>, config: Ref<Config>) => {
    const servicePool = loader.value.load('dao/ServicePool')
    const market = ref(new DaoMarket(config.value.near.wfProviderAccountId, servicePool.value))
    return { market }
}

export const useRefFinance = (account: Account, contract: string) => {
    const nearAccount = reactive(account)
    const walletId = ref(contract)
    const service = reactive(new RefFinanceService(account, contract))
    const founds = ref(null)
    const tokenMetadata = ref(null)
    const tokenId = ref('')
    
    const interval = ref()

    const fetchFounds = () => {
        service.getDeposits(walletId.value).then(deposits => {
            if (Object.keys(deposits).length !== 0) {
                Object.entries(deposits).forEach(async ([key]) => {
                    if (key !== walletId.value) {
                        tokenId.value = key
                        const generalTokenService = new GeneralTokenService(nearAccount, key)
                        tokenMetadata.value = await generalTokenService.getFtMetadata()
                    }
                })
                founds.value = deposits
            }
        })
    }

    const reloadUp = (step: number) => {
        interval.value = window.setInterval(fetchFounds, step)
        // console.log('Skyward refreshing UP')
    }

    const reloadDown = () => {
        window.clearInterval(interval.value)
        // console.log('Skyward refreshing DOWN')
    }

    return {
        service, founds, tokenMetadata, tokenId,
        fetchFounds, reloadUp, reloadDown,
    }
}

export const useNearPriceLoader = (config: Config) => {
    const store = useStore()
    const coinGeckoExchange = ref(new CoinGeckoExchange(config.market))
    const nearPriceInterval = ref<any>(null)
    const nearPriceResolve = async () => {
        const value = await coinGeckoExchange.value.getActualPrice('near')
        store.commit('market/setNearPriceUsd', value)
    }

    onMounted(async () => {
        nearPriceInterval.value = setInterval(nearPriceResolve, 5 * 60 * 1_000) // 5 minutes
    })

    onUnmounted(() => {
        clearInterval(nearPriceInterval.value)
    })

    return { coinGeckoExchange,  nearPriceResolve, nearPriceInterval }
}

export const useNearPrice = () => {
    const store = useStore()
    
    const nearPriceUsd = computed(() => store.getters['market/getNearPrice'])
    

    return { nearPriceUsd }
}