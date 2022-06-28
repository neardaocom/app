<template>
   <InputNumber :labelName="t('amount')" :balance="walletVotePowerOwned" :max="walletVotePowerOwned" id="amount" :addon="dao.treasury.token.meta.symbol"/>
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
      const wallet = inject('wallet')

      const { walletVotePowerOwned } = useStake(dao)
      const { runAction } = useStakeAction(dao, loader)

      const schema = computed(() => {
         return {
               amount: `required|strIsNumber|strNumMax:${walletVotePowerOwned.value}`
         }
      });

      const { handleSubmit, errors } = useForm({ validationSchema: schema});

      const onSubmit = handleSubmit(async (values) => {
            runAction('withdraw', { delegateId: wallet.value.accountId, amount: values.amount })
        }, () => {
                console.log(errors.value)
        });

      return {
         t,
         dao,
         walletVotePowerOwned,
         onSubmit
      }
   }
}
</script>
