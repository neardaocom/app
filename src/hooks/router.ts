import { useRoute } from "vue-router";
import { computed } from "vue";
import loGet from "lodash/get";

export const useRouteFilter = () => {
    const route = useRoute()
    const rSearch = computed(() => loGet(route, ['query', 'search']))
    const rOrder = computed(() => loGet(route, ['query', 'order']))

    return {
        rSearch, rOrder
    }
}