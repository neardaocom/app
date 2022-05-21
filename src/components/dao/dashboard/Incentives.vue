<template>
   <MDBCard>
      <MDBCardBody class="text-start">
         <h6 class="text-muted">{{t('default.incentives')}}</h6>
         <h5>{{t('default.to_withdraw')}}</h5>

         <div class="d-flex">
            <MDBBadge color="black" pill class="me-2 mt-2" style="padding: 0.3rem; width:25px; height:25px;"><img width="12" height="12" :src="'/img/near_logo.svg'" /></MDBBadge>
            <span class="fs-4 fw-bold"><NumberFormatter class="text-success" :amount="1000"/><span class="ps-1">NEAR</span></span>
         </div>

      </MDBCardBody>
   </MDBCard>
</template>

<script>
import { MDBCard, MDBCardBody, MDBBadge } from "mdb-vue-ui-kit";
import NumberFormatter from '@/components/ui/NumberFormatter.vue'
import { useI18n } from 'vue-i18n'
   export default {
      components:{
         MDBCard, MDBCardBody, MDBBadge,
         NumberFormatter
      },
      setup(){
         const {t} = useI18n()
         return {t}
      }
      
   }
</script>
