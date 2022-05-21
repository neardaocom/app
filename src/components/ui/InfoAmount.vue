<template>
   <MDBCard>
      <MDBCardBody>
         <h5 class="text-start"> {{header}} </h5>
         <div class="d-flex align-items-center">

            <MDBBadge v-if="suffix==='NEAR'" color="black" pill class="me-2" style="padding: 0.6rem"><img width="17" height="17" :src="'/img/near_logo.svg'"/></MDBBadge>
            <div v-else-if="!icon" class="rounded-circle bg-black d-inline-block border border-secondary me-2" style="height:38px; width:38px"/>
            <img v-else :src="icon" class="img-fluid rounded-circle border border-secondary me-2" alt="" style="height:38px; width:38px"/>
            <span>
               <span class="fs-4 fw-800" ><NumberFormatter :amount="amount"/></span><span class="h5 text-secondary ps-1">{{suffix}}</span>
            </span>
         </div>
      </MDBCardBody>
   </MDBCard>
</template>

<script>
import { MDBCard, MDBCardBody, MDBBadge} from "mdb-vue-ui-kit";
import { useI18n } from 'vue-i18n';
import NumberFormatter from "@/components/ui/NumberFormatter.vue"
export default {
   components: {
      MDBCard,
      MDBCardBody,
      MDBBadge,
      NumberFormatter
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
         type: [Number, String],
         required: true
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