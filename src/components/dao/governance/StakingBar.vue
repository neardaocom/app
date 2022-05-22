<template>
  <MDBCard>
       <div class="row g-0"> 
          <div class="col-md-2 bg-gradient-120 text-white d-flex align-items-center justify-content-center p-2" style="border-radius: 0.5rem 0 0 0.5rem">
              <span class="fw-bold"> {{dao.staking.userInfo.staked}}</span> <span class="ms-1">{{t('default.staked').toLowerCase()}} </span>
          </div>
          <div class="col-md-4 d-flex align-items-center justify-content-center p-2">
             <span class="fw-bold"> {{dao.staking.userInfo.delegated}}</span> <span class="text-muted ms-1">{{t('default.delegated').toLowerCase()}} </span>
          </div>
          <div class="col-md-6 d-flex flex-wrap align-items-center justify-content-center p-2">
             <MDBBtn @click="stake" class="m-1" color="primary" size="sm" rounded style="width: 144px">{{t('default.stake')}}</MDBBtn>
             <MDBBtn @click="withdraw" class="m-1" color="primary" size="sm" rounded  style="width: 144px">{{t('default.withdraw')}}</MDBBtn>
             <MDBBtn @click="delegate" color="primary" size="sm" rounded  style="width: 144px">{{t('default.delegate')}}</MDBBtn>
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
import FormDelegateOwned from '@/components/dao/staking/forms/FormDelegateOwned.vue'

export default {
   components: {
      MDBCard,
      MDBBtn,
      FormWithdraw,
      FormStake,
      FormDelegateOwned,
      ModalProposal
    },
    props:{
    },
   setup () {
      const {t} = useI18n()
      const dao = inject('dao')

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
         submitModal
      }
   }
}
</script>