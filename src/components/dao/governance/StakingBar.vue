<template>
  <MDBCard>
      <div class="row g-0 d-flex"> 
         <div class="col-md-4 d-flex align-items-center position-relative bg-gradient-120 text-white text-start p-3" style="border-radius: 0.5rem 0 0 0.5rem">
            <Tooltip class="position-absolute top-0 end-0 mt-1 me-2" color="white" text="Tooltip" />
            <div class="align-items-center">
               <div class="fw-600 mb-n2">{{t('total_amount')}} / {{t('staked')}}</div>
               <span class="fs-2 fw-800">
                  <NumberFormatter :amount="walletTokenAmount" />
                  /
                  <InfoAmount :amount="walletTokenStaked" :suffix="dao.treasury.token.meta.symbol" :suffixSize="50"/>    
               </span>
            </div>
         </div>

         <div class="col-md-6 d-flex align-items-center justify-content-evenly text-start  p-3">
            <div>
               <div class="fw-600 mb-n2">{{t('owned')}}</div>
               <InfoAmount :amount="walletVotePowerOwned" :suffix="dao.treasury.token.meta.symbol" suffixColor="primary" :suffixSize="50" class="fs-2 fw-800"/>   
            </div>
            <div>
               <div class="fw-600 mb-n2">{{t('from_delegators')}}</div>
               <InfoAmount :amount="walletVotePowerDelegators" :suffix="dao.treasury.token.meta.symbol" suffixColor="primary" :suffixSize="50" class="fs-2 fw-800"/>   
            </div>
            <div>
               <div class="fw-600 mb-n2">{{t('delegated')}}</div>
               <InfoAmount :amount="walletVotePowerDelegated" :suffix="dao.treasury.token.meta.symbol" suffixColor="primary" :suffixSize="50" class="fs-2 fw-800"/>   
            </div>
         </div>

         <div class="col-md-2 d-flex flex-column align-items-center justify-content-center p-2">
            <template v-if="canStake">
               <MDBBtn @click="stake" class="m-1" color="primary" size="sm" rounded style="width: 144px">{{t('stake')}}</MDBBtn>
               <MDBBtn @click="predelegate" :disabled="walletTokenStaked == 0" class="m-1" color="primary" size="sm" rounded style="width: 144px">{{t('delegate')}}</MDBBtn>
               <MDBBtn @click="withdraw" :disabled="walletTokenStaked == 0" class="m-1" color="primary" size="sm" rounded style="width: 144px">{{t('unstake')}}</MDBBtn>
            </template>
            <MDBBtn v-else class="m-1" color="primary" size="sm" rounded style="width: 144px" @click="runAction('register')">{{t('stake_register')}}</MDBBtn>
         </div>

         <ModalProposal :show="modalProposal" @submit="submitModal" :submitText="submitText">
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
import FormPredelegate from '@/components/dao/staking/forms/FormPredelegate.vue'
import { useStake, useStakeAction } from '@/hooks/staking';
import NumberFormatter from "@/components/ui/NumberFormatter.vue"
import Tooltip from '@/components/ui//Tooltip.vue'
import InfoAmount from '@/components/ui/InfoAmount.vue'

export default {
   components: {
      MDBCard,
      MDBBtn,
      FormWithdraw,
      FormStake,
      FormDelegateOwned,
      ModalProposal,
      NumberFormatter,
      Tooltip,
      InfoAmount,
      FormPredelegate
    },
    props:{
    },
   setup () {
      const {t} = useI18n()
      const dao = inject('dao')
      const loader = inject('loader')
      const wallet = inject('wallet')
      const {
         canStake, allVotePower, walletVotePower, walletVotePowerPercent, walletTokenAmount, walletTokenStaked, walletVotePowerOwned, walletVotePowerDelegators, walletVotePowerDelegated
      } = useStake(dao)
      const { runAction } = useStakeAction(dao, loader)

      const modalProposal = ref(0)
      const submitText = ref('')
      const modalMessage = ref(0)
      const formProps = ref({})
      const activeForm = ref('')
      const form = ref(null)

      const stake = () => {
         modalProposal.value += 1
         submitText.value = t('stake')
         activeForm.value = 'FormStake'
      }

      const withdraw = () => {
         modalProposal.value += 1
         submitText.value = t('withdraw')
         activeForm.value = 'FormWithdraw'
      }

      const delegate = () => {
         modalProposal.value += 1
         submitText.value = t('delegate')
         activeForm.value = 'FormDelegateOwned'
      }

      const predelegate = () => {
         modalProposal.value += 1
         formProps.value = {
            accountId:  wallet.value.accountId,
            amount: walletVotePowerOwned.value
         }
         submitText.value = t('delegate')
         activeForm.value = 'FormPredelegate'
      }

      const submitModal = () => {
         form.value.onSubmit()
      }


      return {
         t,
         dao,
         modalProposal,
         submitText,
         modalMessage,
         formProps,
         activeForm,
         stake,
         withdraw,
         delegate,
         predelegate,
         submitModal,
         form,
         canStake, allVotePower, walletVotePower, walletVotePowerPercent, walletTokenAmount, walletTokenStaked, walletVotePowerOwned, walletVotePowerDelegators, walletVotePowerDelegated,
         runAction
      }
   }
}
</script>
