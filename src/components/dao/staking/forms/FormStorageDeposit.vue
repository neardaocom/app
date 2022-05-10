<template>
   <InputString :labelName="t('default.account_id')" id="account_id" :addon="`.${accountPostfix}`"/>
   <MDBSwitch :label="t('default.registration_only')" v-model="registrationOnly"/>
   <InputNumber :labelName="t('default.amount')" id="amount" addon="Ⓝ"/>

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
export default {
   setup () {
      const {t} = useI18n()
      const { factoryAccount } = useNear()
      const accountPostfix = computed(() => NearUtils.getAccountIdPostfix(factoryAccount.value))

      const registrationOnly = ref(true)
      const refWysiwyg = ref(null)
      const schema = computed(() => {
         return {
               account_id: `required|accountExists:${accountPostfix.value}`,
               amount: 'required|strIsNumber'
         }
      });
      const { handleSubmit, errors } = useForm({ validationSchema: schema});

      const onSubmit = handleSubmit(async () => {   
            
        }, () => {
                console.log(errors.value)
        });

      return {
         t, accountPostfix, registrationOnly, refWysiwyg, onSubmit
      }
   }
}
</script>
