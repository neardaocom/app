<template>
   <div class="container mb-4">
      <template v-if="rewardsClaimable?.length > 0">
         <div v-show="false" class="mb-7">
            <h5 class="text-start mb-4">{{t('default.wallet')}}</h5>
            <div class="row g-2">
               <div class="col-md-4">
                  <NextUnlock/>
               </div>
            </div>
         </div>

         <div class="mb-7 mt-4">
            <div class="d-flex mb-4">
               <h5 class="text-start me-auto">{{t('default.assets_to_withdraw')}}</h5>
               <MDBBtn v-show="false" color="primary" size="sm" rounded class="align-self-center" style="width: 144px">{{t('default.claim')}}</MDBBtn>
            </div>

            <div v-if="rewardsAssetsStats?.length > 0" class="row g-2">
               <div v-for="reward in rewardsAssetsStats" :key="reward.id" class="col-md-4">
                  <AssetToWithdraw :rewardAsset="reward" :withdraw="withdraw" :daoAccountId="dao.wallet"/>
               </div>
            </div>
            <div v-else class="row g-2">
               <div class="col-md-4">
                  <div class="skeleton rounded w-100" style="height: 142px"/>
               </div>
               <div class="col-md-4">
                  <div class="skeleton rounded w-100" style="height: 142px"/>
               </div>
            </div>
         </div>

         <div>
            <h5 class="text-start mb-4">{{t('default.incentives')}}</h5>
            <div class="row g-3">
               <div v-for="reward in rewardsClaimable" :key="reward.id" class="col-md-6">
                  <Incentives :reward="reward"/>
               </div>
            </div>
         </div>
      </template>
      
      <NoData v-else :text="t('default.no_claim_rewards')" hint="This is a hint" />
   </div>
</template>

<script>
import { useI18n } from 'vue-i18n'
import NextUnlock from '@/components/dao/rewards/NextUnlock.vue'
import AssetToWithdraw from '@/components/dao/rewards/AssetToWithdraw.vue'
import Incentives from '@/components/dao/rewards/Incentives.vue'
import { MDBBtn } from "mdb-vue-ui-kit";
import { inject } from '@vue/runtime-core'
import { useRewards } from '@/hooks/rewards'
import NoData from '@/components/ui/NoData.vue'
export default {
    components: {
      NextUnlock,
      AssetToWithdraw,
      Incentives,
      NoData,
      MDBBtn,
    },
   setup () {
      const {t} = useI18n()
      const dao = inject('dao')
      const loader = inject('loader')
      const rewardsClaimable = inject('rewardsClaimable')
      const rewardsAssetsStats = inject('rewardsAssetsStats')

      const { withdraw } = useRewards(dao, loader)

      return {
         t, withdraw, dao, rewardsClaimable, rewardsAssetsStats
      }
   }
}
</script>
