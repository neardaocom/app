<template>
    <section v-if="salesList.length > 0">
        <div class="row">
            <div class="col-12 col-md-6 mb-4" v-for="sale in salesList" :key="sale.id">
                <Sale :sale="sale" :dao="dao"/>
            </div>
        </div>
    </section>
</template>

<script>
import { RefFinanceService } from '@/services/refFinanceService'
import { onMounted, toRefs, ref } from "vue"
import Sale from "@/components/dao/Sale.vue"
import { transform } from "@/models/sales"

export default {
    components: {
        Sale
    },
    props: {
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

        const refFinance = ref(null)
        const salesList = ref([])

        const refFinanceFetch = (pools) => {
            pools.forEach( poolId => {
                refFinance.value.contract.get_pool({"pool_id": poolId}).then( pool => {
                    refFinance.value.contract.get_pool_shares({"pool_id": poolId, "account_id": dao.value.wallet}).then( shares => {
                        salesList.value.push(transform('ref.finance', {id: poolId, shares: shares, ...pool}))
                    })
                    
                })
            })
        }

        onMounted(() => {
            //get sales
            nearService.value.getNear().account(dao.value.wallet).then( account => {
                refFinance.value = new RefFinanceService(account, 'pstu.testnet') // TODO: Move to config

                nearService.value.getRefPools(dao.value.wallet).then( pools => refFinanceFetch(pools))
            })            
        })
        return {
             refFinanceFetch, salesList, 
        }
    },

    methods:{
    },
    computed: {
    },
}
</script>