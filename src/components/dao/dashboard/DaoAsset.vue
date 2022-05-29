<template>
   <MDBCard>
      <MDBCardBody>
         <div class="d-flex">
            <div class="d-flex align-items-center">
               <Icon v-if="suffix==='NEAR'"  icon="NEAR" :size="50"/>
               <Icon v-else :icon="icon" :size="50"/>
               <div class="text-start">
                  <div class="fs-5 fw-bold me-1"> {{accountId}} </div>
                  <div class="text-muted small mt-n2">{{type}}</div>
               </div>
            </div>

            <div class="ms-auto text-end">
               <span class="fs-5 fw-bold"><NumberFormatter :amount="1000"/></span><span class="fs-5 ps-1">{{suffix}}</span>
               <div v-if="usd" class="text-end"><span class="fw-bold"><NumberFormatter :amount="1000"/></span><span class="ps-1">USD</span></div>
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
import Icon from '@/components/ui/Icon.vue'

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
      accountId:{
         type: String,
         required: false
      },
      amount:{
         type: [Number, String],
         required: true
      },
      suffix:{
         type: String,
         required: true
      },
      usd:{
         type: Boolean,
         required: false,
         default: false
      },
   },
   setup () {
      const {t} = useI18n()

      return {
         t, 
      }
   }
}
</script>
