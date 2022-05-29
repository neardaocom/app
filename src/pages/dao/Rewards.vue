<template>
   <div class="container mb-4">
      <div class="mb-7">
         <h5 class="text-start mb-4">{{t('default.wallet')}}</h5>
         <div class="row g-2">
            <div class="col-md-4">
               <NextUnlock/>
            </div>
         </div>
      </div>

      <div class="mb-7">
         <div class="d-flex mb-4">
            <h5 class="text-start me-auto">{{t('default.assets_to_withdraw')}}</h5>
            <MDBBtn color="primary" size="sm" rounded class="align-self-center" style="width: 144px">{{t('default.withdraw')}}</MDBBtn>
         </div>
         <div class="row g-2">
            <div class="col-md-4">
               <AssetToWithdraw/>
            </div>

            <div class="col-md-4">
               <AssetToWithdraw/>
            </div>
            <div class="col-md-4">
               <AssetToWithdraw/>
            </div>
         </div>
      </div>

      <div>
         <h5 class="text-start mb-4">{{t('default.incentives')}}</h5>
         <div class="row g-3">
            <div class="col-md-6">
               <Incentives/>
            </div>
            <div class="col-md-6">
               <Incentives/>
            </div>           
            <div class="col-md-6">
               <Incentives/>
            </div>
            <div class="col-md-6">
               <Incentives/>
            </div>
         </div>
      </div>
   </div>
</template>

<script>
import { useI18n } from 'vue-i18n'
import NextUnlock from '@/components/dao/rewards/NextUnlock.vue'
import AssetToWithdraw from '@/components/dao/rewards/AssetToWithdraw.vue'
import Incentives from '@/components/dao/rewards/Incentives.vue'
import { MDBBtn } from "mdb-vue-ui-kit";
export default {
    components: {
      NextUnlock,
      AssetToWithdraw,
      Incentives,
      MDBBtn
    },
   setup () {
      const {t} = useI18n()

      return {
         t
      }
   }
}
</script>
