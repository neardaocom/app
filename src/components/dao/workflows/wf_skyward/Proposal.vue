<template>
    <!-- Amount -->
    <InputNumber :labelName=" t('default.amount')" id="amount" :addon="tokenName"/>

    <!-- title -->
    <InputString :labelName="t('default.title')" id="title"/>

    <!-- TokenId -->
    <InputString :labelName="t('default.token_sale_token_id')" id="token_id" :addon="`.${accountPostfix}`"/>

    <!-- Amount -->
    <InputNumber :labelName=" t('default.amount')" id="amount" :addon="{tokenName}"/>

    <!-- From -->
    <div class="row">
        <div class="col-6">
            <Datepicker :labelName="t('default.token_sale_start_at')" id="date_start"/>
        </div>
        <div class="col-6">
            <Timepicker :labelName="t('default.token_sale_start_at')" id="time_start"/>
        </div>
    </div>

    <!-- formDurationDays -->
    <div class="row mb-4">
        <MDBRange wrapperClass="col-md-6 col-9" :label="t('default.dao_vote_duration_days')" v-model="durationDays" :min="0" :max="31" />
        <label class="form-label col-md-6 col-3">{{ durationDays }}d</label>
    </div>
    <!-- formDurationHours -->
    <div class="row mb-4">
        <MDBRange wrapperClass="col-md-6 col-9" :label="t('default.dao_vote_duration_hours')" v-model="durationHours" :min="0" :max="23" />
        <label class="form-label col-md-6 col-3">{{ durationHours }}h</label>
    </div>
</template>

<script>
import InputNumber from '@/components/forms/InputNumber.vue'
import { useI18n } from 'vue-i18n';
import { computed, toRefs } from '@vue/reactivity';
import { useForm } from 'vee-validate';
import { useNear } from "@/hooks/vuex";
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

        const { nearService } = useNear()

        const formatDate = this.t('default._datepicker_format')
        const minDate = moment().startOf('day').add(1, 'M').toDate()
        const maxDate = moment().startOf('day').add(12, 'M').toDate()
        const schema = computed(() => {
            return {
                title: `required|min:5|max:40`,
                amount: 'required|strIsNumber|strNumMin:1|strNumMax:1000000000.0',
                token_id: `required|accountExists:${accountPostfix.value}`, // TODO near root account
                amount: 'required|strIsNumber|strNumMin:1|strNumMax:1000000000.0',
                date_start: `required|minDate:${minDate},${formatDate}|maxDate:${maxDate},${formatDate}`,
                time_start: `required`,
            }
        });
        
        const { handleSubmit, errors } = useForm({ validationSchema: schema});

        const onSubmit = handleSubmit(values => {
            nearService.value.addProposal(
                contractId.value,
                template.value.id,
                template.value.settings[0].id,
                [
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