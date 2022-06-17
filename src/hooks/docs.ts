import DaoResource from "@/models/dao/DaoResource"
import { DAO } from "@/models/dao/types/dao"
import IpfsService from "@/models/interfaces/IpfsService.interface"
import { computed, ref, Ref } from "vue"

export const useResource = (ipfsService: Ref<IpfsService> , dao: Ref<DAO>) => {
    const daoResource = ref(new DaoResource(ipfsService.value))
    const files = computed(() => (daoResource.value.list(dao.value.docs)))

    return {
        daoResource, files
    }
}