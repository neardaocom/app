<template>
  <router-view/>
  <notification-toast/>
</template>

<script>
import { ref, onMounted, onUnmounted, provide} from "vue";
import { coinGeckoExchange } from "@/services/exchangeService"

export default {
  components: {
  },
  setup() {
    // near price
    const near_price = ref(null)
    const near_price_interval = ref(null)
    const near_price_counter = () => {
      coinGeckoExchange.getActualPrice('near').then(response => {
        near_price.value = response
        // console.log('NEAR price USD: ' + near_price.value)
      })
    }
    coinGeckoExchange.getActualPrice('near').then(response => {
      near_price.value = response
      // console.log('NEAR price USD: ' + near_price.value)
    })

    provide('nearPrice', near_price)

    onMounted(() => {
      near_price_interval.value = setInterval(near_price_counter, 5 * 60 * 1_000) // 5 minutes
      // console.log('App mounted')
    })

    onUnmounted(() => {
      clearInterval(near_price_interval.value)
      // console.log('App unmounted')
    })

    return {
      near_price, near_price_interval, near_price_counter
    };
  },
  created() {
    this.$store.dispatch('near/init')
    this.$store.dispatch('ipfs/init')
  }
};
</script>

<style>
#app {
  font-family: Manrope, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  padding: 30px;
}

body {
  background-color: #f0f2f5;
}

.bg-light {
  background-color: #f0f2f5 !important;
}
.container {
  max-width: 1140px;
}

.autocomplete-dropdown-container {
  z-index: 1100;
}

.skeleton {
  display: inline-block;
  background-color: #b0c0c7;
  animation-name: shine;
  animation-duration: 2.4s;
  animation-iteration-count: infinite;
}

.skeleton-text {
  height: 16px;
  margin-bottom: 5px;
}

.skeleton-h1 {
  height: 48px;
  margin-bottom: 5px;
}

.skeleton-h2 {
  height: 36px;
  margin-bottom: 5px;
}

.skeleton-avatar {
  float: left;
  width: 48px;
  height: 48px;
  margin-right: 12px;
  margin-bottom: 5px;
}

.my_filter_form .form-notch-leading{
   border: 0px !important;
}

.my_filter_form .form-notch-trailing{
  border-top: 0px !important;
  border-right: 0px !important;
  border-radius: 0px !important;
}

@keyframes shine {
  0% { 
    opacity: 1;
  }
  50% {
    opacity: 0.35;
  }
  100% {
    opacity: 1;
  }
}

h1, .h1 {
 font-weight: 800 !important;
}

h2, .h2 {
  font-weight: 800 !important;
}


h3, .h3 {
  font-weight: 700 !important;
}

h4, .h4 {
  font-weight: 700 !important;
}

h5, .h5 {
  font-weight: 700 !important;
}

h6, .h6 {
  font-weight: 600 !important;
}

.gradient-background {
  background: transparent linear-gradient(97deg, #5F8AFA 0%, #6B6EF9 100%) 0% 0% no-repeat padding-box !important;
  font: normal normal normal 18px/24px Manrope;
  text-transform: uppercase;
}

.gradient-background:hover {
  background: transparent linear-gradient(97deg, #5F8AFA 0%, #6B6EF9 100%) 0% 0% no-repeat padding-box !important;
  font: normal normal normal 18px/24px Manrope;
  text-transform: uppercase;
}

.bg-primary{
  background-color: #5F8AFA !important;
}

.color-primary {
  color: #5F8AFA !important;
  border-color: #5F8AFA !important
}

.color-primary:hover {
  color: #6B6EF9 !important;
  border-color: #6B6EF9 !important
}

.bg-secondary {
  background-color: #70ADCC !important
}

.color-secondary{
  color: #70ADCC !important;
  border-color: #70ADCC !important
}

.color-secondary:hover{
  color: #70ADCC !important;
  border-color: #70ADCC !important
}

.color-light-gray {
  color: #C9C9C9 !important;
  border-color: #C9C9C9 !important
}

.color-light-gray:hover {
  color: #C9C9C9 !important;
  border-color: #C9C9C9 !important
}

.background-light-gray {
  background-color: #C9C9C9 !important;
}

.color-success{
  color: #ABD055 !important;
  border-color: #ABD055 !important
}

.bg-success{
  background-color: #ABD055 !important
}

.color-danger {
  color: #DB5555 !important;
  border-color: #DB5555 !important
}

.bg-danger {
  background-color: #DB5555 !important
}

.color-warning {
  color: #FFC860 !important;
  border-color: #FFC860 !important
}

.bg-warning {
  background-color: #FFC860 !important
}

.color-dark{
  color: #262626 !important;
  border-color: #262626 !important
}

.bg-dark{
  background-color: #262626 !important;
}

.color-info {
  color: #A7A7A7 !important;
  border-color: #A7A7A7 !important
}

.bg-info {
  background-color: #A7A7A7 !important;
}

.color-muted {
  color: #A7A7A7 !important;
  border-color: #A7A7A7 !important
}

.bg-muted {
  background-color: #A7A7A7 !important;
}


</style>