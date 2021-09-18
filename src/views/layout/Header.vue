<template>
  <header style="margin-top: 58px">
    <MDBNavbar expand="lg" light bg="white" position="top" container>
      <MDBNavbarBrand href="/"><MDBIcon icon="chart-pie" iconStyle="fas"/></MDBNavbarBrand>
      <MDBNavbarToggler
        @click="collapse = !collapse"
        target="#sidenav"
        :aria-label="t('default.toggle_navigation')"
      ></MDBNavbarToggler>
      <MDBCollapse v-model="collapse" id="sidenav">
        <MDBNavbarNav center class="ms-auto align-items-center">
          <MDBNavbarItem class="mx-2" :to="{name: 'landing-page', query: {}}" :title="t('default.landing_page')"><MDBIcon class="pe-2" icon="home" size="lg"></MDBIcon> <span class="d-lg-nonee">{{ t('default.landing_page') }}</span></MDBNavbarItem>
          <MDBNavbarItem class="mx-2" :to="{name: 'daos', query: {}}" :title="t('default.organizations')"><MDBIcon class="pe-2" icon="building" size="lg"></MDBIcon> <span class="d-lg-nonee">{{ t('default.organizations') }}</span></MDBNavbarItem>
          <li v-if="isAccountSigned" class="nav-item">
            <a v-if="isAccountSigned" class="nav-link mx-2" target="_blank" :href="walletUrl"><MDBIcon class="pe-2" icon="wallet" iconStyle="fas" /> {{ accountId }}</a>
          </li>
          <MDBNavbarItem :to="{name: 'createDao'}" linkClass="btn btn-black btn-rounded mx-2 text-light px-4" >{{ t('default.create_dao') }}</MDBNavbarItem>
          <li class="nav-item">
            <MDBBtn v-if="isAccountSigned" @click="logout()" class="btn btn-black btn-rounded mx-2"><!--<MDBIcon class="pe-2" icon="sign-out-alt" iconStyle="fas" /> -->{{ t('default.log_out') }}</MDBBtn>
            <MDBBtn v-else @click="login()" class="btn btn-black btn-rounded mx-2" data-mdb-toggle="tooltip" data-mdb-placement="bottom" title="Log In"><!-- <MDBIcon class="pe-2" icon="sign-in-alt" iconStyle="fas"/> -->{{ t('default.log_in') }}</MDBBtn>
          </li>
        </MDBNavbarNav>
      </MDBCollapse>
    </MDBNavbar>
  </header>
</template>

<script>
  import { ref } from 'vue';
  import {
    MDBBtn,
    MDBNavbar,
    MDBNavbarToggler,
    MDBNavbarBrand,
    MDBNavbarNav,
    MDBNavbarItem,
    MDBCollapse,
    MDBIcon
  } from 'mdb-vue-ui-kit';
  //import { mapGetters } from 'vuex'
  
  import { useI18n } from 'vue-i18n';

  export default {
    components: {
      MDBIcon, MDBNavbar, MDBNavbarToggler, MDBNavbarBrand, MDBNavbarNav, MDBNavbarItem, MDBCollapse, MDBBtn
    },
    setup() {
      const collapse = ref(false);
      const { t } = useI18n();
      return {
        t,
        collapse
      }
    },
    computed: {
      accountId() {
        console.log(this.$store.getters['near/getAccountId'])
        return this.$store.getters['near/getAccountId']
      },
      walletUrl() {
        return this.$store.getters['near/getWalletUrl']
      },
      isAccountSigned() {
        return this.$store.getters['near/isSignedIn']
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
            
            if (this.$route.name === "createDao"){
              this.$router.push({name: 'landing-page'})
            }
        }
    }
  };
</script>

<style>

</style>