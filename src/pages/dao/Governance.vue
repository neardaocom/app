<template>
   <div class="container mb-2">

      <div class="d-flex flex-wrap justify-content-evenly mt-5">
         <InfoItem :header="t('total_voting_power')" :amount="allVotePower" :suffix="dao.treasury.token.meta.symbol"/>
         <InfoItem :header="t('my_vote_power')" :amount="walletVotePower" :suffix="dao.treasury.token.meta.symbol">
            <div>
               <NumberFormatter :amount="walletVotePowerPercent" :digits="0"/><span class="ms-1">%</span>
            </div>
         </InfoItem>
      </div>

      <StakingBar class="mb-3"/>

      <div class="row g-2 mb-5">
         <div v-for="delegateUser in dao.staking.wallet?.delegations" :key="delegateUser.id" class="col-md-4">
            <DelegateUser :amount="delegateUser.voteAmount" :accountId="delegateUser.accountId" />
         </div>
      </div>

      <div v-if="dao.staking.wallet?.delegators.length > 0" class="mb-5">
         <div class="d-flex">
            <h5 class="text-start mb-3">{{t('delegators')}}</h5>
            <MDBBtn @click="forward" class="ms-auto m-1" color="primary" size="sm" rounded style="width: 144px">{{t('forward')}}</MDBBtn>
         </div>
         
         <div class="row g-2">
            <div v-for="delegator in dao.staking.wallet?.delegators" :key="delegator.id" class="col-md-4">
               <Delegator :accountId="delegator.accountId" :amount="delegator.voteAmount"/>
            </div>
         </div>
      </div>

      <div v-if="dao.staking.usersToDelegate.length > 0" class="mb-7">
         <h5 class="text-start mb-3">{{t('users_to_delegate')}}</h5>
         <div class="row g-2">
            <div v-for="user in dao.staking.usersToDelegate" :key="user.id" class="col-md-4">
               <UsersToDelegate :user="user" />
            </div>
         </div>
      </div>
   </div>
   <ModalProposal :show="modalProposal" @submit="submitModal" :submitText="t('forward')">
      <FormDelegate ref="form"/>
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
import FormDelegate from '@/components/dao/staking/forms/FormForward.vue'
import NumberFormatter from "@/components/ui/NumberFormatter.vue"
import { useStake } from '@/hooks/staking'

export default {
    components: {
      StakingBar,
      UsersToDelegate,
      InfoItem,
      DelegateUser,
      Delegator,
      ModalProposal,
      FormDelegate,
      MDBBtn,
      NumberFormatter
    },
   setup () {
      const {t} = useI18n()
      const dao = inject('dao')

      const { allVotePower, walletVotePower, walletVotePowerPercent } = useStake(dao)


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
         dao,
         allVotePower, walletVotePower, walletVotePowerPercent
      }
   }
}
</script>
