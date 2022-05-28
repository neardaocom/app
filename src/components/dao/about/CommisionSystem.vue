<template>
   <MDBCard class="text-start">
      <MDBCardBody>
         <div class="d-flex">
            <MDBCardTitle>
               <i class="bi bi-cash-coin text-gradient-180 me-1"/>
               {{t('default.commission_system')}}
            </MDBCardTitle>
            <Tooltip class="ms-auto" text="Tooltip" />
         </div>
         <h5>{{t('default.event')}}</h5>
         <h5>{{t('default.salary')}}</h5>
         <h5>{{t('default.activity')}}</h5>
      </MDBCardBody>
   </MDBCard>
</template>

<script>
import { useI18n } from 'vue-i18n'
import { MDBCard, MDBCardBody, MDBCardTitle } from "mdb-vue-ui-kit";
import Tooltip from '@/components/ui//Tooltip.vue'
export default {
   components:{
      MDBCard,
      MDBCardBody,
      MDBCardTitle,
      Tooltip
   },
   setup () {
      const {t} = useI18n()

      return {
         t
      }
   }
}
</script>
