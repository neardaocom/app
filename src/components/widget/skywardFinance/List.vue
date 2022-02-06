<template>
    <section v-if="sales.length > 0">
        <h5 class="text-start">{{ t('default.ft_auction') }}</h5>
        <div class="row">
            <div class="col-12 col-md-6 mb-4" v-for="auction in sales" :key="auction.id">
                <Auction :auction="auction" />
            </div>
        </div>
    </section>
</template>

<script>
import Auction from "@/components/widget/skywardFinance/Auction.vue"
import { onMounted, onUnmounted, toRefs, computed } from "vue"
import { useStore } from "vuex"
// import { testDataset } from "@/services/skywardFinanceService/types"
import { useSkywardFinanace } from "@/hooks/auction"
import { useI18n } from 'vue-i18n'

export default {
    components: {
        Auction
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
        const { dao } = toRefs(props)

        const { t } = useI18n()

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
        } = useSkywardFinanace(account.value, 'supertest.testnet', dao.value.register.skywardFinance) // TODO: process.env (process.env.VUE_APP_SKYWARD_FINANCE_CONTRACT)

        skywardFetch()

        const sales = computed(() => skywardFilter('active'))

        onMounted(() => {
            skywardReloadUp(10_000)
        })

        onUnmounted(() => 
            skywardReloadDown()
        )

        return {
            t, skywardService, skywardSalesIds, skywardList, skywardInterval,
            sales,
        }
    },
}
</script>