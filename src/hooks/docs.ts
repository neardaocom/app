import DaoResource from "@/models/dao/DaoResource"
import IpfsService from "@/models/interfaces/IpfsService.interface"
import { ref, Ref } from "vue"
import { useI18n } from "vue-i18n"

export const useResource = (ipfsService: Ref<IpfsService>) => {
    const { t } = useI18n()
    const daoResource = ref(new DaoResource(ipfsService.value, t))

    return {
        daoResource
    }
}