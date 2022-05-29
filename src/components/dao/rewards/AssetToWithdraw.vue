<template>
   <MDBCard>
      <MDBCardBody>
         <div class="d-flex">
            <div class="d-flex align-items-center">
               <slot name="icon">
                  <Icon v-if="suffix==='NEAR'"  icon="NEAR" :size="50"/>
                  <Icon v-else :icon="icon" :size="50"/>
               </slot>
               <div class="text-start">
                  <div class="fs-5 fw-bold me-1"> {{suffix}} </div>
                  <div class="text-muted small mt-n2">{{type}}</div>
               </div>
            </div>

            <div class="ms-auto text-end">
               <NumberFormatter :amount="withdrawAmount" class="fs-5 fw-bold"/><span class="fs-5 ps-1">{{suffix}}</span>
               <div class="fw-bold text-success">+<NumberFormatter :amount="countingAmount"/></div>
            </div>
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
   props: {
      type:{
         type: String,
         required: false
      },
      icon:{
         type: String,
         required: false
      },
      countingAmount:{
         type: [Number, String],
         required: true
      },
      withdrawAmount:{
         type: [Number, String],
         required: true
      },
      suffix:{
         type: String,
         required: true
      }
   },
   setup () {
      const {t} = useI18n()

      return {
         t, 
      }
   }
}
</script>
