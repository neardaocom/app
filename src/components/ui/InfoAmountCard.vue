<template>
   <MDBCard>
      <MDBCardBody>
         <h5 class="text-start"> {{header}} </h5>
         <div class="d-flex align-items-center">
            <Icon v-if="suffix==='NEAR'"  icon="NEAR" :size="38"/>
            <Icon v-else :icon="icon" :size="38"/>
            <InfoAmount :amount="amount" :suffix="suffix" suffixColor="secondary" class="fs-4 fw-800"/> 

            <!-- <span>
               <span class="" ><NumberFormatter :amount="amount"/></span><span class="h5 text-secondary ps-1">{{suffix}}</span>
            </span> -->
         </div>
      </MDBCardBody>
   </MDBCard>
</template>

<script>
import { MDBCard, MDBCardBody} from "mdb-vue-ui-kit";
import { useI18n } from 'vue-i18n';
// import NumberFormatter from "@/components/ui/NumberFormatter.vue"
import Icon from "@/components/ui/Icon.vue"
import InfoAmount from '@/components/ui/InfoAmount.vue'
export default {
   components: {
      MDBCard,
      MDBCardBody,
      Icon,
      // NumberFormatter,
      InfoAmount
    },
   props: {
      header:{
         type: String,
         required: false
      },
      icon:{
         type: String,
         required: false
      },
      amount:{
         type: [Object, Number, String],
         required: false
      },
      suffix:{
         type: String,
         required: true
      },
   },
   setup () {
      const {t} = useI18n()
      return {
         t
      }
   }
}
</script>