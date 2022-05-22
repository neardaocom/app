<template>
   <div class="container mb-2">

      <div class="d-flex flex-wrap justify-content-evenly mt-5">
         <InfoItem :header="t('default.total_delegated')" :amount="10000" :suffix="dao.treasury.token.meta.short"/>
         <InfoItem :header="t('default.my_vote_power')" :amount="5" suffix="%">
            <div>
               {{1222}} / {{233}}<span class="ms-1">{{t('default.delegated').toLowerCase()}}</span>
            </div>
         </InfoItem>
      </div>

      <StakingBar class="mb-3"/>

      <div class="row g-1 mb-5">
         <div  v-for="delegateUser in dao.staking.userInfo.delegatedAmounts" :key="delegateUser.id" class="col-md-3">
            <DelegateUser :amount="delegateUser.amount" :accountId="delegateUser.accountId" />
         </div>
      </div>

      <div class="mb-5">
         <div class="d-flex">
            <h5 class="text-start mb-3">{{t('default.delegators')}}</h5>
            <MDBBtn @click="forward" class="ms-auto m-1" color="primary" size="sm" rounded style="width: 144px">{{t('default.forward')}}</MDBBtn>
         </div>
         
         <div class="row g-2">
            <div v-for="delegator in dao.staking.delegators" :key="delegator.id" class="col-md-4">
               <Delegator :accountId="delegator.accountId" :amount="delegator.amount"/>
            </div>
         </div>
      </div>

      <div class="mb-7">
         <h5 class="text-start mb-3">{{t('default.users_to_delegate')}}</h5>
         <div class="row g-2">
            <div v-for="user in dao.staking.usersToDelegate" :key="user.id" class="col-md-4">
               <UsersToDelegate :accountId="user.accountId" :bio="user.bio" :tag="user.tag" :amount="user.votesCasted"/>
            </div>
         </div>
      </div>
   </div>
   <ModalProposal :title="t('default.forward')" :show="modalProposal" @vote="submitModal">
      <FormDelegate ref="form" v-bind="formProps"/>
   </ModalProposal>
</template>

<script>
import { useI18n } from 'vue-i18n'
import StakingBar from '@/components/dao/governance/StakingBar.vue'
import UsersToDelegate from '@/components/dao/governance/UserToDelegate.vue'
import InfoItem from '@/components/ui/InfoItem.vue'
import { inject, ref } from '@vue/runtime-core'
import DelegateUser from '@/components/dao/governance/DelegateUser.vue'
import { MDBBtn} from "mdb-vue-ui-kit";
import Delegator from '@/components/dao/governance/Delegator.vue'
import ModalProposal from '@/components/proposal/Modal.vue'
import FormDelegate from '@/components/dao/staking/forms/FormDelegate.vue'

export default {
    components: {
      StakingBar,
      UsersToDelegate,
      InfoItem,
      DelegateUser,
      Delegator,
      ModalProposal,
      FormDelegate,
      MDBBtn
      
    },
   setup () {
      const {t} = useI18n()
      const dao = inject('dao')

      const modalProposal = ref(0)
      const form = ref(null)

      const forward = () => {
         modalProposal.value += 1
      }

      const submitModal = () => {
         form.value.onSubmit()
      }

      return {
         t,
         forward,
         submitModal,
         modalProposal,
         form,
         dao
      }
   }
}
</script>
