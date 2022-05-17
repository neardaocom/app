import { ref, computed } from 'vue'
import { useRouteFilter } from '@/hooks/router'
import StringHelper from '@/models/utils/StringHelper'
import { useI18n } from 'vue-i18n'
import loOrderBy from "lodash/orderBy"
import loFind from "lodash/find"
import { Order } from "@/models/search/types";
import OrderToOptionTransformer from "@/models/search/transformers/OrderToOption.transformer";

export const useList = (orderDefault: string, orders: Order[]) => {
    const { t } = useI18n()
    const { rSearch, rOrder } = useRouteFilter()

    const transformer = new OrderToOptionTransformer(t)

    const searchText = ref(rSearch.value ?? '')
    const searchOrder = ref(rOrder ?? orderDefault ?? '')
    const searchOrderOptions = ref(orders.map((item) => transformer.transform(item, {})))

    const search = (source: any[]): any[] => {
        let list: any[] = source
        // filter
        // TODO: Add filter

        // searching
        const searchTextToSearch = StringHelper.toSearch(searchText.value as string)
        if (searchTextToSearch.length > 2) {
            list = list.filter((item: any) => item.search.includes(searchTextToSearch))
        }

        // order
        const order: Order | undefined = loFind(orders, {code: searchOrder.value})
        if (order !== undefined) {
            list = loOrderBy(list, order.iteratees, order.orders)
        }

        return list
    }

    return {
        searchText, searchOrder, searchOrderOptions, search
    }
}