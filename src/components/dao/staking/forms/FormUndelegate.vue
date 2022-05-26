<template>
   <h6>{{`${t('default.account_id')}: ${accountId}`}}</h6>
   <InputNumber :labelName="t('default.amount')" :balance="amount" :max="amount" id="amount"/>
</template>

<script>
import { computed, toRefs } from '@vue/reactivity'
import { useI18n } from 'vue-i18n'
// import { useNear } from '@/hooks/vuex'
import NearUtils from '@/models/nearBlockchain/Utils';
import { useForm } from 'vee-validate';
import InputNumber from '@/components/forms/InputNumber.vue'
import { inject } from '@vue/runtime-core';
import { useStakeAction } from '@/hooks/staking';
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
      const { runAction } = useStakeAction(dao, loader)
      
      const accountPostfix = computed(() => NearUtils.getAccountIdPostfix(config.value.near.adminAccountId))

      const schema = computed(() => {
         return {
            amount: `required|strIsNumber|strNumMax:${amount.value}`
         }
      });
      const { handleSubmit, errors } = useForm({ validationSchema: schema});

      const onSubmit = handleSubmit(async (values) => {
            runAction('undelegate', { delegateId: accountId.value, amount: values.amount })
        }, () => {
                console.log(errors.value)
        });

      return {
         t, accountPostfix, onSubmit
      }
   }
}
</script>
