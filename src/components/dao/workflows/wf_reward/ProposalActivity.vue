<template>
      <InputString :labelName="t('default.name')" id="name" />

      <Select :labelName="t('default.group')" id="group_id" :options="groupsOptions" filter/>

      <Select :labelName="t('default.activity')" id="activity_ids" :options="activityOptions" filter multiple />

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
import InputString from '@/components/forms/InputString.vue'
import { useI18n } from 'vue-i18n';
import { useRewards } from '@/hooks/rewards'
import Decimal from 'decimal.js'
import NumberHelper from '@/models/utils/NumberHelper';
export default {
   components:{
      Select,
      DateTimepicker,
      InputNumber,
      InputString,
   },
   setup (_props, {emit}) {
      const dao = inject('dao')
      const loader = inject('loader')
      const {t} = useI18n()
      const {locksOptions} = useLocks(dao)
      const {groupsOptions} = useGroups(dao)
      const { createActivity, activityOptions } = useRewards(dao, loader)

      const schema = computed(() => {
         return {
            name: 'required',
            group_id: 'required',
            activity_ids: 'required',
            lock: 'required',
            near_amount: `strIsNumber`, // TODO: One of near_amount/token_amount is required
            token_amount: `strIsNumber`,
            start_at: '',
            ends: '',
         }
      });

      const { handleSubmit, errors, values } = useForm({ validationSchema: schema})

      const onSubmit = handleSubmit(async (values) => {
         emit('isValid', true)
         createActivity(
            values.name,
            values.group_id,
            values.near_amount ? new Decimal(values.near_amount).toNumber() : null,
            values.token_amount ? new Decimal(values.token_amount).toNumber() : null,
            values.activity_ids.split(',').map((id) => NumberHelper.parseNumber(id)),
            values.lock,
            values.start_at ? new Date(values.start_at) : new Date(),
            values.ends ? new Date(values.ends) : null
         )
      }, () => {
         emit('isValid', false)
         console.log(errors.value)
      });

      const click = () => {
         onSubmit()
      }

      return {
         t, groupsOptions, activityOptions, locksOptions, onSubmit, click, values,
      }
   }
}
</script>
