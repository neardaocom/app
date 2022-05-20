<template>
   <MDBCard>
      <MDBCardBody>
         <div class="d-flex align-items-center mb-3">
            <div class="rounded-circle me-2 fw-bold d-flex align-items-center justify-content-center" style="width: 38px; height: 38px; box-shadow: 0px 3px 6px #0000001F;">
               <i class="bi bi-person" style="font-size: 1.2rem;"/>
            </div>
            <span class="fs-6 fw-800">{{accountId}} 
               <a class="" :href="nearWalletUrl + '/accounts/' + accountId" target="_blank">
                  <i class="bi bi-box-arrow-up-right text-info ms-1" style="font-size: 0.7rem; vertical-align: 2px;"/>
               </a>
            </span>   
         </div>
         <div class="text-start small mb-3">
            {{bio}}
         </div>
         <div class="d-flex">
            <MDBBadge color="primary" class="me-auto align-self-center"> {{tag}} </MDBBadge>
            {{t('default.votes_casted')}} <span class="fw-bold ms-2">{{amount}}</span>
         </div>
      </MDBCardBody>
   </MDBCard>
</template>

<script>
import { MDBCard, MDBCardBody, MDBBadge} from "mdb-vue-ui-kit";
import { useI18n } from 'vue-i18n';
import { useStore } from 'vuex';
import { computed } from '@vue/reactivity';
export default {
  components: {
      MDBCard,
      MDBCardBody,
      MDBBadge
    },
   props: {
      accountId:{
         type: String,
         required: true
      },
      bio:{
         type: String,
         required: true
      },
      tag:{
         type: String,
         required: true
      },
      amount:{
         type: [Number, String],
         required: true
      }
   },
      
   setup () {
      const {t} = useI18n()
      const store = useStore()

      const nearWalletUrl = computed(() => store.getters['near/getWalletUrl'])

      return {
         t, nearWalletUrl
      }
   }
}
</script>