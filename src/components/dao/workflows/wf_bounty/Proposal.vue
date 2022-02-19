<template>
    <!-- Amount -->
    <InputNumber :labelName=" t('default.amount')" id="amount" :addon="'Ⓝ'"/>
    <InputNumber :labelName=" t('default.deposit')" id="deposit" :addon="'Ⓝ'"/>
</template>

<script>
import InputNumber from '@/components/forms/InputNumber.vue'
import { useI18n } from 'vue-i18n';
import { computed, toRefs } from '@vue/reactivity';
import { useForm } from 'vee-validate';
import { useNear } from "@/hooks/vuex";
import decimal from "decimal.js";
import moment from 'moment'
import { nearToYocto } from '@/utils/near';

export default {
    components:{
        InputNumber,
    },
    props:{
        contractId: {
            type: String,
            required: false
        },
        template: {
            type: Object,
            required: true
        },
    },
    setup (props) {
        const {t} = useI18n()

        const { contractId, template } = toRefs(props)

        const { nearService } = useNear()

        const schema = computed(() => {
            return {
                amount: 'required|strIsNumber|strNumMin:1|strNumMax:1000000000.0',
                deposit: 'required|strIsNumber|strNumMin:0|strNumMax:1000000000.0',
            }
        });
        const { handleSubmit, errors } = useForm({ validationSchema: schema});

        const onSubmit = handleSubmit(values => {
            nearService.value.addProposal(
                contractId.value,
                template.value.id,
                template.value.settings[0].id,
                [
                    {U128: nearToYocto(decimal(values.amount).toFixed())},
                    {U128: nearToYocto(decimal(values.deposit).toFixed())},
                ],
                `wf_bounty-${moment().valueOf()}`,
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