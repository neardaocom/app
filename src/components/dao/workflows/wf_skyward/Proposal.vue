<template>
    <!-- title -->
    <InputString :labelName="t('title')" id="title"/>

    <!-- TokenId -->
    <InputString :labelName="t('token_sale_token_id')" id="tokenId" /> <!-- :addon="`.${accountPostfix}`" -->

    <!-- Amount -->
    <InputNumber :labelName=" t('amount')" id="amount" :addon="tokenName"/>

    <!-- From -->
    <div class="row">
        <div class="col-6">
            <Datepicker :labelName="t('token_sale_start_at')" id="startDate"/>
        </div>
        <div class="col-6">
            <Timepicker :labelName="t('time')" id="startTime"/>
        </div>
    </div>

    <!-- formDurationDays -->
    <div class="row mb-4">
        <MDBRange wrapperClass="col-md-6 col-9" :label="t('dao_vote_duration_days')" v-model="values.durationDays" :min="0" :max="31" />
        <label class="form-label col-md-6 col-3">{{ values.durationDays }}d</label>
    </div>
    <!-- formDurationHours -->
    <div class="row mb-4">
        <MDBRange wrapperClass="col-md-6 col-9" :label="t('dao_vote_duration_hours')" v-model="values.durationHours" :min="0" :max="23" />
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
import { useNear } from "@/hooks/near";
import decimal from "decimal.js";
import moment from 'moment'
import NearUtils from '@/models/nearBlockchain/Utils';
import ProposalHelper from '@/models/dao/ProposalHelper';

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
    setup (props, {emit}) {
        const { t, d } = useI18n()

        const { contractId, template, proposalCount } = toRefs(props)

        const { nearService, adminAccountId } = useNear()

        const accountPostfix = computed(() => NearUtils.getAccountIdPostfix(adminAccountId.value))

        const formatDate = t('_datepicker_format')
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
            emit('isValid', true)
            nearService.value.addProposal(
                null,
                contractId.value,
                template.value.id,
                template.value.settings[0].id,
                '',
                [
                    { String: values.tokenId },
                    { U128: decimal(values.amount).toFixed() },
                    { String: values.title },
                    { String: '' }, // url
                    { U64: NearUtils.dateToChain(moment(`${values.startDate} ${values.startTime}`, formatDate + ' hh:mm').toDate()).toString() + '000000000' },
                    { U64: NearUtils.durationToChain({days: values.durationDays, hours: values.durationHours}).toString() + '000000000' },
                ],
                'wf_skyward-' + ProposalHelper.generateStorageKey(proposalCount.value),
                1.0
            )
        }, () => {
            emit('isValid', false)
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