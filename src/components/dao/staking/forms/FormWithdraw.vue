<template>
   <InputNumber :labelName="t('default.amount')" :balance="walletTokenFree" :max="walletTokenFree" id="amount" :addon="dao.treasury.token.meta.symbol"/>
</template>

<script>
import { computed } from '@vue/reactivity'
import { useI18n } from 'vue-i18n'
import { useForm } from 'vee-validate';
import InputNumber from '@/components/forms/InputNumber.vue'
import { inject } from '@vue/runtime-core';
import { useStake, useStakeAction } from '@/hooks/staking';
export default {
   components:{
      InputNumber
   },
   setup () {
      const {t} = useI18n()
      const dao = inject('dao')
      const loader = inject('loader')

      const { walletTokenFree } = useStake(dao)
      const { runAction } = useStakeAction(dao, loader)

      const schema = computed(() => {
         return {
               amount: `required|strIsNumber|strNumMax:${walletTokenFree.value}`
         }
      });

      const { handleSubmit, errors } = useForm({ validationSchema: schema});

      const onSubmit = handleSubmit(async (values) => {
            runAction('withdraw', { amount: values.amount })
        }, () => {
                console.log(errors.value)
        });

      return {
         t,
         dao,
         walletTokenFree,
         onSubmit
      }
   }
}
</script>
