<template>
   <MDBCard text="start">
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
         <div class="d-flex">
            <NumberFormatter class="fw-bold ms-2" :amount="amount"/>
            <MDBBtn @click="undelegate" class="ms-auto" color="primary" size="sm" rounded>{{t('default.undelegate')}}</MDBBtn>
         </div>
      </MDBCardBody>
   </MDBCard>

   <ModalProposal :show="modalProposal" @submit="submitModal" :submitText="t('default.undelegate')">
      <FormUndelegate ref="form" v-bind="formProps"/>
   </ModalProposal>
</template>

<script>
import { MDBCard, MDBCardBody, MDBBtn} from "mdb-vue-ui-kit";
import { useI18n } from 'vue-i18n';
import NumberFormatter from "@/components/ui/NumberFormatter.vue"
import ModalProposal from '@/components/proposal/Modal.vue'
import FormUndelegate from '@/components/dao/staking/forms/FormUndelegate.vue'
import { computed, ref, toRefs } from '@vue/reactivity';
import { useStore } from 'vuex';
export default {
   components: {
      MDBCard,
      MDBCardBody,
      MDBBtn,
      NumberFormatter,
      FormUndelegate,
      ModalProposal,
    },
   props: {
      accountId:{
         type: String,
         required: false
      },
      amount:{
         type: [Number, String],
         required: true
      },
   },
   setup (props) {
      const {accountId, amount} = toRefs(props)
      const {t} = useI18n()
      const store = useStore()
      const nearWalletUrl = computed(() => store.getters['near/getWalletUrl'])

      const modalProposal = ref(0)
      const form = ref(null)
       const formProps = ref({})

      const undelegate = () => {
         modalProposal.value += 1
         formProps.value = {
            accountId:  accountId.value,
            amount: amount
         }
      }

      const submitModal = () => {
         form.value.onSubmit()
      }

      return {
         t,
         nearWalletUrl,
         modalProposal,
         undelegate,
         submitModal,
         form,
         formProps
      }
   }
}
</script>