import { ref, Ref } from "vue";
import { Loader } from "@/loader";
import { Config } from "@/config";
import DaoSkyward from "@/models/dao/DaoSkyward";
import { Auction } from "@/models/auction/types";
import { DAO } from "@/models/dao/types/dao";

export const useSkyward = (loader: Ref<Loader>, config: Ref<Config>) => {
    const servicePool = loader.value.load('dao/ServicePool')
    const ipfsService = loader.value.load('services/ipfs')
    const skyward = ref(new DaoSkyward(servicePool.value, ipfsService.value, config.value))
    return { skyward }
}

export const useSkywardFinanace = (dao: Ref<DAO>, loader: Ref<Loader>, config: Ref<Config>) => {
    const { skyward } = useSkyward(loader, config)

    const list = ref<Auction[]>([])
    const interval = ref()

    const fetch = async () => {
        list.value = await skyward.value.getList(dao.value)
    }

    const filter = (scenario: string) => {
        let result: Auction[] = []
        if (list.value && list.value.length > 0) {
            switch (scenario) {
                case 'active':
                    result = list.value.filter( (sale: Auction) => sale.remaining_duration > 0 )
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
        list, interval,
        fetch, filter, reloadUp, reloadDown
    }
}