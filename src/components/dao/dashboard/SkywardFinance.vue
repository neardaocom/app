<template>
    <!-- v-if="sales.length > 0" -->
    <div class="col-12 col-md-4 mb-4" v-for="sale in sales" :key="sale.id">
        <Widget :sale="sale" :dao="dao" />
    </div>
</template>

<script>
import Widget from "@/components/skywardFinance/Widget.vue"
import { onMounted, onUnmounted, toRefs, computed, inject } from "vue"
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
        salesIds: {
            type: Array,
            required: true,
        }
    },
    setup(props) {
        const { scenario, salesIds } = toRefs(props)
        const dao = inject('dao')
        const loader = inject('loader')

        const account = loader.value.load('near/WalletAccount')

        const {
            service: skywardService,
            salesIds: skywardSalesIds,
            list: skywardList,
            interval: skywardInterval,
            fetch: skywardFetch,
            filter: skywardFilter,
            reloadUp: skywardReloadUp,
            reloadDown: skywardReloadDown
        } = useSkywardFinanace(account.value, process.env.VUE_APP_SKYWARD_FINANCE_CONTRACT, salesIds.value) // TODO: 

        skywardFetch()

        const sales = computed(() => skywardFilter(scenario.value))

        onMounted(() => {
            skywardReloadUp(10_000)
        })

        onUnmounted(() => 
            skywardReloadDown()
        )

        return {
            dao, skywardService, skywardSalesIds, skywardList, skywardInterval, sales
        }
    },
}
</script>