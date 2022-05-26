import { ref, computed, onMounted, Ref } from 'vue'
import { useRoute } from 'vue-router'
import StringHelper from '@/models/utils/StringHelper'
import { useI18n } from 'vue-i18n'
import { WFTemplate } from '@/models/dao/types/workflow'
import loOrderBy from "lodash/orderBy"
import loGet from "lodash/get"
import loFind from "lodash/find"
import { accounts } from "@/data/blockchain";
import IntegerHelper from '@/models/utils/IntegerHelper'
// import { templatePayout, templateCreateGroup, templateAddMember } from "@/data/workflow";
import { getStartActivities, getEndActivities, getTransitions } from '@/models/workflow'
import { Wallet } from '@/models/nearBlockchain/types/blockchain'
import { useStore } from 'vuex'
import DaoMarket from '@/models/dao/DaoMarket'
import { Config } from '@/config'
import { MarketTemplate } from '@/models/dao/types/market'
import { Loader } from '@/loader'

export const useTemplateList = (loader: Ref<Loader>, config: Ref<Config>) => {
    const { t } = useI18n()

    const dataSource = ref<MarketTemplate[]>([])
    const dataResults = ref<MarketTemplate[]>([])

    const fetchProgress = ref(0)

    const filterSearch = ref('')
    const filterOrder = ref('most_popular')
    const filterOrderOptions = ref([
        { text: t('default.most_popular'), value: 'most_popular' },
        { text: t('default.installed'), value: 'installed' },
        { text: t('default.order_name_asc'), value: 'name_asc' },
        { text: t('default.order_name_desc'), value: 'name_desc' },
    ])

    const filter = (): void => {
        dataResults.value = dataSource.value
        // filter

        // searching
        const searchText = StringHelper.toSearch(filterSearch.value)
        if (searchText.length > 2) {
            dataResults.value = dataResults.value.filter((item: MarketTemplate) => item.search?.includes(searchText))
        }

        // order
        //console.log(filterOrder.value)
        switch (filterOrder.value) {
            case 'most_popular':
                dataResults.value = loOrderBy(dataResults.value, ['status', 'name'], ['asc', 'asc'])
                break;
            case 'installed':
                dataResults.value = loOrderBy(dataResults.value, ['status', 'name'], ['desc', 'asc'])
                break;
            case 'name_desc':
                dataResults.value = loOrderBy(dataResults.value, ['name'], ['desc'])
                break;
            case 'name_asc':
                dataResults.value = loOrderBy(dataResults.value, ['name'], ['asc'])
                break;
            default:
                break;
        }

        return;
    }

    const fetch = async (installedTemplateCodes: string[]) => {
        fetchProgress.value = IntegerHelper.getRandom(5, 15)
        const servicePool = await loader.value.get('dao/ServicePool')
        const daoMarket = new DaoMarket(config.value.near.wfProviderAccountId, servicePool.value);

        dataSource.value = await daoMarket.list(installedTemplateCodes, t) || []

        fetchProgress.value = 100
        filter()
    }

    return {
        dataSource, dataResults,
        fetchProgress, fetch,
        filterSearch, filterOrder, filterOrderOptions, filter,
    }
}

export const useTemplate = () => {
    const route = useRoute()
    const q_id = loGet(route, ['params', 'id'])
    const template = ref<WFTemplate | undefined>(undefined)

    const fetch = (): WFTemplate | undefined => {
        const template: WFTemplate | undefined = undefined
        // prototype
        switch (q_id) {
            case '1':
                //template = templatePayout
                break;
            case '2':
                //template = templateCreateGroup
                break;
            case '3':
                //template = templateAddMember
                break;
            default:
                break;
        }

        return template;
    }

    onMounted(() => {
        template.value = fetch()
    })

    const startActivities = computed(() => { return template.value ? getStartActivities(template.value) : [] })
    const endActivities = computed(() => { return template.value ? getEndActivities(template.value) : [] })
    const transactions = computed(() => { return template.value ? getTransitions(template.value) : [] })

    return {
        q_id, fetch, template, startActivities, endActivities, transactions
    }
}

export const useCreators = () => {
    const creator: Wallet | undefined = loFind(accounts, {code: 'near_dao'})
    const provider: Wallet | undefined = loFind(accounts, {code: 'market_near_dao'})

    return {
        creator, provider
    }
}