<template>
   <MDBCard>
      <MDBCardBody class="text-start">
         <div class="d-flex">
            <h6 class="text-muted">{{t('default.assets_to_withdraw')}}</h6>
            <Tooltip class="ms-auto" text="Tooltip" />
         </div>

         <template v-if="rewardsAssetsStats?.length > 0">
            <div v-for="rewardAsset in rewardsAssetsStats" :key="rewardAsset.id" class="d-flex align-items-center">
               <template v-if="rewardAsset.amount > 0.01">
                  <Icon v-if="rewardAsset.asset.type === 'near'"  icon="NEAR" :size="25"/>
                  <Icon v-else :icon="rewardAsset.asset.icon" :size="25"/>
                  <NumberFormatter :amount="rewardAsset.amount" class="text-success fw-bold fs-5"/><span class="fs-6 ps-1">{{ rewardAsset.asset.symbol }}</span>
               </template>
            </div>
         </template>
         <div v-else class="d-flex">
            <h5>{{ t('default.nothing_to_withdraw') }}</h5>
         </div>

      </MDBCardBody>
   </MDBCard>
</template>

<script>
import { MDBCard, MDBCardBody } from "mdb-vue-ui-kit";
import NumberFormatter from '@/components/ui/NumberFormatter.vue'
import { inject } from 'vue'
import { useI18n } from 'vue-i18n'
import Icon from "@/components/ui/Icon.vue"
import Tooltip from '@/components/ui//Tooltip.vue'
   export default {
      components:{
         MDBCard, MDBCardBody, Icon,
         NumberFormatter,
         Tooltip
      },
      setup(){
         const {t} = useI18n()
         const rewardsAssetsStats = inject('rewardsAssetsStats')
         return { t, rewardsAssetsStats }
      }
      
   }
</script>
