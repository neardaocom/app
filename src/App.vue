<template>
  <router-view/>
</template>

<script>
import { ref, onMounted, onUnmounted } from "vue";
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

    onMounted(() => {
      near_price_interval.value = setInterval(near_price_counter, 5 * 60 * 1000) // 5 minutes
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
  font-family: Roboto, Helvetica, Arial, sans-serif;
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

</style>