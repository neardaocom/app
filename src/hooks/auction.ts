import { ref, reactive } from "vue";
import { Sale } from "@/services/skywardFinanceService/types"
import { Account } from 'near-api-js';
import { SkywardFinance } from "@/services/skywardFinanceService";
import Auction from "@/models/auction"

export const useSkywardFinanace = (account: Account, contract: string, sales: number[]) => {

    const service = reactive(new SkywardFinance(account, contract))
    const salesIds = ref(sales)
    const list = ref([])
    const interval = ref()


    const fetch = () => {
        if (salesIds.value) {
            service.getSalesById(salesIds.value).then( sales => {
                list.value = sales.map( sale => Auction.transform('skyward.finance', sale) )
            })
        }
    }

    const filter = (scenario: string) => {
        let result = []
        if (list.value && list.value.length > 0) {
            switch (scenario) {
                case 'active':
                    result = list.value.filter( (sale: Sale) => sale.remaining_duration > 0 )
                    break;
                default:
                    break;
            }
        }
        return result
    }

    const reloadUp = (step: number) => {
        interval.value = window.setInterval(fetch, step)
        // console.log('Skyward refreshing UP')
    }

    const reloadDown = () => {
        window.clearInterval(interval.value)
        // console.log('Skyward refreshing DOWN')
    }

    return {
        service, salesIds, list, interval,
        fetch, filter, reloadUp, reloadDown
    }
}