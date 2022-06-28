<template>
   <InputString :labelName="t('dao')" id="dao_id" :addon="`.${adminAccountPostfix}`"/>

   <br/>
   <div class="text-start">
      <label for="description-id-input"  class="form-label">{{ t('description') }}</label>
   </div>
   <MDBWysiwyg :fixedOffsetTop="58" ref="refWysiwyg">
   </MDBWysiwyg>
</template>

<script>
import { computed, ref } from '@vue/reactivity'
import { useI18n } from 'vue-i18n'
import { useNear } from '@/hooks/near'
import { useForm } from 'vee-validate';
import InputString from '@/components/forms/InputString.vue'
import { inject } from '@vue/runtime-core';
export default {
   components:{
      InputString
   },
   setup () {
      const {t} = useI18n()
      const { adminAccountPostfix } = useNear()
      const loader = inject('loader')
      const servicePool = loader.value.load('dao/ServicePool')

      const refWysiwyg = ref(null)
      const schema = computed(() => {
         return {
               dao_id: `required|accountExists:${adminAccountPostfix.value},${servicePool.value}`,
         }
      });
      const { handleSubmit, errors } = useForm({ validationSchema: schema});

      const onSubmit = handleSubmit(async () => {   
            
        }, () => {
                console.log(errors.value)
        });

      return {
         t, adminAccountPostfix, refWysiwyg, onSubmit
      }
   }
}
</script>
