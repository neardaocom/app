<template>
<InputString :labelName=" t('default.name')" id="name"/>
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
import InputString from '@/components/forms/InputString.vue'
import { useI18n } from 'vue-i18n';
import { inject } from '@vue/runtime-core';
import { useForm } from 'vee-validate';
import { useTreasury } from '@/hooks/treasury';
import Decimal from 'decimal.js'
export default {
   components:{
      // MDBCollapse,
      // MDBSwitch,
      InputNumber,
      InputString
      
   },
   setup () {
      const dao = inject('dao')
      const loader = inject('loader')
      const {t} = useI18n()
      const nearCollapse = ref(false)
      const tokenCollapse = ref(false)

      const { createLockSimple } = useTreasury(dao, loader)

      const schema = computed(() => {
         return {
            name:'required',
            near_amount: `required|strIsNumber|strNumMax:${dao.value.treasury.near}`,
            token_amount: `required|strIsNumber|strNumMax:${dao.value.treasury.token.free}`
         }
      }); 

      const { handleSubmit, errors } = useForm({ validationSchema: schema})

      const onSubmit = handleSubmit(async (values) => {
         createLockSimple(values.name, values.near_amount ? new Decimal(values.near_amount).toNumber() : null  , values.token_amount ? new Decimal(values.token_amount).toNumber() : null)
      }, () => {
         console.log(errors.value)
      });
   
      return {
         t, dao, nearCollapse, tokenCollapse, onSubmit
      }
   }
}
</script>