<template>
   <MDBCard>
      <MDBCardBody class="text-start">
         <h6 class="text-muted">{{t('default.incentives')}}</h6>
         <h5>{{t('default.to_withdraw')}}</h5>

         <div class="d-flex align-items-center">
            <Icon icon="NEAR" :size="25"/>
            <span class="fs-4 fw-bold"><NumberFormatter class="text-success" :amount="1000"/><span class="ps-1">NEAR</span></span>
         </div>

      </MDBCardBody>
   </MDBCard>
</template>

<script>
import { MDBCard, MDBCardBody } from "mdb-vue-ui-kit";
import NumberFormatter from '@/components/ui/NumberFormatter.vue'
import { useI18n } from 'vue-i18n'
import Icon from "@/components/ui/Icon.vue"
   export default {
      components:{
         MDBCard, MDBCardBody, Icon,
         NumberFormatter
      },
      setup(){
         const {t} = useI18n()
         return {t}
      }
      
   }
</script>
