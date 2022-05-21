<template>
   <InputString :labelName="t('default.dao')" id="dao_id" :addon="`.${accountPostfix}`"/>
   <InputString :labelName="t('default.delegate_id')" id="delegate_id" :addon="`.${accountPostfix}`"/>
   <InputNumber :labelName="t('default.amount')" id="amount"/>
   <br/>
   <div class="text-start">
      <label for="description-id-input"  class="form-label">{{ t('default.description') }}</label>
   </div>
   <MDBWysiwyg :fixedOffsetTop="58" ref="refWysiwyg">
   </MDBWysiwyg>
</template>

<script>
import { computed, ref } from '@vue/reactivity'
import { useI18n } from 'vue-i18n'
import { useNear } from '@/hooks/vuex'
import NearUtils from '@/models/nearBlockchain/Utils';
import { useForm } from 'vee-validate';
import InputNumber from '@/components/forms/InputNumber.vue'
import InputString from '@/components/forms/InputString.vue'
export default {
   components:{
      InputString,
      InputNumber
   },
   setup () {
      const {t} = useI18n()
      const { factoryAccount } = useNear()
      const accountPostfix = computed(() => NearUtils.getAccountIdPostfix(factoryAccount.value))

      const refWysiwyg = ref(null)
      const schema = computed(() => {
         return {
               dao_id: `required|accountExists:${accountPostfix.value}`,
               delegate_id: `required|accountExists:${accountPostfix.value}`,
               amount: 'required|strIsNumber'
         }
      });
      const { handleSubmit, errors } = useForm({ validationSchema: schema});

      const onSubmit = handleSubmit(async () => {   
            
        }, () => {
                console.log(errors.value)
        });

      return {
         t, accountPostfix, refWysiwyg, onSubmit
      }
   }
}
</script>
