<template>
   <h6>{{`${t('account_id')}: ${accountId}`}}</h6>
   <InputNumber :labelName="t('amount')" :balance="amount" :max="amount" id="amount"/>
</template>

<script>
import { computed, toRefs } from '@vue/reactivity'
import { useI18n } from 'vue-i18n'
import { useForm } from 'vee-validate';
import InputNumber from '@/components/forms/InputNumber.vue'
import { inject } from '@vue/runtime-core';
import { useStakeAction } from '@/hooks/staking';
import { useNear } from '@/hooks/near'
export default {
   components:{
      InputNumber
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
      const wallet = inject('wallet')
      const { runAction } = useStakeAction(dao, loader)
      const { adminAccountPostfix } = useNear(config)

      const schema = computed(() => {
         return {
            amount: `required|strIsNumber|strNumMax:${amount.value}`
         }
      });
      const { handleSubmit, errors } = useForm({ validationSchema: schema});

      const onSubmit = handleSubmit(async (values) => {
            runAction('predelegate', { delegateFromId: accountId.value, delegateId: wallet.value?.accountId, amount: values.amount })
         }, () => {
            console.log(errors.value)
      });

      return {
         t, adminAccountPostfix, onSubmit
      }
   }
}
</script>
