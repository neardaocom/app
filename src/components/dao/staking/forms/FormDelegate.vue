<template>
   <InputString :labelName="t('default.delegate_id')" id="delegate_id" :addon="`.${accountPostfix}`"/>
</template>

<script>
import { computed } from '@vue/reactivity'
import { useI18n } from 'vue-i18n'
// import { useNear } from '@/hooks/vuex'
import NearUtils from '@/models/nearBlockchain/Utils';
import { useForm } from 'vee-validate';
import InputString from '@/components/forms/InputString.vue'
import { inject } from '@vue/runtime-core';
export default {
   components:{
      InputString,
   },
   setup () {
      const {t} = useI18n()
      // const { adminAccountId } = useNear()
      const config = inject('config')
      const accountPostfix = computed(() => NearUtils.getAccountIdPostfix(config.value.near.adminAccountId))


      const schema = computed(() => {
         return {
               delegate_id: `required|accountExists:${accountPostfix.value}`,
         }
      });
      const { handleSubmit, errors } = useForm({ validationSchema: schema});

      const onSubmit = handleSubmit(async () => {   
            
        }, () => {
                console.log(errors.value)
        });

      return {
         t, accountPostfix, onSubmit
      }
   }
}
</script>
