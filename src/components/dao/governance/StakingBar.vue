<template>
  <MDBCard>
       <div class="row g-0"> 
          <div class="col-md-2 bg-gradient-120 text-white d-flex align-items-center justify-content-center p-2" style="border-radius: 0.5rem 0 0 0.5rem">
              <NumberFormatter :amount="walletTokenAmount" class="me-1 fw-bold"/>
              /
              <NumberFormatter :amount="walletTokenStaked" class="ms-1 fw-bold"/>
              <span class="ms-1">{{t('default.staked').toLowerCase()}}</span>
          </div>
          <div class="col-md-4 d-flex align-items-center justify-content-center p-2">
             <NumberFormatter :amount="walletVotePowerOwned" class="fw-bold ms-1" /><span class="text-muted ms-1">{{t('default.owned').toLowerCase()}}</span>
             <NumberFormatter :amount="walletVotePowerDelegators" class="fw-bold ms-3" /><span class="text-muted ms-1">{{t('default.from_delegators').toLowerCase()}}</span>
             <NumberFormatter :amount="walletVotePowerDelegated" class="fw-bold ms-3" /><span class="text-muted ms-1">{{t('default.delegated').toLowerCase()}}</span>
          </div>
          <div class="col-md-6 d-flex flex-wrap align-items-center justify-content-center p-2">
             <template v-if="canStake">
                 <MDBBtn @click="stake" class="m-1" color="primary" size="sm" rounded style="width: 144px">{{t('default.stake')}}</MDBBtn>
                 <MDBBtn @click="delegate" :disabled="walletTokenStaked == 0" color="primary" size="sm" rounded  style="width: 144px">{{t('default.delegate')}}</MDBBtn>
                 <MDBBtn @click="withdraw" :disabled="walletTokenStaked == 0" class="m-1" color="primary" size="sm" rounded  style="width: 144px">{{t('default.withdraw')}}</MDBBtn>
             </template>
             <MDBBtn v-else class="m-1" color="primary" size="sm" rounded style="width: 144px" @click="runAction('register')">{{t('default.stake_register')}}</MDBBtn>
          </div>

         <ModalProposal :title="modalTitle" :show="modalProposal" @vote="submitModal">
            <component ref="form" :is="activeForm" v-bind="formProps"></component>
         </ModalProposal>
       </div>
  </MDBCard>
</template>

<script>
import { MDBCard, MDBBtn } from "mdb-vue-ui-kit";
import { useI18n } from 'vue-i18n';
import { inject, ref } from '@vue/runtime-core';
import ModalProposal from '@/components/proposal/Modal.vue'
import FormStake from '@/components/dao/staking/forms/FormStake.vue'
import FormWithdraw from '@/components/dao/staking/forms/FormWithdraw.vue'
import FormDelegateOwned from '@/components/dao/staking/forms/FormDelegate.vue'
import { useStake, useStakeAction } from '@/hooks/staking';
import NumberFormatter from "@/components/ui/NumberFormatter.vue"
export default {
   components: {
      MDBCard,
      MDBBtn,
      FormWithdraw,
      FormStake,
      FormDelegateOwned,
      ModalProposal,
      NumberFormatter,
    },
    props:{
    },
   setup () {
      const {t} = useI18n()
      const dao = inject('dao')
      const loader = inject('loader')
      const {
         canStake, allVotePower, walletVotePower, walletVotePowerPercent, walletTokenAmount, walletTokenStaked, walletVotePowerOwned, walletVotePowerDelegators, walletVotePowerDelegated
      } = useStake(dao)
      const { runAction } = useStakeAction(dao, loader)

      const modalProposal = ref(0)
      const modalTitle = ref('')
      const modalMessage = ref(0)
      const formProps = ref({})
      const activeForm = ref('')
      const form = ref(null)

      const stake = () => {
         modalProposal.value += 1
         modalTitle.value = t('default.stake')
         activeForm.value = 'FormStake'
      }

      const withdraw = () => {
         modalProposal.value += 1
         modalTitle.value = t('default.withdraw')
         activeForm.value = 'FormWithdraw'
      }

      const delegate = () => {
         modalProposal.value += 1
         modalTitle.value = t('default.delegate')
         activeForm.value = 'FormDelegateOwned'
      }

      const submitModal = () => {
         form.value.onSubmit()
      }


      return {
         t,
         dao,
         modalProposal,
         modalTitle,
         modalMessage,
         formProps,
         activeForm,
         stake,
         withdraw,
         delegate,
         submitModal,
         form,
         canStake, allVotePower, walletVotePower, walletVotePowerPercent, walletTokenAmount, walletTokenStaked, walletVotePowerOwned, walletVotePowerDelegators, walletVotePowerDelegated,
         runAction
      }
   }
}
</script>
