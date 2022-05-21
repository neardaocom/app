<template>
  <MDBCard>
       <div class="row g-0"> 
          <div class="col-md-2 bg-gradient-120 text-white fw-bold d-flex align-items-center justify-content-center p-2" style="border-radius: 0.5rem 0 0 0.5rem">
              {{dao.treasury.token.meta.short}} Token
          </div>
          <div class="col-md-4 d-flex align-items-center justify-content-center p-2">
             <span class="fw-bold">jake.testnet </span> <span class="text-muted"> (delegated member) </span>
          </div>
          <div class="col-md-6 d-flex flex-wrap align-items-center justify-content-center p-2">
             <MDBBtn class="m-1" color="primary" size="sm" rounded style="width: 144px">{{t('default.stake')}}</MDBBtn>
             <MDBBtn class="m-1" color="primary" size="sm" rounded  style="width: 144px">{{t('default.forward')}}</MDBBtn>
             <MDBBtn color="primary" size="sm" rounded  style="width: 144px">{{t('default.undelegate')}}</MDBBtn>
          </div>
       </div>
  </MDBCard>
</template>

<script>
import { MDBCard, MDBBtn } from "mdb-vue-ui-kit";
import { useI18n } from 'vue-i18n';
import { inject } from '@vue/runtime-core';
export default {
   components: {
      MDBCard,
      MDBBtn
    },
    props:{
    },
   setup () {
      const {t} = useI18n()
      const dao = inject('dao')
      return {
         t,
         dao
      }
   }
}
</script>