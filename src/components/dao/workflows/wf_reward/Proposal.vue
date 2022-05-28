<template>
   <div class="row">
      <Select :labelName="t('default.group')" id="group_id" :options="dao.staking.usersToDelegate" filter/>
      <div class="col-6">
         <InputNumber :labelName="t('default.frequency_days')" id="frequency_days" />
      </div>
      <div class="col-6">
         <InputNumber :labelName="t('default.frequency_hours')" id="frequency_hours" />
      </div>
      <Select :labelName="t('default.delegate_id')" id="lock" :options="dao.staking.usersToDelegate" filter/>
      <InputNumber :labelName="`NEAR ${t('default.amount')}`" id="near_amount" />
      <InputNumber :labelName="`Token ${t('default.amount')}`" id="token_amount" />

      <DateTimepicker :labelName="t('default.rewards_start_at')" id="start_at"/>
      <DateTimepicker :labelName="t('default.rewards_ends')" id="ends"/>
      
   </div>

</template>

<script>
import Select from '@/components/forms/Select.vue'
import DateTimepicker from '@/components/forms/DateTimepicker.vue'
import { computed } from '@vue/reactivity';
import { useForm } from 'vee-validate';
export default {
   components:{
      Select,
      DateTimepicker
   },
   setup () {
      

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
         //runAction('delegate', { delegateId: delegateId.accountId, amount: values.amount})
      }, () => {
         console.log(errors.value)
      });

      return {
         onSubmit
      }
   }
}
</script>
