<template>
   <MDBCard>
      <MDBCardBody>
         <div class="d-flex align-items-center mb-3">
            <div class="rounded-circle me-2 fw-bold d-flex align-items-center justify-content-center" style="width: 38px; height: 38px; box-shadow: 0px 3px 6px #0000001F;">
               <i class="bi bi-person" style="font-size: 1.2rem;"/>
            </div>
            <span class="fs-6 fw-800">{{ user.accountId }}
               <a class="" :href="walletUrl + '/accounts/' + user.accountId" target="_blank">
                  <i class="bi bi-box-arrow-up-right text-info ms-1" style="font-size: 0.7rem; vertical-align: 2px;"/>
               </a>
            </span>
            <MDBBtn v-if="user.accountId !== wallet?.accountId" @click="predelegate" class="ms-auto" color="primary" size="sm" rounded>{{t('delegate')}}</MDBBtn>
         </div>
         <div class="text-start small mb-3">
            {{ user.bio }}
         </div>
         <div class="d-flex">
            <MDBBadge color="primary" class="align-self-center"> {{user.tag}} </MDBBadge>
         </div>
         <div class="d-flex">
            <div>{{t('vote_amount')}} <NumberFormatter class="fw-bold ms-1" :amount="user.voteAmount"/></div>
            <div class="ms-auto"> {{t('votes_casted')}} <span class="fw-bold ms-2">{{ user.votesCasted }}</span></div>
         </div>
      </MDBCardBody>
   </MDBCard>

   <ModalProposal :show="modalProposal" @submit="submitModal" :submitText="submitText">
      <FormPredelegate ref="form"  :accountId="wallet.accountId" :delegateId="user.accountId" :amount="walletVotePowerOwned"/>
   </ModalProposal>
</template>

<script>
import { MDBCard, MDBCardBody, MDBBadge, MDBBtn} from "mdb-vue-ui-kit";
import { useI18n } from 'vue-i18n';
import { ref } from '@vue/reactivity';
import FormPredelegate from '@/components/dao/staking/forms/FormPredelegate.vue'
import { inject } from '@vue/runtime-core';
import { useStake } from '@/hooks/staking';
import ModalProposal from '@/components/proposal/Modal.vue'
import NumberFormatter from "@/components/ui/NumberFormatter.vue"
import { useNear } from '@/hooks/near';

export default {
  components: {
      MDBCard,
      MDBCardBody,
      MDBBadge,
      MDBBtn,
      ModalProposal,
      FormPredelegate,
      NumberFormatter
    },
   props: {
      user: {
         type: Object,
         required: true
      },
   },
      
   setup () {
      const {t} = useI18n()
      const dao = inject('dao')
      const wallet = inject('wallet')
      const config = inject('config')
      const { walletVotePowerOwned } = useStake(dao)
      const { walletUrl } = useNear(config)
      const form = ref(null)

      const submitText = ref('')
      const modalProposal = ref(0)

      const predelegate = () => {
         modalProposal.value += 1
         submitText.value = t('delegate')
      }

      const submitModal = () => {
         form.value.onSubmit()
      }

      return {
         t, walletUrl, walletVotePowerOwned, wallet, predelegate, submitModal,
         modalProposal, submitText, form
      }
   }
}
</script>