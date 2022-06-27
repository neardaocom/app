<template>
    <div class="row form-group mt-2">
        <div class="col-8 col-md-4">
            <InputString :labelName="t('token_id')" id="tokenId" />
        </div>
    </div>
</template>

<script>
import InputString from '@/components/forms/InputString.vue'
import { toRefs } from '@vue/reactivity';
import { useForm } from 'vee-validate';
import { useI18n } from 'vue-i18n';
import { onMounted, watch } from 'vue';
import loCloneDeep from "lodash/cloneDeep";

export default {
    components: {
        InputString,
    },
    emits: ['flush'],
    props: {
        schema: {
            type: Object,
            required: true,
        },
    },
    setup (props, {emit}) {
        const { schema } = toRefs(props)
        const { t } = useI18n()

        const { values } = useForm({ validationSchema: schema });


        watch(() => [loCloneDeep(values)], () => {
            emit('flush', values)
        })

        onMounted(() => {
            values.tokenId = 'wrap.testnet' // TODO:
        })

        return { t, values }
    },
}
</script>