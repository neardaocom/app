<template>
    <!-- title -->
    <InputString :labelName="t('default.title')" id="title"/>

    <!-- TokenId -->
    <InputString :labelName="t('default.token_sale_token_id')" id="tokenId" /> <!-- :addon="`.${accountPostfix}`" -->

    <!-- Amount -->
    <InputNumber :labelName=" t('default.amount')" id="amount" :addon="tokenName"/>

    <!-- From -->
    <div class="row">
        <div class="col-6">
            <Datepicker :labelName="t('default.token_sale_start_at')" id="startDate"/>
        </div>
        <div class="col-6">
            <Timepicker :labelName="t('default.time')" id="startTime"/>
        </div>
    </div>

    <!-- formDurationDays -->
    <div class="row mb-4">
        <MDBRange wrapperClass="col-md-6 col-9" :label="t('default.dao_vote_duration_days')" v-model="values.durationDays" :min="0" :max="31" />
        <label class="form-label col-md-6 col-3">{{ values.durationDays }}d</label>
    </div>
    <!-- formDurationHours -->
    <div class="row mb-4">
        <MDBRange wrapperClass="col-md-6 col-9" :label="t('default.dao_vote_duration_hours')" v-model="values.durationHours" :min="0" :max="23" />
        <label class="form-label col-md-6 col-3">{{ values.durationHours }}h</label>
    </div>
</template>

<script>
import InputString from '@/components/forms/InputString.vue'
import InputNumber from '@/components/forms/InputNumber.vue'
import Datepicker from '@/components/forms/Datepicker.vue'
import Timepicker from '@/components/forms/Timepicker.vue'
import {
    MDBRange,
} from "mdb-vue-ui-kit";
import { onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import { computed, toRefs } from '@vue/reactivity';
import { useForm } from 'vee-validate';
import { useNear } from "@/hooks/vuex";
import decimal from "decimal.js";
import moment from 'moment'
import { getAccountIdPostfix } from "@/services/nearService/utils"
import { dateToChain, durationToChain } from "@/utils/near";
import { generateStorageKey } from "@/models/proposal";

export default {
    components:{
        InputString, InputNumber, Datepicker, Timepicker, MDBRange,
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
        proposalCount: {
            type: Number,
            required: false
        },
    },
    setup (props) {
        const { t, d } = useI18n()

        const { contractId, template, proposalCount } = toRefs(props)

        const { nearService, factoryAccount } = useNear()

        const accountPostfix = computed(() => getAccountIdPostfix(factoryAccount.value))

        const formatDate = t('default._datepicker_format')
        const minDate = moment().startOf('day').add(1, 'M').toDate()
        const maxDate = moment().startOf('day').add(12, 'M').toDate()
        const schema = computed(() => {
            return {
                title: `required|min:5|max:40`, // 
                tokenId: `required|accountExists`, // TODO near root account
                amount: 'required|strIsNumber|strNumMin:1|strNumMax:1000000000', // 
                startDate: `required|minDate:${minDate.valueOf()},${formatDate}|maxDate:${maxDate.valueOf()},${formatDate}`, // 
                startTime: `required`,
                durationDays: 'required|strIsNumber|strNumMin:0|strNumMax:31', // 
                durationHours: 'required|strIsNumber|strNumMin:0|strNumMax:23', // 
            }
        });
        
        const { handleSubmit, errors, values } = useForm({ validationSchema: schema});

        onMounted(() => {
            values.tokenId = 'wrap.testnet' // TODO: Move to config
            values.startDate = d(moment().add(1, 'M').toDate())
            values.startTime = '12:00'
            values.durationDays = 1
            values.durationHours = 0
        })

        const onSubmit = handleSubmit(values => {
            console.log('Skyward submit')
            nearService.value.addProposal(
                contractId.value,
                template.value.id,
                template.value.settings[0].id,
                '',
                [
                    { String: values.tokenId },
                    { U128: decimal(values.amount).toFixed() },
                    { String: values.title },
                    { String: '' }, // url
                    { U64: dateToChain(moment(`${values.startDate} ${values.startTime}`, formatDate + ' hh:mm').toDate()).toString() + '000000000' },
                    { U64: durationToChain({days: values.durationDays, hours: values.durationHours}).toString() + '000000000' },
                ],
                'wf_skyward-' + generateStorageKey(proposalCount.value),
                1.0
            )
        }, () => {
            console.log(errors.value)
        });
        

        return {
            t,
            onSubmit,
            values,
            accountPostfix,
            minDate, maxDate,
        }
    }
}
</script>