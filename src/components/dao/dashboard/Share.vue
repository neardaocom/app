<template>
    <div class="card text-start w-auto p-2" style="width: 18rem">
        <div class="card-body">
        <h5> <i class="bi bi-pie-chart text-secondary me-2"></i>{{ t("my_share") }}</h5>
        <h1>
            <NumberFormatter class="ms-4 mt-3" :amount="myTokensShare"/>%
        </h1>
        <h5 v-if="false && myTokensAmount" class="text-muted">
            <NumberFormatter :amount="myTokensAmount"/> <small class="text-muted">{{ dao.token_name }}</small>
        </h5>
        </div>
    </div>
</template>

<script>
import { useI18n } from 'vue-i18n'
import NumberFormatter from "@/components/ui/NumberFormatter.vue"
import { computed, toRefs, inject } from 'vue'
import Decimal from 'decimal.js'

export default {
    components: {
        NumberFormatter
    },
    props: {
        walletId: {
            type: String,
            required: false,
        },
    },
    setup(props) {
        const { walletId } = toRefs(props)
        const dao = inject('dao')
        const { t } = useI18n()

        const myTokensAmount = computed(() => dao.value.treasury.token.owned);
        const myTokensShare = computed(() => (dao.value.treasury.token.owned > 0) ? new Decimal(dao.value.treasury.token.owned || 0).dividedBy(dao.value.treasury.token.holded).times(100).round().toNumber() : null);

        return {
            dao, t, myTokensAmount, myTokensShare,
        }
    }
}
</script>