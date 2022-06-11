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
import { useRewards } from '@/hooks/rewards'
import Decimal from 'decimal.js'
import NearUtils from '@/models/nearBlockchain/Utils';
export default {
   components:{
      Select,
      DateTimepicker,
      InputNumber
   },
   setup () {
      const dao = inject('dao')
      const loader = inject('loader')
      const {t} = useI18n()
      const {locksOptions} = useLocks(dao)
      const {groupsOptions} = useGroups(dao)
      const { createSalary } = useRewards(dao, loader)

      const schema = computed(() => {
         return {
            group_id: 'required',
            frequency_days: `required|strIsNumber`,
            frequency_hours: `required|strIsNumber`,
            lock: 'required',
            near_amount: `required|strIsNumber`,
            token_amount: `required|strIsNumber`,
            start_at: 'required',
            ends: '',

         }
      });

      const { handleSubmit, errors } = useForm({ validationSchema: schema})

      const onSubmit = handleSubmit(async (values) => {
         createSalary(
            values.group_id,
            new Decimal(values.near_amount).toNumber(), 
            new Decimal(values.token_amount).toNumber(), 
            NearUtils.durationToChain({days: values.frequency_days, hours: values.frequency_hours}),
            values.lock, 
            new Date(values.start_at), 
            values.ends ? new Date(values.ends) : null
         )
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
