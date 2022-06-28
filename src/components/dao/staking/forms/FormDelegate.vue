<template>
   <!-- <InputString :labelName="t('delegate_id')" id="delegate_id" :addon="`.${accountPostfix}`"/> -->
   <Select :labelName="t('delegate_id')" id="delegate_id" :options="dao.staking.usersToDelegate" filter/>
   <InputNumber :labelName="t('amount')" :balance="walletTokenFree" :max="walletTokenFree" id="amount" :addon="dao.treasury.token.meta.symbol"/>
</template>

<script>
import { computed } from '@vue/reactivity'
import { useI18n } from 'vue-i18n'
import { useNear } from '@/hooks/near'
import NearUtils from '@/models/nearBlockchain/Utils';
import { useForm } from 'vee-validate';
import Select from '@/components/forms/Select.vue'
import InputNumber from '@/components/forms/InputNumber.vue'
import { inject } from '@vue/runtime-core';
import { useStake, useStakeAction } from '@/hooks/staking';
import loFind from 'lodash/find'
export default {
   components:{
      Select,
      InputNumber
   },
   setup () {
      const {t} = useI18n()
      const config = inject('config')
      const dao = inject('dao')
      const loader = inject('loader')

      const { walletTokenFree } = useStake(dao)
      const { runAction } = useStakeAction(dao, loader)
      const { adminAccountId } = useNear(config)
      const accountPostfix = computed(() => NearUtils.getAccountIdPostfix(adminAccountId))

      const schema = computed(() => {
         return {
               delegate_id: `required`,
               amount: `required|strIsNumber|strNumMax:${walletTokenFree.value}`
         }
      });

      const { handleSubmit, errors } = useForm({ validationSchema: schema});

      const onSubmit = handleSubmit(async (values) => {
         const delegateId = loFind(dao.value.staking.usersToDelegate, { 'value': values.delegate_id })
         runAction('delegate', { delegateId: delegateId.accountId, amount: values.amount})
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
