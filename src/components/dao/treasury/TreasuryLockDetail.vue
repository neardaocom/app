<template>
   <MDBCard>
      <MDBCardBody>
         <div class="d-flex">
            <div class="d-flex align-items-center">
               <slot name="icon">
                  <Icon icon="NEAR" :size="38"/>
               </slot>
               <div class="text-start">
                  <div class="fs-5 fw-bold me-1"> NEAR </div>
                  <div class="text-muted small mt-n2">token</div>
               </div>
            </div>

            <div class="ms-auto text-end">
               <span class="fs-5 fw-bold"><NumberFormatter :amount="1000"/></span><span class="fs-5 ps-1">NEAR</span>
               <div class="text-end"><span class="fw-bold"><NumberFormatter :amount="1000"/></span><span class="ps-1">USD</span></div>
            </div>
         </div>
         <div class="text-end fw-bold mt-3">
            2022/05/08 - 10:20am UTC
         </div>
         
      </MDBCardBody>
   </MDBCard>
</template>

<script>
import { useI18n } from 'vue-i18n'
import {
   MDBCard,
   MDBCardBody
} from 'mdb-vue-ui-kit'
import NumberFormatter from "@/components/ui/NumberFormatter.vue"
import Icon from "@/components/ui/Icon.vue"
export default {
   components: {
      MDBCard,
      MDBCardBody,
      Icon,
      NumberFormatter
   },
   setup () {
      const {t} = useI18n()

      return {
         t, 
      }
   }
}
</script>
