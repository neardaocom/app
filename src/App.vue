<template>
  <router-view/>
  <notification-toast/>
</template>

<script>
import { ref, onMounted, provide, inject } from "vue";
// confings
// factories
import { getConfig } from "@/config"
import Register from "@/models/utils/Register";
import { Loader } from "@/loader";
import { useNearPrice } from "@/hooks/market";
import { useLoad as useDaoLoad } from "@/hooks/daoList";
import { useStore } from 'vuex';

export default {
  components: {
  },
  setup() {
    const logger = inject('logger')
    const notify = inject('notify')
    const store = useStore()
    // config
    const config = ref(getConfig(process.env.NODE_ENV))
    provide('config', config)
    // loader
    const loader = ref(new Loader(new Register(), config.value))
    provide('loader', loader)

    // init
    const { coinGeckoExchange,  nearPriceResolve, nearPriceInterval } = useNearPrice(config)
    const { listInterval, listResolve } = useDaoLoad(loader, logger, notify, config.value)

    onMounted(async () => {
      store.dispatch('ipfs/init')
      store.dispatch('near/init').then(async () => {
        await loader.value.get('near/WalletAccount')
        await nearPriceResolve()
        await listResolve()
      })
      // Loader
      // Load NEAR
      // console.log('Loaded', nearNear.value)
      //.then(() => {
      //  listResolve()
      //})
    })

    return {
      coinGeckoExchange,  nearPriceResolve, nearPriceInterval
      , listInterval, listResolve
    };
  },
  created() {
  }
};
</script>

<style lang="scss">

// Could be used before $theme-color
$primary: #5F8AFA;
$secondary: #70ADCC;
$success: #ABD055;
$info: #5F8AFA;
$warning: #FFC860;
$danger: #DB5555;
$dark: #262626;
$light: #f0f2f5;
$white: #fff;
$black: #000;
$muted: #A7A7A7;


// because I add colors muted, gradiend
$theme-colors: (
  'primary': $primary,
  'secondary': $secondary,
  'success': $success,
  'info': $info,
  'warning': $warning,
  'danger': $danger,
  'light': $light,
  'dark': $dark,
  'white': $white,
  'black': $black,
  'muted': $muted,
);

@import '~@/../mdb/scss/index.pro.scss';

@for $i from 1 through 30 {
  .bg-gradient-#{$i * 10} {
    background: transparent linear-gradient($i * 10deg, #5F8AFA 0%, #6B6EF9 100%) 0% 0% no-repeat padding-box !important;
  }
  .text-gradient-#{$i * 10}{
    background: -webkit-linear-gradient($i * 10deg, #5F8AFA 0%, #6B6EF9 100%);
    -webkit-background-clip: text;
    -moz-background-clip: text;
    background-clip: text;
    -webkit-text-fill-color: transparent; 
    -moz-text-fill-color: transparent;
  }
}

#app {
  font-family: Manrope, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #262626;
}

#nav {
  padding: 30px;
}

body {
  background-color: #f0f2f5;
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

.fw-800{
  font-weight: 800 !important;
}

</style>