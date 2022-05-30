<template>
    <div class="card text-start w-auto p-2">
        <div class="card-body">
            <div class="d-flex">
                <h6 class="text-muted">
                    {{t('default.governance')}}
                </h6>
                <Tooltip class="ms-auto" text="Tooltip" />
            </div>

            <div class="d-flex justify-content-between align-items-center mb-3">
               <div>
                  <div class="fw-bold">{{t('default.total_voting_power')}}</div>
                  <div class="mt-n1"><NumberFormatter class="me-0 fw-bold fs-5" :amount="allVotePower"/>{{ dao.treasury.token.meta.symbol }}</div>
               </div>
               <div>
                  <div class="fw-bold">{{t('default.my_vote_power')}}</div>
                  <div class="mt-n1"><NumberFormatter class="me-0 fw-bold fs-5" :amount="walletVotePower"/>{{ dao.treasury.token.meta.symbol }}</div>
                </div>
            </div>

            <hr/>
            <h6 class="text-muted">
                {{t('default.governance_token')}}
            </h6>
            <div class="d-flex justify-content-between align-items-center">
               <div>
                  <div class="fw-bold">{{t('default.owned')}}</div>
                  <div class="mt-n1"><NumberFormatter class="me-0 fw-bold fs-5" :amount="walletVotePowerOwned"/>{{ dao.treasury.token.meta.symbol }}</div>
               </div>
               <div>
                  <div class="fw-bold">{{t('default.from_delegators')}}</div>
                  <div class="mt-n1"><NumberFormatter class="me-0 fw-bold fs-5" :amount="walletVotePowerDelegators"/>{{ dao.treasury.token.meta.symbol }}</div>
                </div>
                <div>
                  <div class="fw-bold">{{t('default.delegated')}}</div>
                  <div class="mt-n1"><NumberFormatter class="me-0 fw-bold fs-5" :amount="walletVotePowerDelegated"/>{{ dao.treasury.token.meta.symbol }}</div>
                </div>
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
import NumberFormatter from '@/components/ui/NumberFormatter.vue'
import Tooltip from '@/components/ui//Tooltip.vue'
import { useStake } from '@/hooks/staking'

export default {
   components: {
      MDBBtn, 
      NumberFormatter,
      Tooltip
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
