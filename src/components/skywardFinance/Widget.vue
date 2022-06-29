<template>
  <div class="card text-start w-auto p-2" style="width: 18rem">
    <div class="card-body">
      <h5 class="mb-1"><img class="me-1" :src="config.app.baseUrl + 'img/market/skywardFinance.jpg'" alt="" style="width: 24px; vertical-align: top"/> Skyward Finance</h5>
      <h2 class="ms-2">
        ≈ <NumberFormatter :amount="rate"/> <small class="text-muted">{{ ftMeta.short }}</small>
      </h2>
    </div>
  </div>
</template>

<script>
import NumberFormatter from "@/components/ui/NumberFormatter.vue";
import { useI18n } from 'vue-i18n';
import { toRefs, computed, unref, inject } from 'vue';
import AuctionHelper from "@/models/auction/Helper";
// import { getMeta } from "@/data/ft";

export default {
    components: {
        NumberFormatter,
    },
    props: {
        sale: {
            type: Object,
            required: true,
        }
    },
    setup(props) {
        const config = inject('config')
        const { sale } = toRefs(props)
        const { t } = useI18n()
        const rate = computed(() => AuctionHelper.rate(unref(sale)) ?? null )
        const rateToken = computed(() => AuctionHelper.rateToken(unref(sale)) ?? null)
        const ftMeta = {short: ''}// getMeta(sale.value.in_token.account_id) // TODO: Get metadata

        return {
            t, config, rate, rateToken, ftMeta
        }
    }
}
</script>
