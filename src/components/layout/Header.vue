<template>
  <header style="margin-top: 58px">
    <MDBNavbar expand="lg" light bg="white" position="top" container>
      <MDBNavbarBrand href="/"><MDBIcon icon="flag" iconStyle="far"/></MDBNavbarBrand>
      <MDBNavbarToggler
        @click="collapse = !collapse"
        target="#sidenav"
        :aria-label="t('default.toggle_navigation')"
      ></MDBNavbarToggler>
      <MDBCollapse v-model="collapse" id="sidenav">
        <MDBNavbarNav center class="ms-auto align-items-center">
          <MDBNavbarItem v-if="false" class="mx-2" :to="{name: 'landing-page', query: {}}" :title="appName"><MDBIcon class="pe-2" icon="home" size="lg"></MDBIcon> <span class="d-lg-nonee">{{ appName }}</span></MDBNavbarItem>
          <MDBNavbarItem class="mx-2" :to="{name: 'dao-list', query: {}}" :title="t('default.organizations')"><MDBIcon class="pe-2" icon="building" size="lg"></MDBIcon> <span class="d-lg-nonee">{{ t('default.organizations') }}</span></MDBNavbarItem>
          <MDBNavbarItem class="mx-2" :to="{name: 'market', query: {}}" :title="t('default.market')"><MDBIcon class="pe-2" icon="download" size="lg"></MDBIcon> <span class="d-lg-nonee">{{ t('default.market') }}</span></MDBNavbarItem>
          <li v-if="isAccountSigned" class="nav-item">
            <a v-if="isAccountSigned" class="nav-link mx-2" target="_blank" :href="walletUrl"><MDBIcon class="pe-2" icon="wallet" iconStyle="fas" /> {{ accountId }}</a>
          </li>
          <MDBNavbarItem v-if="isAccountSigned" :to="{name: 'dao-create'}" linkClass="btn btn-black btn-rounded mx-2 text-light px-4" >{{ t('default.create_dao') }}</MDBNavbarItem>
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
        return this.$store.getters['near/getAccountId']
      },
      appName() {
        return window.process.env.VUE_APP_BRAND_NAME
      },
      walletUrl() {
        return this.$store.getters['near/getWalletUrl']
      },
      isAccountSigned() {
        return this.$store.getters['near/isSignedIn']
      },
      contractName() {
        return window.process.env.VUE_APP_NEAR_CONTRACT_NAME
      }
    },
    methods: {
        login() {
            this.$store.commit('near/signIn')
        },
        logout() {
          this.$logger.info('B', 'User', 'Logout', `Wallet ${this.accountId} is logged out`)
          this.$store.commit('near/signOut')
          if (this.$route.name === "dao-create"){
            this.$router.push({name: 'landing-page'})
          }
        }
    }
  };
</script>

<style>

</style>