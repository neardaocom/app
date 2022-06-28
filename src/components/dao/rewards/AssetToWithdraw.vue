<template>
   <MDBCard>
      <MDBCardBody>
         <div class="d-flex">
            <div class="d-flex align-items-center">
               <slot name="icon">
                  <Icon v-if="rewardAsset.asset.type === 'near'"  icon="NEAR" :size="50"/>
                  <Icon v-else :icon="rewardAsset.asset.icon" :size="50"/>
               </slot>
               <div class="text-start">
                  <div class="fs-5 fw-bold me-1">{{ rewardAsset.asset.symbol }}</div>
                  <div class="text-muted small mt-n2">{{ t('asset_type_' + rewardAsset.asset.type) }}</div>
               </div>
            </div>

            <div class="ms-auto text-start">
               <InfoAmount :amount="rewardAsset.amount" :suffix="rewardAsset.asset.symbol" class="fs-5 fw-bold" suffixNormal/>     
               <div class="fw-bold text-success">+<NumberFormatter :amount="rewardAsset.amountCounting"/></div>
            </div>
         </div>
         <div class="d-flex">
            <div class="ms-auto text-end mt-2">
               <MDBBtn @click="withdraw(rewardAsset.asset, rewardAsset.pricelistIds)" color="primary" size="sm" rounded class="align-self-center" style="width: 144px">{{t('claim')}}</MDBBtn>
            </div>
         </div>
         
      </MDBCardBody>
   </MDBCard>
</template>

<script>
import { useI18n } from 'vue-i18n'
import {
   MDBCard,
   MDBCardBody,
   MDBBtn,
} from 'mdb-vue-ui-kit'
import NumberFormatter from "@/components/ui/NumberFormatter.vue"
import Icon from "@/components/ui/Icon.vue"
import InfoAmount from '@/components/ui/InfoAmount.vue'


export default {
   components: {
      MDBCard,
      MDBCardBody,
      MDBBtn,
      Icon,
      NumberFormatter,
      InfoAmount
   },
   props: {
      rewardAsset: {
         type: Object,
         required: true,
      },
      withdraw: {
         type: Function,
         required: true,
      },
   },
   setup () {
      const {t} = useI18n()

      return {
         t, 
      }
   }
}
</script>
