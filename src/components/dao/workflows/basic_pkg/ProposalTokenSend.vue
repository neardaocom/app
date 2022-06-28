<template>
    <InputString :labelName="t('account_id')" id="account_id" :addon="`.${adminAccountPostfix}`"/>
    <InputNumber :labelName="t('amount')" id="amount" :balance="availableTokenAmount" :max="availableTokenAmount" :addon="tokenName"/>

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
    props:{
        tokenName: {
            type: String,
            required: true
        },
    },
    setup (_props, { emit }) {
        const {t} = useI18n()
        const dao = inject('dao')
        const loader = inject('loader')
        const config = inject('config')
        //const logger = inject('logger')
        //const notify = inject('notify')
        const {availableTokenAmount} = useAnalytics(dao, loader)
        const { proposalBasic } = useProposalBasic(loader, config)
        const { adminAccountPostfix } = useNear(config)
        const servicePool = loader.value.load('dao/ServicePool')

        const refWysiwyg = ref(null)

        const schema = computed(() => {
            return {
                account_id: `required|accountExists:${adminAccountPostfix.value},${servicePool.value}`,
                amount: `required|strIsNumber|strNumMin:0|strNumMax:${availableTokenAmount.value},${servicePool.value}`
            }
        });

        const { handleSubmit, errors } = useForm({ validationSchema: schema});

        const onSubmit = handleSubmit(async (values) => {
            emit('isValid', true)
            proposalBasic.value.tokenSend(dao.value, values.account_id + '.' + adminAccountPostfix.value, values.amount, refWysiwyg.value.getCode())
        }, () => {
            emit('isValid', false)
            console.log(errors.value)
        });
        

        return {
            t,
            adminAccountPostfix,
            onSubmit,
            refWysiwyg,
            availableTokenAmount
        }
    }
}
</script>