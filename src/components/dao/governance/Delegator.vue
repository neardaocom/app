<template>
   <MDBCard>
      <MDBCardBody>
         <div class="d-flex align-items-center mb-3">
            <div class="rounded-circle me-2 fw-bold d-flex align-items-center justify-content-center" style="width: 38px; height: 38px; box-shadow: 0px 3px 6px #0000001F;">
               <i class="bi bi-person fs-4"/>
            </div>
            <span class="fs-6 fw-800">{{accountId}} 
               <a class="" :href="nearWalletUrl + '/accounts/' + accountId" target="_blank">
                  <i class="bi bi-box-arrow-up-right text-info ms-1" style="font-size: 0.7rem; vertical-align: 2px;"/>
               </a>
            </span>   
            <div class="ms-auto text-success">
               <i class="bi bi-arrow-right fs-5"/>
               <i class="bi bi-person fs-4"/>
            </div>
         </div>
         <div class="text-start">
            {{t('default.delegated')}}
            <NumberFormatter class="fw-bold ms-1" :amount="amount"/>
         </div>
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