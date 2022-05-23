<template>
   <MDBCard text="start">
      <MDBCardBody>
         <h6>{{accountId}}</h6>
         <div class="d-flex">
            <NumberFormatter class="fw-bold" :amount="amount"/>
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
import { ref, toRefs } from '@vue/reactivity';
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
         modalProposal,
         undelegate,
         submitModal,
         form,
         formProps
      }
   }
}
</script>