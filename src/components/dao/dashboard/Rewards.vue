<template>
   <MDBCard>
      <MDBCardBody class="text-start">
         <div class="d-flex">
            <h6 class="text-muted">{{t('rewards_to_withdraw')}}</h6>
            <Tooltip class="ms-auto" :text="t('tooltip_dao_rewards_to_withdraw')" />
         </div>

         <template v-if="rewardsAssetsStats?.length > 0">
            <div v-for="rewardAsset in rewardsAssetsStats" :key="rewardAsset.id" class="d-flex align-items-center mt-2">
               <template v-if="rewardAsset.amount > 0.01">
                  <Icon v-if="rewardAsset.asset.type === 'near'"  icon="NEAR" :size="25"/>
                  <Icon v-else :icon="rewardAsset.asset.icon" :size="25"/>
                  <InfoAmount :amount="rewardAsset.amount" :suffix="rewardAsset.asset.symbol" amountColor="success" suffixNormal class="fw-bold fs-5"/>
               </template>
            </div>
         </template>
         <div v-else class="d-flex">
            <h5>{{ t('nothing_to_withdraw') }}</h5>
         </div>

      </MDBCardBody>
   </MDBCard>
</template>

<script>
import { MDBCard, MDBCardBody } from "mdb-vue-ui-kit";
import { inject } from 'vue'
import { useI18n } from 'vue-i18n'
import Icon from "@/components/ui/Icon.vue"
import Tooltip from '@/components/ui//Tooltip.vue'
import InfoAmount from '@/components/ui/InfoAmount.vue'
   export default {
      components:{
         MDBCard, MDBCardBody, Icon,
         Tooltip,
         InfoAmount
      },
      setup(){
         const {t} = useI18n()
         const rewardsAssetsStats = inject('rewardsAssetsStats')
         return { t, rewardsAssetsStats }
      }
      
   }
</script>
