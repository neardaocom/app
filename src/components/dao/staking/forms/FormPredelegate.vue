<template>
   <h6>{{`${t('default.account_id')}: ${accountId}`}}</h6>
   <Select :labelName="t('default.delegate_id')" id="delegate_id" :options="dao.staking.usersToDelegate" filter/>
   <InputNumber :labelName="t('default.amount')" :balance="amount" :max="amount" id="amount"/>
</template>

<script>
import { computed, toRefs } from '@vue/reactivity'
import { useI18n } from 'vue-i18n'
// import { useNear } from '@/hooks/vuex'
import NearUtils from '@/models/nearBlockchain/Utils';
import { useForm } from 'vee-validate';
import InputNumber from '@/components/forms/InputNumber.vue'
import Select from '@/components/forms/Select.vue'
import { inject } from '@vue/runtime-core';
import loFind from 'lodash/find'
import { useStakeAction } from '@/hooks/staking';
export default {
   components:{
      InputNumber, Select,
   },
   props: {
      accountId:{
         type: String,
         required: true
      },
      amount:{
         type: [Number, String],
         required: true
      }
   },
   setup (props) {
      const { accountId, amount } = toRefs(props)

      const {t} = useI18n()
      const config = inject('config')
      const dao = inject('dao')
      const loader = inject('loader')
      const { runAction } = useStakeAction(dao, loader)
      
      const accountPostfix = computed(() => NearUtils.getAccountIdPostfix(config.value.near.adminAccountId))

      const schema = computed(() => {
         return {
            delegate_id: `required`,
            amount: `required|strIsNumber|strNumMax:${amount.value}`
         }
      });
      const { handleSubmit, errors } = useForm({ validationSchema: schema});

      const onSubmit = handleSubmit(async (values) => {
         const delegateId = loFind(dao.value.staking.usersToDelegate, { 'value': values.delegate_id })
         runAction('predelegate', { delegateFromId: accountId.value, delegateId: delegateId.accountId, amount: values.amount })
      }, () => {
               console.log(errors.value)
      });

      return {
         t, accountPostfix, onSubmit, dao
      }
   }
}
</script>
