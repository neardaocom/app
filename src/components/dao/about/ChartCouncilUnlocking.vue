<template>
  <MDBChart
    type="bar"
    :data="analytics"
  />
</template>

<script>
  import { MDBChart } from "mdb-vue-ui-kit";
  import { ref, onMounted, toRefs, inject } from "vue";
  import { useI18n } from "vue-i18n";
  // import Analytics from '@/models/analytics'


  export default {
    components: {
      MDBChart
    },
    props: {
      group: {
        type: Object,
        required: true,
      },
    },
    setup(props) {
      const { t, d } = useI18n()
      const dao = inject('dao')
      const { group } = toRefs(props)
      const analytics = ref({})
      const chartOptions = ref({})

      onMounted(() => {
        //const cashflow = Analytics.computeUnlockingCashflow(
        //    Analytics.parseAlgorithm(group.value.token.algorithm),
        //    { release_end: group.value.token.releaseEnd, duration: group.value.token.duration, total: group.value.token.locked, init: group.value.token.init },
        //    Analytics.getPeriodFromDuration(group.value.token.duration),
        //    dao.value.created
        //)
        // console.log(cashflow)
        
        const labels = cashflow.map(obj => d(obj.date))
        const dataset = cashflow.map(obj => obj.value)
        
        analytics.value = {
            labels,
            datasets: [
              {
                backgroundColor: ["#6B6EF9"],
                data: dataset,
                label: t('default.amount'),
              }
            ],
        }

        chartOptions.value = {
          duration: 200,
        }
      });
    
      return {
        analytics, chartOptions
      };
    }
  };
</script>