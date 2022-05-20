<template>
   <MDBCard>
      <MDBCardBody class="text-start">
         <h5>{{t('default.next_unlock')}}</h5>
         <i class="bi bi-unlock text-gradient-180 me-2"/> <span class="fw-800"> 2022/06/01 - 12:00am</span>

         <div class="d-flex mt-2" style="opacity:0.5;">
            <div class="d-flex align-items-center">
               <slot name="icon">
                  <MDBBadge color="black" pill class="me-2" style="padding: 0.75rem;"><img width="25" height="25" :src="'/img/near_logo.svg'"/></MDBBadge>
               </slot>
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
import { MDBCard, MDBCardBody, MDBBadge} from "mdb-vue-ui-kit";
import NumberFormatter from "@/components/ui/NumberFormatter.vue";
import { useI18n } from 'vue-i18n';
export default {
  components: {
      MDBCard,
      MDBCardBody,
      MDBBadge,
      NumberFormatter
    },
      
   setup () {
      const {t} = useI18n()


      return {
         t
      }
   }
}
</script>