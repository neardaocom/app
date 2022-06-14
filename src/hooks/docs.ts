import DaoResource from "@/models/dao/DaoResource"
import IpfsService from "@/models/interfaces/IpfsService.interface"
import { ref, Ref } from "vue"

export const useResource = (ipfsService: Ref<IpfsService>) => {
    const daoResource = ref(new DaoResource(ipfsService.value))

    return {
        daoResource
    }
}