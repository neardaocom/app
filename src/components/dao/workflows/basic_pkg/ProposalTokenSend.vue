<template>
    <InputString :labelName="t('default.account_id')" id="account_id" :addon="`.${accountPostfix}`"/>
    <InputNumber :labelName="t('default.amount')" id="amount" :balance="availableTokenAmount" :max="availableTokenAmount" :addon="tokenName"/>

    <br/>
    <div class="text-start">
        <label for="description-id-input"  class="form-label">{{ t('default.description') }}</label>
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
import NearUtils from "@/models/nearBlockchain/Utils";
import { inject } from '@vue/runtime-core';
import { useAnalytics } from '@/hooks/treasury';
import { useProposalBasic } from '@/hooks/proposal';

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
    
        const accountPostfix = computed(() => NearUtils.getAccountIdPostfix(config.value.near.adminAccountId))

        const refWysiwyg = ref(null)

        const schema = computed(() => {
            return {
                account_id: `required|accountExists:${accountPostfix.value}`,
                amount: `required|strIsNumber|strNumMin:0|strNumMax:${availableTokenAmount.value}`
            }
        });

        const { handleSubmit, errors } = useForm({ validationSchema: schema});

        const onSubmit = handleSubmit(async (values) => {
            emit('isValid', true)
            proposalBasic.value.tokenSend(dao.value, values.account_id + '.' + accountPostfix.value, values.amount, refWysiwyg.value.getCode())
        }, () => {
            emit('isValid', false)
            console.log(errors.value)
        });
        

        return {
            t,
            accountPostfix,
            onSubmit,
            refWysiwyg,
            availableTokenAmount
        }
    }
}
</script>