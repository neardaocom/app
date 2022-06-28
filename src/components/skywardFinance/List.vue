<template>
    <section v-if="sales.length > 0">
        <div class="row">
            <div class="col-12 col-md-6 mb-4" v-for="auction in sales" :key="auction.id">
                <Auction :auction="auction" />
            </div>
        </div>
    </section>
</template>

<script>
import Auction from "@/components/skywardFinance/Auction.vue"
import { onMounted, onUnmounted, computed, ref, inject } from "vue"
import { useSkywardFinanace } from "@/hooks/auction"
import { useI18n } from 'vue-i18n'
import AuctionModel from '@/models/auction';

export default {
    components: {
        Auction
    },
    props: {
        scenario: {
            type: String,
            required: true,
            default: 'all'
        }
    },
    setup() {
        const dao = inject('dao')
        const loader = inject('loader')
        const { t } = useI18n()

        const account = loader.value.load('near/WalletAccount')
        const skywardSaleIds = ref(AuctionModel.getSkywardSaleIds(dao.value.storage))

        const {
            service: skywardService,
            salesIds: skywardSalesIds,
            list: skywardList,
            interval: skywardInterval,
            fetch: skywardFetch,
            filter: skywardFilter,
            reloadUp: skywardReloadUp,
            reloadDown: skywardReloadDown
        } = useSkywardFinanace(account.value, process.env.VUE_APP_SKYWARD_FINANCE_CONTRACT, skywardSaleIds.value)

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