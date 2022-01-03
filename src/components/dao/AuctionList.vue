<template>
    <section v-if="activeList.length > 0">
        <div class="row">
            <div class="col-12 col-md-6 mb-4" v-for="auction in activeList" :key="auction.id">
                <Auction :auction="auction" />
            </div>
        </div>
    </section>
</template>

<script>
import Auction from "@/components/dao/Auction.vue"
import { SkywardFinance } from '@/services/skywardFinanceService'
import { onMounted, onUnmounted, toRefs, ref } from "vue"
import AuctionModel from "@/models/auction"
// import { testDataset } from "@/services/skywardFinanceService/types"

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
        },
        nearService: {
            type: Object,
            required: true,
        },
    },
    setup(props) {
        const { dao, nearService } = toRefs(props)

        const skywardFinance = ref(null)
        const auctionListInterval = ref(null)
        const auctionListIntervalStep = ref(10_000)
        const auctionList = ref([])
        const auctionListFetch = () => {
            skywardFinance.value.getSales('wrap.testnet').then( sales => {
                auctionList.value = sales.map(sale => AuctionModel.transform('skyward.finance', sale))
            })
            // auctionList.value = testDataset
        }

        onMounted(() => {
            // init skyward and get sales
            nearService.value.getNear().account(dao.value.wallet).then( account => {
                skywardFinance.value = new SkywardFinance(account, process.env.VUE_APP_SKYWARD_FINANCE_CONTRACT) // TODO: Move to config
                auctionListFetch()
            })
            // auctionListInterval.value = setInterval(auctionListFetch, auctionListIntervalStep.value)
        })

        onUnmounted(() => 
            clearInterval(auctionListInterval.value)
        )

        return {
            skywardFinance, auctionListInterval, auctionListIntervalStep, auctionList, auctionListFetch,
        }
    },
    computed: {
        activeList() {
            let list = []
            //console.log(this.auctionList.length)
            if (this.auctionList && this.auctionList.length > 0) {
                list = this.auctionList.filter( auction => auction.remaining_duration > 0 ).filter( auction => auction.out_tokens[0].token_account_id === this.dao.wallet ) // TODO: auction.remaining_duration > 0
            }
            return list
        }
    },
}
</script>