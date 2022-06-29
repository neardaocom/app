<template>
    <section v-if="auctions.length > 0">
        <div class="row">
            <div class="col-12 col-md-6 mb-4" v-for="auction in auctions" :key="auction.id">
                <Auction :auction="auction" />
            </div>
        </div>
    </section>
</template>

<script>
import Auction from "@/components/skywardFinance/Auction.vue"
import { onMounted, onUnmounted, computed, toRefs, inject } from "vue"
import { useSkywardFinanace } from "@/hooks/auction"

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
    setup(props) {
        const { scenario } = toRefs(props)
        const dao = inject('dao')
        const loader = inject('loader')
        const config = inject('config')

        const {
            list, interval,
            fetch, filter, reloadUp, reloadDown
        } = useSkywardFinanace(dao, loader, config)

        fetch()

        const auctions = computed(() => filter(scenario.value))

        onMounted(() => {
            reloadUp(10_000)
        })

        onUnmounted(() => 
            reloadDown()
        )

        return {
            list, interval, auctions
        }
    },
}
</script>