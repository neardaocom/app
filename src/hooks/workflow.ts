import { ref, reactive } from 'vue'
import { toSearch } from '@/utils/string'
import { useI18n } from 'vue-i18n'
import { WFTemplate } from '@/types/workflow'
import _orderBy from "lodash/orderBy"
import { getRandom } from '@/utils/integer'
import { templatePayout, templateCreateGroup, templateAddMember } from "@/data/workflow";

export const useTemplateList = () => {
    const { t } = useI18n()
    const dataSource = ref<WFTemplate[]>([])
    const dataResults = ref<WFTemplate[]>([])

    const fetchProgress = ref(0)

    const filterSearch = ref('')
    const filterOrder = ref('name_asc')
    const filterOrderOptions = ref([
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
        switch (filterOrder.value) {
            case 'name_desc':
                dataResults.value = _orderBy(dataResults.value, ['name'], ['desc'])
                break;
            case 'name_asc':
                dataResults.value = _orderBy(dataResults.value, ['name'], ['asc'])
                break;
            default:
                break;
        }

        return;
    }

    const fetch = (): void => {
        fetchProgress.value = getRandom(5, 15)
        dataSource.value = [
            templatePayout, templateCreateGroup, templateAddMember
        ]
        fetchProgress.value = 100
    }

    return {
        dataSource, dataResults,
        fetchProgress, fetch,
        filterSearch, filterOrder, filterOrderOptions, filter,
    }
}