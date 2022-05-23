<template>
   <div class="container mb-4">
      <div class="mb-7">
         <h5 class="text-start mb-4">{{t('default.available_assets')}}</h5>
         <div class="d-flex flex-wrap gap-3">
            <InfoAmountCard :amount="availableNearAmount" :suffix="treasuryNear.asset.symbol" style="min-width: 283px" :icon="treasuryNear.asset.icon"/>
            <InfoAmountCard :amount="availableTokenAmount" :suffix="treasuryNear.asset.symbol" style="min-width: 283px" :icon="treasuryNear.asset.icon"/>
            <InfoAmountCard v-for="(ftAsset, index) in treasuryFtAssets" :key="index"
               :amount="ftAsset.value.amount - ftAsset.value.amountLockedInLocks" :suffix="ftAsset.asset.symbol" style="min-width: 283px" :icon="ftAsset.asset.symbol">
            </InfoAmountCard>     
         </div>
      </div>
      
      <div>
         <h5 class="text-start me-auto">{{t('default.locks')}}</h5>
         <div class="row g-3">
            <div v-for="lock in treasuryLocks" :key="lock.id" class="col-md-6">
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
import { computed, inject } from '@vue/runtime-core';
import {useAnalytics} from '@/hooks/treasury'
export default {
   components: {
      InfoAmountCard,
      TreasuryLock,
      // ModalTreasuryLocks, 
   },
   setup () {
      const {t} = useI18n()
      const dao = inject('dao')
      const loader = inject('loader')
      const {treasuryLocks, treasuryTotalAssets, treasuryNear, treasuryToken, treasuryFtAssets} = useAnalytics(dao, loader)

      const availableNearAmount = computed(() => treasuryNear.value.amount - treasuryNear.value.amountLockedInLocks) 
      const availableTokenAmount = computed(() => treasuryToken.value.amount - treasuryToken.value.amountLockedInLocks) 

      return {
         t, dao, treasuryLocks, treasuryTotalAssets, treasuryNear, treasuryToken, treasuryFtAssets,
         availableNearAmount, availableTokenAmount
      }
   }
}
</script>
