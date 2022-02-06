import { ref, reactive } from "vue";
import { Account } from 'near-api-js';
import { RefFinanceService } from '@/services/refFinanceService'
import { GeneralTokenService } from '@/services/generalTokenService';

export const useRefFinance = (account: Account, contract: string) => {
    const nearAccount = reactive(account)
    const walletId = ref(contract)
    const service = reactive(new RefFinanceService(account, contract))
    const founds = ref(null)
    const tokenMetadata = ref(null)
    const tokenId = ref('')

    const interval = ref()


    const fetchFounds = () => {
        service.getDeposits(walletId.value).then( deposits => {
            if (Object.keys(deposits).length !== 0) {
                Object.entries(deposits).forEach( async ([key]) => {
                    if (key !== walletId.value){
                        tokenId.value = key
                        const generalTokenService = new GeneralTokenService(nearAccount, key)
                        tokenMetadata.value =  await generalTokenService.getFtMetadata()
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