<template>
   <div class="d-flex align-items-center mb-5">
      <MDBBadge color="success" pill class="me-2" style="padding: 0.6rem" ><i class="bi bi-unlock fa-2x"/></MDBBadge>
      <div class="text-start">
         <div class="fs-5 fw-800"> Gift for loyalty </div>
         <div class="text-muted small mt-n2">Event</div>
      </div>
   </div>
   <div class="row g-2 mb-4">
      <div class="col-12 col-md-6">
         <TreasuryLockDetail/>
      </div>
      <div class="col-12 col-md-6">
         <TreasuryLockDetail/>
      </div>
   </div>

   <div class="row m-auto col-12 col-md-6 mb-4">
      <h5 class="text-start"><i class="bi bi-bar-chart text-gradient-180 me-2"/>{{t('unlocking_token')}}</h5>
      <MDBChart type="bar" :data="barChartData" />
   </div>
</template>

<script>
import { MDBBadge, MDBChart } from 'mdb-vue-ui-kit'
import TreasuryLockDetail from '@/components/dao/treasury/TreasuryLockDetail.vue'
import { ref } from '@vue/reactivity';
import { useI18n } from 'vue-i18n';
export default {
   components:{
      MDBBadge,
      MDBChart,
      TreasuryLockDetail
   },
   setup () {
      const {t} = useI18n()
      const barChartData = ref({
         labels: [
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday",
            "Sunday"
         ],
         datasets: [
            {
               backgroundColor: ["#6B6EF9"],
               label: "",
               data: [2112, 2343, 2545, 3423, 2365, 1985, 987]
            }
         ]
      });
      return {
         t, barChartData
      }
   }
}
</script>

