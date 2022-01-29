<template>
    <div class="card text-start w-auto p-2" style="width: 18rem">
        <div class="card-body">
        <h5 class="text-center text-muted mb-0">{{ t("default.dao_funds") }}</h5>
        <h2 v-if="nearPrice" class="text-center">
            <NumberFormatter :amount="dao.treasury.near * nearPrice"/>&nbsp;<small class="text-muted">USD</small>
        </h2>
        <h2 v-else class="text-center">
            <NumberFormatter :amount="dao.treasury.near"/>&nbsp;<small class="text-muted">NEAR</small>
        </h2>
        <hr/>
        <h5 v-if="false" class="text-center text-muted mb-1">{{ t("default.treasury") }}</h5>
        <h5 v-if="nearPrice" class="text-center">
            <NumberFormatter :amount="dao.treasury.near"/>&nbsp;<small class="text-muted">NEAR</small>
        </h5>
        <h5 class="text-center">
            <NumberFormatter :amount="dao.token_stats.public.free"/>&nbsp;<small class="text-muted">{{ dao.token_name }}</small>
        </h5>
        </div>
    </div>
</template>

<script>
import { useI18n } from 'vue-i18n'
import NumberFormatter from "@/components/NumberFormatter.vue"

export default {
    components: {
        NumberFormatter
    },
    props: {
        dao: {
            type: Object,
            required: true,
        },
        nearPrice: {
            type: Number,
            required: false,
        }
    },
    setup() {
        const { t } = useI18n()

        return {
            t
        }
    }
}
</script>