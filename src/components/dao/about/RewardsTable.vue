<template>
   <MDBTable>
      <thead>
         <tr>
            <th scope="col">#</th>
            <th scope="col">{{t('default.group')}}</th>
            <th scope="col">{{t('default.assets')}}</th>
            <th scope="col">{{t('default.frequency')}}</th>
            <th scope="col">{{t('default.rewards_start_at')}}</th>
            <th scope="col">{{t('default.rewards_ends')}}</th>
         </tr>
      </thead>
      <tbody>
         <tr v-for="reward in rewards" :key="reward.id">
            <th scope="row">{{reward.id}}</th>
            <td>{{reward.targetGroup.name}}</td>
            <td>
               <div v-for="(asset, index) in reward.amounts" :key="index">
                  <span class="fw-bold me-1">{{asset.amount}}</span>
                   {{asset.asset.symbol}}
               </div>
            </td>
            <td>{{frequencyToTime(reward.unitSeconds)}}</td>
            <td>{{formatDate(new Date(reward.startAt))}}</td>
            <td>{{reward.endAt ? formatDate(new Date(reward.endAt)) : '∞'}}</td>
         </tr>
      </tbody>
   </MDBTable>
</template>

<script>
import { useI18n } from 'vue-i18n'
import DateHelper from "@/models/utils/DateHelper";
import NearBlockchainUtils from '@/models/nearBlockchain/Utils'
import { MDBTable } from "mdb-vue-ui-kit";
export default {
   components:{
      MDBTable
   },
   props:{
      rewards:{
         type: Object,
         required: true
      }
   },
   setup () {
      const {t} = useI18n() 
      const formatDate = (date) => (DateHelper.format(date, 'DD.MM.YYYY'))
      const frequencyToTime = (frequency) => {
         const time =  NearBlockchainUtils.durationFromChain(frequency)
         const years =  `${time.years ? time.years + 'years' : '' }`
         const months =  `${time.months ? time.months + 'months' : '' }`
         const days =  `${time.days ? time.days + 'days' : '' }`
         const hours =  `${time.hours ? time.hours + 'h' : '' }`
         const minutes = `${time.minutes ? time.minutes + 'm' : '' }`
         const seconds = `${time.seconds ? time.seconds + 's' : '' }`
         return years + months + days + hours + minutes + seconds
      }      

      return {
         t, formatDate, frequencyToTime
      }
   }
}
</script>