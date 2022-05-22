<template>
   <MDBCard>
      <MDBCardBody>
         <NumberFormatter :amount="amount"/><span class="h5 text-secondary ps-1">{{accountId}}</span>
      </MDBCardBody>
   </MDBCard>
</template>

<script>
import { MDBCard, MDBCardBody} from "mdb-vue-ui-kit";
import { useI18n } from 'vue-i18n';
import NumberFormatter from "@/components/ui/NumberFormatter.vue"
export default {
   components: {
      MDBCard,
      MDBCardBody,
      NumberFormatter
    },
   props: {
      amount:{
         type: [Number, String],
         required: true
      },
      accountId:{
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