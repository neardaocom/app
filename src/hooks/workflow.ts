import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { toSearch } from '@/utils/string'
import { useI18n } from 'vue-i18n'
import { WFTemplate } from '@/types/workflow'
import loOrderBy from "lodash/orderBy"
import loGet from "lodash/get"
import loFind from "lodash/find"
import loToString from "lodash/toString"
import { accounts } from "@/data/blockchain";
import { getRandom } from '@/utils/integer'
// import { templatePayout, templateCreateGroup, templateAddMember } from "@/data/workflow";
import { getStartActivities, getEndActivities, getTransitions } from '@/models/workflow'
import { Wallet } from '@/types/blockchain'
import { useStore } from 'vuex'

export const useTemplateList = () => {
    const { t } = useI18n()
    const store = useStore()
    const nearService = computed(() => store.getters['near/getService'])

    const dataSource = ref<WFTemplate[]>([])
    const dataResults = ref<WFTemplate[]>([])

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
        const searchText = toSearch(filterSearch.value)
        if (searchText.length > 2) {
            dataResults.value = dataResults.value.filter((item: WFTemplate) => item.search.includes(searchText))
        }

        // order
        console.log(filterOrder.value)
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

    const fetch = (installedTemplateCodes: string[]): void => {
        const list: WFTemplate[] = [];
        fetchProgress.value = getRandom(5, 15)

        nearService.value.providerList().then( r => {
            r.forEach(template => {
                list.push({
                    id: template.id,
                    version: loToString(template.version),
                    code: template.name,
                    name: t('default.wf_templ_' + template.name),
                    status: t('default.' + (installedTemplateCodes.includes(template.name) ? 'installed' : 'buy')),
                    //constants: [],
                    //attributes: [],
                    activities: [],
                    actions: [],
                    transactions: [],
                    startActionIds: [],
                    endActionIds: [],
                    search: [toSearch(t('default.wf_templ_' + template.name)), toSearch(t('default.workflow'))].join('-'),
                    settings: [],
                })
            });

            list.push({
                id: 0,
                version: '1',
                code: 'wf_ref_finance',
                name: t('default.wf_templ_wf_ref_finance'),
                status: t('default.in_progress'),
                //constants: [],
                //attributes: [],
                activities: [],
                actions: [],
                transactions: [],
                startActionIds: [],
                endActionIds: [],
                search: [toSearch(t('default.wf_templ_wf_ref_finanace')), toSearch(t('default.workflow'))].join('-'),
                settings: [],
            })

            fetchProgress.value = 100
            filter()
        })
        
        dataSource.value = list // [templatePayout, templateCreateGroup, templateAddMember]
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