<template>
  <header style="margin-top: 58px">
    <nav class="navbar navbar-expand-lg fixed-top navbar-light bg-white shadow-5">
        <div class="container-fluid justify-content-between">
        <!-- Left elements -->
        <div class="d-flex">
            <!-- Toggler -->
            <button data-mdb-toggle="sidenav" data-mdb-target="#sidenav-1" class="btn shadow-0 p-0 ms-2 me-3 d-block d-xl-none" aria-controls="#sidenav-1" aria-haspopup="true">
                <i class="fas fa-bars fa-lg"></i>
            </button>
            <!-- Brand -->
            <router-link :to="{name: 'landing-page', query: {}}" :class="['navbar-brand me-2 mb-1 d-flex align-items-center']">
                <i class="far fa-flag fa-lg me-2"></i>
            </router-link>
        </div>
        <!-- Left elements -->

        <!-- Center elements -->
        <ul class="navbar-nav flex-row d-none d-md-flex" id="sidenav-1">
            <li class="nav-item me-3 me-lg-1">
              <router-link :to="{name: 'landing-page', query: {}}" :class="['nav-link']" data-mdb-toggle="tooltip" data-mdb-placement="bottom" :title="t('default.landing_page')">
                <span><i class="fas fa-home fa-lg"></i></span>
              </router-link>
            </li>
            <li class="nav-item me-3 me-lg-1">
              <router-link :to="{name: 'daos', query: {}}" :class="['nav-link']" data-mdb-toggle="tooltip" data-mdb-placement="bottom" :title="t('default.list')">
                <span><i class="fas fa-list fa-lg"></i></span>
              </router-link>
            </li>
            <!--<li class="nav-item me-3 me-lg-1">
              <a class="nav-link" href="#" title="Založit">
                <span><i class="fas fa-envelope-open-text fa-lg"></i> </span>
              </a>
            </li>-->
        </ul>
        <!-- Center elements -->

        <!-- Right elements -->
        <ul class="navbar-nav flex-row">
            <li class="nav-item me-3 me-lg-1">
              <CreateNewDaoForm></CreateNewDaoForm>
            </li>
            <li class="nav-item me-3 me-lg-1">
                <a v-if="isAccountSigned" class="nav-link btn brn-ligth p-2" :href="app_near_wallet_url" target="_blank"><MDBIcon icon="wallet" iconStyle="fas" /> {{ accountId }}</a>
            </li>
            <li class="nav-item me-3 me-lg-1">
                <button v-if="isAccountSigned" @click="logout()" class="nav-link btn brn-ligth p-2" ><MDBIcon icon="sign-out-alt" iconStyle="fas" /> <span class="d-none d-md-inline">{{ t('default.log_out') }}</span></button>
                <button v-else @click="login()" class="nav-link btn brn-ligth p-2" data-mdb-toggle="tooltip" data-mdb-placement="bottom" title="Log In"><MDBIcon icon="sign-in-alt" iconStyle="fas"/> <span class="d-none d-md-inline">{{ t('default.log_in') }}</span></button>
            </li>
        </ul>
        <!-- Right elements -->
        </div>
    </nav>
  </header>
</template>

<script>
  import { ref } from 'vue';
  import {
    //MDBBtn,
    //MDBBtnGroup,
    //MDBNavbar,
    //MDBNavbarToggler,
    //MDBNavbarBrand,
    //MDBNavbarNav,
    //MDBNavbarItem,
    //MDBCollapse,
    //MDBContainer,
    MDBIcon
  } from 'mdb-vue-ui-kit';
  //import { mapGetters } from 'vuex'
  
  import { useI18n } from 'vue-i18n';
  import CreateNewDaoForm from '@/views/dao/CreateNewDaoForm.vue'

  export default {
      
    components: {
      MDBIcon,
      CreateNewDaoForm,
    },
    setup() {
      const collapse1 = ref(false);
      const dropdown1 = ref(false);
      const app_near_wallet_url = process.env.VUE_APP_NEAR_WALLET_URL;
      const { t } = useI18n();
      return {
        app_near_wallet_url,
        t,
        collapse1,
        dropdown1
      }
    },
    computed: {
      accountId() {
        console.log(this.$store.getters['near/getAccountId'])
        return this.$store.getters['near/getAccountId']
      },
      isAccountSigned() {
        return this.$store.getters['near/isSignedIn'] || false
      },
      contractName() {
        return process.env.VUE_APP_NEAR_CONTRACT_NAME
      }
    },
    methods: {
        login() {
            console.log('login')
            this.$store.commit('near/signIn')
        },
        logout() {
            console.log('logout')
            this.$store.commit('near/signOut')
        }
    }
  };
</script>

<style>

</style>