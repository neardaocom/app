<template>
   <div class="container mb-4">
      <div class="mb-7">
         <h5 class="text-start mb-4">{{t('default.total_dao_locked_value')}}</h5>
         <div class="d-flex flex-wrap gap-3">
           <InfoAmountCard v-for="(totalLock, index) in treasuryTotalLocked" :key="index"
               :amount="totalLock.amountLocked" :suffix="totalLock.assetSymbol" style="min-width: 283px" :icon="totalLock.assetIcon">
            </InfoAmountCard>     
         </div>
      </div>
      
      <div>
        <div class="d-flex mb-4">
          <h5 class="text-start me-auto">{{t('default.locks')}}</h5>
          <MDBBtn color="primary" size="sm" rounded class="align-self-center" style="width: 144px">{{t('default.payout')}}</MDBBtn>
        </div>
         
         <div class="row g-3">
            <div v-for="lock in dao.treasuryLocks" :key="lock.id" class="col-md-6">
               <TreasuryLock :lock="lock"/>
            </div>
         </div>
      </div>
   </div>

   <!-- <ModalTreasuryLocks/> -->
</template>

<script>
import { useI18n } from 'vue-i18n'
import InfoAmountCard from '@/components/ui/InfoAmountCard.vue'
import TreasuryLock from '@/components/dao/treasury/TreasuryLock.vue'
// import ModalTreasuryLocks from '@/pages/dao/modals/ModalTreasuryLocks.vue'
import { MDBBtn } from "mdb-vue-ui-kit";
import { inject } from '@vue/runtime-core';
import {useAnalytics} from '@/hooks/treasury'
export default {
   components: {
      InfoAmountCard,
      TreasuryLock,
      // ModalTreasuryLocks,
      MDBBtn 
   },
   setup () {
      const {t} = useI18n()
      const dao = inject('dao')
      const {treasuryTotalLocked} = useAnalytics(dao)

      return {
         t, dao, treasuryTotalLocked
      }
   }
}
</script>
