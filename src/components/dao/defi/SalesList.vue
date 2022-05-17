<template>
    <section v-if="salesList.length > 0">
        <div class="row">
            <div class="col-12 col-md-6 mb-4" v-for="sale in salesList" :key="sale.id">
                <Sale :sale="sale" :nearService="nearService"/>
            </div>
        </div>
    </section>
</template>

<script>
import { RefFinanceService } from '@/models/services/refFinanceService'
import { onMounted, toRefs, ref, inject } from "vue"
import Sale from "@/components/dao/defi/Sale.vue"
import { transformSale } from "@/models/sales"

export default {
    components: {
        Sale
    },
    props: {
        nearService: {
            type: Object,
            required: true,
        },
    },
    setup(props) {
        const { nearService } = toRefs(props)
        const dao = inject('dao')
        const refFinance = ref(null)
        const salesList = ref([])

        const refFinanceFetch = async () => {
            const pools = await nearService.value.getRefPools(dao.value.wallet)

            pools.forEach( async (poolId) => {
                const [pool, poolShares] = await Promise.all([
                    refFinance.value.getPool(poolId),
                    refFinance.value.getPoolShares(poolId, dao.value.wallet)
                ]).catch((e) => {
                    console.log(e);
                })
                salesList.value.push(transformSale('ref.finance', {id: poolId, shares: poolShares, ...pool}))
            })
        }

        onMounted(() => {
            nearService.value.getNear().account(dao.value.wallet).then( account => {
                refFinance.value = new RefFinanceService(account, 'pstu.testnet') // TODO: process.env.VUE_APP_REF_FINANCE_CONTRACT
                refFinanceFetch()
            })            
        })
        return {
             dao, refFinanceFetch, salesList, 
        }
    },
}
</script>