<template>
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
import { useForm } from 'vee-validate';
export default {
   setup () {
      const {t} = useI18n()

      const refWysiwyg = ref(null)
      const schema = computed(() => {
         return {
               amount: 'required|strIsNumber'
         }
      });
      const { handleSubmit, errors } = useForm({ validationSchema: schema});

      const onSubmit = handleSubmit(async () => {   
            
        }, () => {
                console.log(errors.value)
        });

      return {
         t, refWysiwyg, onSubmit
      }
   }
}
</script>
