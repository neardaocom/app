<template>
<InputNumber :labelName="`NEAR ${t('default.amount')}`" :balance="dao.treasury.near" :max="dao.treasury.near" id="near_amount" addon="NEAR"/>
<InputNumber :labelName="`Token ${t('default.amount')}`" :balance="dao.treasury.token.free" :max="dao.treasury.token.free" id="token_amount" :addon="dao.treasury.token.meta.symbol"/>
   <!-- <div class="text-start">
      <MDBSwitch :label="`${t('default.lock')} NEAR`" v-model="nearCollapse"/>
      <MDBCollapse id="NearColllapse" v-model="nearCollapse">
         <div class="mt-3">
            <InputNumber :labelName="`NEAR ${t('default.amount')}`" :balance="dao.treasury.near" :max="dao.treasury.near" id="near_amount" addon="NEAR"/>
         </div>
      </MDBCollapse>

      <MDBSwitch :label="`${t('default.lock')} Token`" v-model="tokenCollapse"/>
      <MDBCollapse id="NearColllapse" v-model="tokenCollapse">
         <div class="mt-3">
            <InputNumber :labelName="`Token ${t('default.amount')}`" :balance="dao.treasury.token.free" :max="dao.treasury.token.free" id="token_amount" :addon="dao.treasury.token.meta.symbol"/>
         </div>
      </MDBCollapse>
   </div> -->
</template>

<script>
// import { MDBCollapse, MDBSwitch } from "mdb-vue-ui-kit";
import { computed, ref } from '@vue/reactivity';
import InputNumber from '@/components/forms/InputNumber.vue'
import { useI18n } from 'vue-i18n';
import { inject } from '@vue/runtime-core';
import { useForm } from 'vee-validate';
export default {
   components:{
      // MDBCollapse,
      // MDBSwitch,
      InputNumber,
      
   },
   setup () {
      const dao = inject('dao')
      const {t} = useI18n()
      const nearCollapse = ref(false)
      const tokenCollapse = ref(false)

      const schema = computed(() => {
         return {
            near_amount: `required|strIsNumber|strNumMax:${dao.value.treasury.near}`,
            token_amount: `required|strIsNumber|strNumMax:${dao.value.treasury.token.free}`
         }
      }); 

      const { handleSubmit, errors } = useForm({ validationSchema: schema})

      const onSubmit = handleSubmit(async () => {
         //runAction('delegate', { delegateId: delegateId.accountId, amount: values.amount})
      }, () => {
         console.log(errors.value)
      });
   
      return {
         t, dao, nearCollapse, tokenCollapse, onSubmit
      }
   }
}
</script>