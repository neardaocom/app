<template>
   <MDBCard>
      <MDBCardBody class="text-start">
         <div class="d-flex">
            <h5>{{t('next_unlock')}}</h5>
            <Tooltip class="ms-auto" text="Tooltip" />
         </div>
         <i class="bi bi-unlock text-gradient-180 me-2"/> <span class="fw-800"> 2022/06/01 - 12:00am</span>

         <div class="d-flex mt-2" style="opacity:0.5;">
            <div class="d-flex align-items-center">
               <Icon icon="NEAR" :size="50"/>
               <div class="text-start">
                  <div class="fs-5 fw-bold me-1"> NEAR </div>
                  <div class="text-muted small mt-n2">token</div>
               </div>
            </div>

            <div class="ms-auto text-end fs-5">
              <span class="fw-bold text-success"> + <NumberFormatter :amount="1000"/></span><span class="ps-1">NEAR</span>
            </div>
         </div>
      </MDBCardBody>
   </MDBCard>
</template>

<script>
import { MDBCard, MDBCardBody} from "mdb-vue-ui-kit";
import NumberFormatter from "@/components/ui/NumberFormatter.vue";
import { useI18n } from 'vue-i18n';
import Icon from '@/components/ui/Icon.vue'
import Tooltip from '@/components/ui//Tooltip.vue'
export default {
  components: {
      MDBCard,
      MDBCardBody,
      Icon,
      NumberFormatter,
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