<template>
    <div class="card text-start w-auto p-2">
        <div class="card-body">
            <div class="d-flex">
                <h6 class="text-muted">
                    {{t('governance')}}
                </h6>
                <Tooltip class="ms-auto" :text="t('tooltip_dao_governance')" />
            </div>

            <div class="d-flex justify-content-between align-items-center mb-3">
               <div>
                  <div class="fw-bold">{{t('total_voting_power')}}</div>
                  <InfoAmount :amount="allVotePower" :suffix="dao.treasury.token.meta.symbol" amountColor="success" suffixColor="muted" class="fw-bold fs-5"/>
               </div>
               <div>
                  <div class="fw-bold">{{t('my_vote_power')}}</div>
                  <InfoAmount :amount="walletVotePower" :suffix="dao.treasury.token.meta.symbol" amountColor="success" suffixColor="muted" class="fw-bold fs-5"/>
                </div>
            </div>

            <hr/>
            <h6 class="text-muted">
                {{t('governance_token')}}
            </h6>
            <div class="d-flex justify-content-between align-items-center">
               <div>
                  <div class="fw-bold">{{t('owned')}}</div>
                  <InfoAmount :amount="walletVotePowerOwned" :suffix="dao.treasury.token.meta.symbol" amountColor="success" suffixColor="muted" class="fw-bold fs-5"/>                  
               </div>
               <div>
                  <div class="fw-bold">{{t('from_delegators')}}</div>
                  <InfoAmount :amount="walletVotePowerDelegators" :suffix="dao.treasury.token.meta.symbol" amountColor="success" suffixColor="muted" class="fw-bold fs-5"/>                  
                </div>
                <div>
                  <div class="fw-bold">{{t('delegated')}}</div>
                  <InfoAmount :amount="walletVotePowerDelegated" :suffix="dao.treasury.token.meta.symbol" amountColor="success" suffixColor="muted" class="fw-bold fs-5"/>                                  </div>
            </div>
           
            <div v-show="false" class="float-end mt-2">
                <MDBBtn size="sm" color="primary" rounded>...</MDBBtn>
            </div>
        </div>
    </div>
</template>

<script>
import { useI18n } from 'vue-i18n'
import { MDBBtn } from 'mdb-vue-ui-kit'
import { inject } from '@vue/runtime-core'
import Tooltip from '@/components/ui//Tooltip.vue'
import { useStake } from '@/hooks/staking'
import InfoAmount from '@/components/ui/InfoAmount.vue'

export default {
   components: {
      MDBBtn, 
      Tooltip,
      InfoAmount
   },
   setup() {
      const { t, n } = useI18n()
      const dao = inject('dao')

      const {
        allVotePower, walletVotePower, walletVotePowerPercent, walletVotePowerOwned, walletVotePowerDelegators, walletVotePowerDelegated
      } = useStake(dao)

      return {
         t, n, dao, allVotePower, walletVotePower, walletVotePowerPercent,
         walletVotePowerOwned, walletVotePowerDelegators, walletVotePowerDelegated,
      }
   }
}
</script>
