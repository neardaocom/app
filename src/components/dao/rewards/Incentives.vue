<template>
   <MDBCard text="start">
      <MDBRow class="g-0">
         <MDBCol col="1" class="d-flex flex-column-reverse justify-content-between text-center text-white bg-gradient-180 py-4" style="border-radius: 0.5rem 0 0 0.5rem">
            <div>#{{reward.id}}</div>
         </MDBCol>
         <MDBCol col="11">
            <MDBCardBody>
               <div class="d-flex">
                  <div>
                     <small class="text-muted">
                        {{t(`default.${reward.pricelist.type}`)}}
                        <template v-if="reward.pricelist.type === 'salary'" >
                            - {{ reward.pricelist.targetGroup?.name }}
                        </template>
                     </small>
                     <MDBCardTitle>
                        <div> {{ reward.pricelist.name }}</div>
                        <div class="fw-normal">Lock: {{reward.lock.name}} </div>
                      </MDBCardTitle>
                  </div>
                  <div  v-if="false" class="d-flex align-items-center ms-auto">
                     <MDBBadge color="muted" pill class="me-2" style="padding: 0.3rem" ><i class="bi bi-unlock"/></MDBBadge>
                     <div>
                        <div class="fw-bold">
                           11:30am <small class="fw-normal">UTC</small>
                        </div>
                        <div class="text-muted text-end mt-n2">
                           2022/05/08
                        </div>
                     </div>
                  </div>
               </div>
               <MDBCardText class="mb-5">
                  <template v-for="(asset, index) in reward.amounts" :key="index">
                     <div class="d-flex align-items-center">
                        <Icon :icon="asset.asset.type === 'near' ? 'near' : asset.asset.icon" :size="25"/>
                        <InfoAmount :amount="asset.amount" :suffix="asset.asset.symbol" class="fs-4 fw-bold"/>     
                     </div>
                     <div v-if="reward.pricelist.type === 'salary'"  class="mt-n2" style="margin-left: 33px">
                        <NumberFormatter :amount="amountFromPricelist(reward.pricelist.amounts,asset.asset.accountId)"/><span class="text-muted small"> per {{frequencyToTime(reward.pricelist.unitSeconds)}} </span>
                     </div>
                  </template>
               </MDBCardText>
               <MDBCardText>
               <span class="text-muted small">From Lock #{{reward.lockId}}</span>
               </MDBCardText>
            </MDBCardBody>
         </MDBCol>
      </MDBRow>
   </MDBCard>
</template>

<script>
import { useI18n } from 'vue-i18n'
import {
   MDBCard,
   MDBCardBody,
   MDBCardText,
   MDBCardTitle,
   MDBBadge,
   MDBRow,
   MDBCol
} from 'mdb-vue-ui-kit'
import NumberFormatter from "@/components/ui/NumberFormatter.vue"
import Icon from '@/components/ui/Icon.vue'
import loGet from 'lodash/get'
import {useRewards} from '@/hooks/rewards'
import { inject } from '@vue/runtime-core'
import InfoAmount from '@/components/ui/InfoAmount.vue'


export default {
   components: {
      MDBCard,
      MDBCardBody,
      MDBCardText,
      MDBCardTitle,
      MDBBadge,
      MDBRow,
      MDBCol,
      Icon,
      NumberFormatter,
      InfoAmount
   },
   props: {
      reward:{
         type: Object,
         required: true
      }
   },
   setup () {
      const { t } = useI18n()
      const dao = inject('dao')
      const loader = inject('loader')
      const {frequencyToTime, amountFromPricelist} = useRewards(dao, loader)  

      return {
         t, amountFromPricelist, loGet, frequencyToTime
      }
   }
}
</script>
