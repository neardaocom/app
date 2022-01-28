<template>
    <div class="card text-start w-auto p-2" style="width: 18rem">
        <div class="card-body text-center">
        <h5 class="text-muted mb-0">{{ t("default.my_share") }}</h5>
        <h2 class="mb-0">
            <NumberFormatter :amount="myTokensShare"/><small class="text-muted">%</small>
        </h2>
        <h5 v-if="false && myTokensAmount" class="text-muted">
            <NumberFormatter :amount="myTokensAmount"/> <small class="text-muted">{{ dao.token_name }}</small>
        </h5>
        <h5 v-if="false && token_council_to_unlock != null && isCouncil === true" class="text-center text-muted">
            +<NumberFormatter :amount="token_council_to_unlock"/>
        </h5>
        </div>
    </div>
</template>

<script>
import { useI18n } from 'vue-i18n'
import NumberFormatter from "@/components/NumberFormatter.vue"
import { ref, computed, toRefs, onMounted, onUnmounted } from 'vue'
import Decimal from 'decimal.js'
import Analytics from "@/models/analytics"
import { nowToSeconds } from '@/utils/date';

export default {
    components: {
        NumberFormatter
    },
    props: {
        dao: {
            type: Object,
            required: true,
        },
        accountId: {
            type: String,
            required: false,
        },
    },
    setup(props) {
        const { dao, accountId } = toRefs(props)
        const { t } = useI18n()

        const myTokensAmount = computed(() => dao.value.token_holders[accountId.value]);
        const myTokensShare = computed(() => (dao.value.token_holded > 0) ? new Decimal(dao.value.token_holders[accountId.value] || 0).dividedBy(dao.value.token_holded).times(100).round().toNumber() : null);

        const isCouncil = computed(() => dao.value.groups.council.wallets.includes(accountId.value));

        // token unclock
        const token_council_interval = ref(null);
        const token_council_to_unlock = ref(null)
        const token_council_step = ref(Analytics.getInterval(Analytics.parseAlgorithm(dao.value.token_stats.council.algorithm)))
        const token_council_counter = () => {
        const unlocking = Analytics.computeUnlocking(
            Analytics.parseAlgorithm(dao.value.token_stats.council.algorithm),
            nowToSeconds(),
            dao.value.token_stats.council
        )
        //console.log(unlocking)
        token_council_to_unlock.value = new Decimal(unlocking).minus(dao.value.token_stats.council.distributed).div(dao.value.groups.council.wallets.length).round().toNumber()
        }
        if (dao.value.token_stats.council.algorithm !== "None") {
        token_council_to_unlock.value = new Decimal(Analytics.computeUnlocking(
            Analytics.parseAlgorithm(dao.value.token_stats.council.algorithm),
            nowToSeconds(),
            dao.value.token_stats.council
        )).minus(dao.value.token_stats.council.distributed).div(dao.value.groups.council.wallets.length).round().toNumber()
        }

        onMounted(() => {
            //console.log(token_council_step.value, token_public_step.value)
            token_council_interval.value = setInterval(token_council_counter, token_council_step.value)
        })

        onUnmounted(() => {
            clearInterval(token_council_interval.value)
            //console.log('unmounted')
        })

        return {
            t, myTokensAmount, myTokensShare, isCouncil,
            token_council_interval, token_council_to_unlock, token_council_step, token_council_counter,
        }
    }
}
</script>