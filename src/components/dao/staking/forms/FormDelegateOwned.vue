<template>
   <InputString :labelName="t('default.delegate_id')" id="delegate_id" :addon="`.${accountPostfix}`"/>
   <InputNumber :labelName="t('default.amount')" :balance="dao.staking.userInfo.staked" :max="dao.staking.userInfo.staked" id="amount" :addon="dao.treasury.token.meta.short"/>
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
export default {
   components:{
      InputString,
      InputNumber
   },
   setup () {
      const {t} = useI18n()
      const dao = inject('dao')
      const config = inject('config')
      // const { adminAccountId } = useNear(config)
      const accountPostfix = computed(() => NearUtils.getAccountIdPostfix(config.value.near.adminAccountId))

      const schema = computed(() => {
         return {
               delegate_id: `required|accountExists:${accountPostfix.value}`,
               amount: `required|strIsNumber|strNumMax:${dao.value.staking.userInfo.staked}`
         }
      });

      const { handleSubmit, errors } = useForm({ validationSchema: schema});

      const onSubmit = handleSubmit(async () => {   
            
      }, () => {
         console.log(errors.value)
      });

      return {
         t,
         dao, 
         accountPostfix,
         onSubmit
      }
   }
}
</script>
