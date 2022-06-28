<template>
    <div class="row form-group mt-2">
        <div class="col-8 col-md-4">
            <InputNumber :labelName="t('amount')" id="amount" :addon="'Ⓝ'"/>
        </div>
    </div>
</template>

<script>
import InputNumber from '@/components/forms/InputNumber.vue'
import { toRefs } from '@vue/reactivity';
import { useForm } from 'vee-validate';
import { useI18n } from 'vue-i18n';
import { watch } from 'vue';
import loCloneDeep from "lodash/cloneDeep";

export default {
    components: {
        InputNumber,
    },
    emits: ['flush'],
    props: {
        schema: {
            type: Object,
            required: true,
        },
        tokenName: {
            type: String,
            required: true
        },
    },
    setup (props, {emit}) {
        const { schema } = toRefs(props)
        const { t } = useI18n()

        const { values } = useForm({ validationSchema: schema });

        watch(() => [loCloneDeep(values)], () => {
            emit('flush', values)
        })

        return { t, values }
    },
}
</script>