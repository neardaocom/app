<template>
   <MDBTable>
      <thead>
         <tr>
            <th scope="col">#</th>
            <th scope="col">{{t('default.name')}}</th>
            <th scope="col">{{t('default.group')}}</th>
            <th scope="col">{{t('default.assets')}}</th>
            <th scope="col">{{t('default.rewards_start_at')}}</th>
            <th scope="col">{{t('default.rewards_ends')}}</th>
         </tr>
      </thead>
      <tbody>
         <tr v-for="(reward) in rewards" :key="reward.id">
            <th scope="row">{{reward.id}}</th>
            <td>{{reward.name}}</td>
            <td>{{reward.targetGroup.name}}</td>
            <td>
               <div v-for="(asset, index) in reward.amounts" :key="index">
                  <InfoAmount :amount="asset.amount" :suffix="asset.asset.symbol" suffixNormal class="fw-bold"/> 
               </div>
            </td>
            <td>{{rewardsDateFormat(new Date(reward.startAt))}}</td>
            <td>{{ reward.endAt ? rewardsDateFormat(new Date(reward.endAt)) : '∞'}}</td>
         </tr>
      </tbody>
   </MDBTable>
</template>

<script>
import { useI18n } from 'vue-i18n'
// import DateHelper from "@/models/utils/DateHelper";
import {useRewards} from '@/hooks/rewards'
import { MDBTable } from "mdb-vue-ui-kit";
import { inject } from '@vue/runtime-core';
import InfoAmount from '@/components/ui/InfoAmount.vue'

export default {
   components:{
      MDBTable,
      InfoAmount
   },
   props:{
      rewards:{
         type: Object,
         required: true
      }
   },
   setup () {
      const {t} = useI18n() 
      const dao = inject('dao')
      const loader = inject('loader')
      const {frequencyToTime, rewardsDateFormat} = useRewards(dao, loader)   

      return {
         t, frequencyToTime, rewardsDateFormat
      }
   }
}
</script>