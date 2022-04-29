import { onMounted, ref, inject } from "vue";
import { useI18n } from "vue-i18n";
import IntegerHelper from "@/models/utils/IntegerHelper";

import DaoFactory from "@/models/nearBlockchain/DaoFactory";
import { ListItemDto } from "@/models/nearBlockchain/types/factory";
import DaoFromFactoryTransformer from "@/models/nearBlockchain/transformers/DaoFromFactory.transformer";
import TagFromFactoryTransformer from "@/models/nearBlockchain/transformers/TagFromFactory.transformer";

export const useFetch = (daoFactory: DaoFactory) => {
    const { t, n } = useI18n()
    const logger: any = inject('logger')
    const notify: any = inject('notify')

    const loadingProgress = ref(0)
    const tags = ref<string[]>([])
    const list = ref<ListItemDto[]>([])

    onMounted(async () => {
        loadingProgress.value = IntegerHelper.getRandom(5, 15)

        try {
            const tagTransformer = new TagFromFactoryTransformer(t)
            tags.value = await daoFactory.getTags(tagTransformer)
            loadingProgress.value = IntegerHelper.getRandom(20, 30)

            const daoTransformer = new DaoFromFactoryTransformer(t, n, tags.value)
            list.value = await daoFactory.getDaoList(0, 100, daoTransformer)
            loadingProgress.value = 75

            // load amount
            //this.nearService.getDaosAmount(this.list.map((item) => item.id + '.' + this.factoryAccount)).then(
            //wallets => {
            //    // console.log(wallets)
            //    this.list.forEach((element, index) => {
            //    element.amount = new Decimal(wallets[index]).times(this.nearPrice).toFixed(2)
            //    });
            //    this.loadingProgress = 100
            //}
            //)
            loadingProgress.value = 100
        } catch (e) {
            logger.error('D', 'app@pages/DaoList', 'FetchingDaoList', 'Fetching Dao list failed')
            logger.error('B', 'app@pages/DaoList', 'FetchingDaoList', 'Fetching Dao list failed')
            notify.warning(t('default.notify_dao_list_fetching_fail_title'), t('default.notify_blockchain_fail') + " " + t('default.notify_dao_list_fetching_fail_message'))
            notify.flush()
            console.log(e)
        }
    })

    return {
        loadingProgress, tags, list
    }
}