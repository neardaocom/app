<template>
    <!-- Amount -->
    <InputNumber :labelName=" t('default.amount')" id="amount" :addon="tokenName"/>
</template>

<script>
import InputNumber from '@/components/forms/InputNumber.vue'
import { useI18n } from 'vue-i18n';
import { computed, toRefs } from '@vue/reactivity';
import { useForm } from 'vee-validate';
import { useNearService } from "@/hooks/vuex";
import decimal from "decimal.js";
import moment from 'moment'
//import loTemplate from "lodash/template";

export default {
    components:{
        InputNumber,
    },
    props:{
        contractId: {
            type: String,
            required: false
        },
        tokenName: {
            type: String,
            required: true
        },
        template: {
            type: Object,
            required: true
        },
    },
    setup (props) {
        const {t} = useI18n()

        const { contractId, template } = toRefs(props)

        const { nearService } = useNearService()

        const schema = computed(() => {
            return {
                amount: 'required|strIsNumber|strNumMin:1|strNumMax:1000000000.0',
            }
        });
        const { handleSubmit, errors } = useForm({ validationSchema: schema});

        const onSubmit = handleSubmit(values => {
            nearService.value.addProposal(
                contractId.value,
                template.value.id,
                template.value.settings[0].id,
                [
                    {String: 'demo-skyward.petrstudynka.testnet'}, // TODO: Move to template
                    {String: "\\\"AccountDeposit\\\""},
                    {U128: decimal(values.amount).toFixed()},
                ],
                `wf_near_send-${moment().valueOf()}`,
                1.0
            )
        }, () => {
            console.log(errors.value)
        });
        

        return {
            t,
            onSubmit
        }
    }
}
</script>