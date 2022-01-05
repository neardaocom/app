<template>
  <MDBChart
    type="bar"
    :data="analytics"
  />
</template>

<script>
  import { MDBChart } from "mdb-vue-ui-kit";
  import { ref, onMounted, toRefs } from "vue";
  import { useI18n } from "vue-i18n";
  import Analytics from '@/models/analytics'

  export default {
    components: {
      MDBChart
    },
    props: {
      dao: {
        type: Object,
        required: true,
      },
    },
    setup(props) {
      const { t, d } = useI18n()
      const { dao } = toRefs(props)
      const analytics = ref({})
      const chartOptions = ref({})

      onMounted(() => {
        // const period: Analytics.Period = 
        const cashflow = Analytics.computeUnlockingCashflow(
            Analytics.parseAlgorithm(dao.value.token_stats.council.algorithm),
            dao.value.token_stats.council,
            Analytics.getPeriodFromDuration(dao.value.token_stats.council.duration),
            dao.value.created
        )
        // console.log(cashflow)
        
        const labels = cashflow.map(obj => d(obj.date))
        const dataset = cashflow.map(obj => obj.value)
        
        analytics.value = {
            labels,
            datasets: [
              {
                color: "#FFCDD2",
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