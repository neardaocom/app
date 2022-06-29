<template>
    <!-- v-if="auctions.length > 0" -->
    <div class="col-12 col-md-4 mb-4" v-for="sale in auctions" :key="sale.id">
        <Widget :sale="sale" />
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