<template>
   <MDBCard class="text-start">
      <MDBCardBody>
         <div class="d-flex">
            <MDBCardTitle>
               <i class="bi bi-cash-coin text-gradient-180 me-1"/>
               {{t('default.commission_system')}}
            </MDBCardTitle>
            <Tooltip class="ms-auto" text="Tooltip" />
         </div>
         <div class="m-4">
            <h5>{{t('default.salary')}}</h5>
            <RewardsTable :rewards="rewardsSalary"/>
         </div>
         <div class="m-4" v-if="rewardsActivity.length > 0">
            <h5>{{t('default.event')}}</h5>
            <RewardsTable :rewards="rewardsActivity"/>
         </div>
         <div class="m-4" v-if="rewardsEvent.length > 0">
            <h5>{{t('default.activity')}}</h5>
            <RewardsTable :rewards="rewardsEvent"/>
         </div>
      </MDBCardBody>
   </MDBCard>
</template>

<script>
import { useI18n } from 'vue-i18n'
import { MDBCard, MDBCardBody, MDBCardTitle } from "mdb-vue-ui-kit";
import Tooltip from '@/components/ui//Tooltip.vue'
import { inject } from '@vue/runtime-core';
import { useRewardsList } from "@/hooks/rewards";
import RewardsTable from '@/components/dao/about/RewardsTable.vue'
export default {
   components:{
      MDBCard,
      MDBCardBody,
      MDBCardTitle,
      Tooltip,
      RewardsTable
   },
   setup () {
      const {t} = useI18n()
      const dao = inject('dao')
      const { rewardsSalary, rewardsActivity, rewardsEvent } = useRewardsList(dao)
      
      return {
         t, rewardsSalary, rewardsActivity, rewardsEvent
      }
   }
}
</script>
