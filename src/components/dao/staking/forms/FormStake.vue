<template>
   <InputNumber :labelName="t('default.amount')" :balance="dao.staking.userInfo.staked" :max="dao.staking.userInfo.staked" id="amount" :addon="dao.treasury.token.meta.short"/>
</template>

<script>
import { computed } from '@vue/reactivity'
import { useI18n } from 'vue-i18n'
import { useForm } from 'vee-validate';
import InputNumber from '@/components/forms/InputNumber.vue'
import { inject } from '@vue/runtime-core';
export default {
   components:{
      InputNumber
   },
   setup () {
      const {t} = useI18n()
      const dao = inject('dao')

      const schema = computed(() => {
         return {
            amount: `required|strIsNumber|strNumMax:${dao.value.staking.userInfo.staked}`
         }
      });
      const { handleSubmit, errors } = useForm({ validationSchema: schema});

      const onSubmit = handleSubmit(async () => {   
            
         }, () => {
            console.log(errors.value)
         });

      return {
         t, onSubmit, dao
      }
   }
}
</script>
