<template>
   <InputString :labelName="t('default.delegate_id')" id="delegate_id" :addon="`.${accountPostfix}`"/>
   <InputNumber :labelName="t('default.amount')" :balance="walletTokenFree" :max="walletTokenFree" id="amount" :addon="dao.treasury.token.meta.symbol"/>
</template>

<script>
import { computed } from '@vue/reactivity'
import { useI18n } from 'vue-i18n'
// import { useNear } from '@/hooks/vuex'
import NearUtils from '@/models/nearBlockchain/Utils';
import { useForm } from 'vee-validate';
import InputString from '@/components/forms/InputString.vue'
import InputNumber from '@/components/forms/InputNumber.vue'
import { inject } from '@vue/runtime-core';
import { useStake, useStakeAction } from '@/hooks/staking';
export default {
   components:{
      InputString,
      InputNumber
   },
   setup () {
      const {t} = useI18n()
      const config = inject('config')
      const dao = inject('dao')
      const loader = inject('loader')

      const { walletTokenFree } = useStake(dao)
      const { runAction } = useStakeAction(dao, loader)
      // const { adminAccountId } = useNear(config)
      const accountPostfix = computed(() => NearUtils.getAccountIdPostfix(config.value.near.adminAccountId))

      const schema = computed(() => {
         return {
               delegate_id: `required|accountExists:${accountPostfix.value}`,
               amount: `required|strIsNumber|strNumMax:${walletTokenFree.value}`
         }
      });

      const { handleSubmit, errors } = useForm({ validationSchema: schema});

      const onSubmit = handleSubmit(async (values) => {
            runAction('delegate', { delegateId: values.delegate_id + '.' + accountPostfix.value, amount: values.amount})
      }, () => {
         console.log(errors.value)
      });

      return {
         t,
         dao,
         walletTokenFree,
         accountPostfix,
         onSubmit
      }
   }
}
</script>
