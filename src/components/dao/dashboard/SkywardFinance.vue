<template>
    <section v-if="sales.length > 0">
        <div class="row">
            <div class="col-12 col-md-4 mb-4" v-for="sale in sales" :key="sale.id">
                <Widget :sale="sale" :dao="dao" />
            </div>
        </div>
    </section>
</template>

<script>
import Widget from "@/components/market/skywardFinance/Widget.vue"
import { onMounted, onUnmounted, toRefs, computed } from "vue"
import { useStore } from "vuex"
import { useSkywardFinanace } from "@/hooks/auction"

export default {
    components: {
        Widget
    },
    props: {
        scenario: {
            type: String,
            required: true,
            default: 'all'
        },
        dao: {
            type: Object,
            required: true,
        }
    },
    setup(props) {
        const { dao, scenario } = toRefs(props)

        const store = useStore()

        const account = computed(() => store.getters['near/getAccount'])

        const {
            service: skywardService,
            salesIds: skywardSalesIds,
            list: skywardList,
            interval: skywardInterval,
            fetch: skywardFetch,
            filter: skywardFilter,
            reloadUp: skywardReloadUp,
            reloadDown: skywardReloadDown
        } = useSkywardFinanace(account.value, process.env.VUE_APP_SKYWARD_FINANCE_CONTRACT, dao.value.auction.skyward_finance)

        skywardFetch()

        const sales = computed(() => skywardFilter(scenario.value))

        onMounted(() => {
            skywardReloadUp(10_000)
        })

        onUnmounted(() => 
            skywardReloadDown()
        )

        return {
            skywardService, skywardSalesIds, skywardList, skywardInterval,
            sales,
        }
    },
}
</script>