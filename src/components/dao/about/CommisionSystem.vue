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
         <div v-if="rewardsSalary.length > 0" class="m-4">
            <h5>{{t('default.salary')}}</h5>
            <SalaryTable :rewards="rewardsSalary"/>
         </div>
         <div v-if="rewardsActivity.length > 0" class="m-4">
            <h5>{{t('default.activity')}}</h5>
            <ActivityTable :rewards="rewardsActivity"/>
         </div>
         <div v-if="rewardsEvent.length > 0" class="m-4">
            <h5>{{t('default.event')}}</h5>
            <SalaryTable :rewards="rewardsEvent"/>
         </div>
         <NoData v-if="rewardsSalary.length === 0 && rewardsActivity.length === 0 && rewardsEvent.length === 0" :text="t('default.no_commision_system')" hint="This is a hint" />
      </MDBCardBody>
   </MDBCard>
</template>

<script>
import { useI18n } from 'vue-i18n'
import { MDBCard, MDBCardBody, MDBCardTitle } from "mdb-vue-ui-kit";
import Tooltip from '@/components/ui//Tooltip.vue'
import { inject } from '@vue/runtime-core';
import { useRewardsList } from "@/hooks/rewards";
import SalaryTable from '@/components/dao/about/SalaryTable.vue'
import ActivityTable from '@/components/dao/about/ActivityTable.vue'
import NoData from '@/components/ui/NoData.vue'

export default {
   components:{
      MDBCard,
      MDBCardBody,
      MDBCardTitle,
      Tooltip,
      SalaryTable,
      ActivityTable,
      NoData
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
