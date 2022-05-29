<template>
      <Select :labelName="t('default.group')" id="group_id" :options="groupsOptions" filter/>
      <div class="row">
         <div class="col-6">
            <InputNumber :labelName="t('default.frequency_days')" id="frequency_days" />
         </div>
         <div class="col-6">
            <InputNumber :labelName="t('default.frequency_hours')" id="frequency_hours" />
         </div>
      </div>
      <Select :labelName="t('default.lock')" id="lock" :options="locksOptions" filter/>

      <InputNumber :labelName="`NEAR ${t('default.amount')}`" id="near_amount" />

      <InputNumber :labelName="`Token ${t('default.amount')}`" id="token_amount" />

      <DateTimepicker :labelName="t('default.rewards_start_at')" id="start_at"/>
      <DateTimepicker :labelName="t('default.rewards_ends')" id="ends"/>
</template>

<script>
import Select from '@/components/forms/Select.vue'
import DateTimepicker from '@/components/forms/DateTimepicker.vue'
import { computed } from '@vue/reactivity';
import { useForm } from 'vee-validate';
import { useGroups, useLocks } from '@/hooks/dao';
import { inject } from '@vue/runtime-core';
import InputNumber from '@/components/forms/InputNumber.vue'
import { useI18n } from 'vue-i18n';
// import DateHelper from '@/models/utils/DateHelper';
export default {
   components:{
      Select,
      DateTimepicker,
      InputNumber
   },
   setup () {
      const dao = inject('dao')
      const {t} = useI18n()
      const {locksOptions} = useLocks(dao)
      const {groupsOptions} = useGroups(dao)

      const schema = computed(() => {
         return {
            group_id: 'required',
            frequency_days: `required|strIsNumber`,
            frequency_hours: `required|strIsNumber`,
            lock: 'required',
            near_amount: `required|strIsNumber`,
            token_amount: `required|strIsNumber`,
            start_at: 'required',
            ends: 'required',

         }
      });

      const { handleSubmit, errors } = useForm({ validationSchema: schema})

      const onSubmit = handleSubmit(async () => {
         // const startAt = DateHelper.toSeconds(new Date(values.start_at)) 
         // const ends = DateHelper.toSeconds(new Date(values.ends)) 
         //runAction('delegate', { delegateId: delegateId.accountId, amount: values.amount})
      }, () => {
         console.log(errors.value)
      });

      const click = () => {
         onSubmit()

      }

      return {
         t, groupsOptions, locksOptions, onSubmit, click
      }
   }
}
</script>
