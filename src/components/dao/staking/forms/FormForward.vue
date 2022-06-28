<template>
   <Select :labelName="t('delegate_id')" id="delegate_id" :options="dao.staking.usersToDelegate" filter/>
</template>

<script>
import { computed } from '@vue/reactivity'
import { useI18n } from 'vue-i18n'
import { useForm } from 'vee-validate';
import { useNear } from '@/hooks/near'
import Select from '@/components/forms/Select.vue'
import { inject } from '@vue/runtime-core';
import { useStakeAction } from '@/hooks/staking';
import loFind from 'lodash/find'
export default {
   components:{
      Select,
   },
   setup () {
      const {t} = useI18n()
      const config = inject('config')
      const dao = inject('dao')
      const loader = inject('loader')

      const { runAction } = useStakeAction(dao, loader)
      const { adminAccountPostfix } = useNear(config)


      const schema = computed(() => {
         return {
               delegate_id: `requifred`,
         }
      });
      const { handleSubmit, errors } = useForm({ validationSchema: schema});

      const onSubmit = handleSubmit(async (values) => {
         const delegateId = loFind(dao.value.staking.usersToDelegate, { 'value': values.delegate_id })
         runAction('forward', { delegateId: delegateId.accountId})
        }, () => {
                console.log(errors.value)
        });

      return {
         t, adminAccountPostfix, onSubmit, dao
      }
   }
}
</script>
