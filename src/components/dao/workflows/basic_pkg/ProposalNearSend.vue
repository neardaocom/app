<template>
    <InputString :labelName="t('account_id')" id="account_id" :addon="`.${adminAccountPostfix}`"/>
    <InputNumber :labelName="t('amount')" id="amount" :balance="availableNearAmount" :max="availableNearAmount" addon="Ⓝ"/>

    <br/>
    <div class="text-start">
        <label for="description-id-input"  class="form-label">{{ t('description') }}</label>
    </div>
    <MDBWysiwyg :fixedOffsetTop="58" ref="refWysiwyg">
    </MDBWysiwyg>
</template>

<script>
import InputNumber from '@/components/forms/InputNumber.vue'
import InputString from '@/components/forms/InputString.vue'
import { MDBWysiwyg } from "mdb-vue-wysiwyg-editor";
import { useI18n } from 'vue-i18n';
import { computed, ref } from '@vue/reactivity';
import { useForm } from 'vee-validate';
import { inject } from '@vue/runtime-core';
import { useAnalytics } from '@/hooks/treasury';
import { useProposalBasic } from '@/hooks/proposal';
import { useNear } from '@/hooks/near'

export default {
    components:{
        InputString,
        InputNumber,
        MDBWysiwyg,
    },
    setup (_props, { emit }) {
        const {t} = useI18n()
        const dao = inject('dao')
        const loader = inject('loader')
        const config = inject('config')
        const {availableNearAmount} = useAnalytics(dao, loader)
        const { proposalBasic } = useProposalBasic(loader, config)
        const { adminAccountPostfix } = useNear(config)

        const refWysiwyg = ref(null)

        const schema = computed(() => {
            return {
                account_id: `required|accountExists:${adminAccountPostfix.value}`,
                amount: `required|strIsNumber|strNumMin:0|strNumMax:${availableNearAmount.value}`
            }
        });

        const { handleSubmit, errors } = useForm({ validationSchema: schema});

        const onSubmit = handleSubmit(async (values) => {
            emit('isValid', true)
            proposalBasic.value.nearSend(dao.value, values.account_id + '.' + adminAccountPostfix.value, values.amount, refWysiwyg.value.getCode())
        }, () => {
            emit('isValid', false)
            console.log(errors.value)
        });
        

        return {
            t,
            dao,
            adminAccountPostfix,
            onSubmit,
            refWysiwyg,
            availableNearAmount
        }
    },
}
</script>
