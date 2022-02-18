<template>
  <header style="margin-top: 58px">
    <MDBNavbar expand="lg" light bg="white" position="top" container>
      <MDBNavbarBrand href="/"><img :src="'/img/logo_n.png'" alt="" class="logo_style"/> <span class="navbar_logo_text">{{appName}}</span></MDBNavbarBrand>
      <MDBNavbarToggler
        @click="collapse = !collapse"
        target="#sidenav"
        :aria-label="t('default.toggle_navigation')"
      ></MDBNavbarToggler>
      <MDBCollapse v-model="collapse" id="sidenav">
        <MDBNavbarNav right class="ms-auto ">
          <MDBNavbarItem v-if="false" class="mx-2" :to="{name: 'landing-page', query: {}}" :title="appName"><MDBIcon class="pe-2" icon="home" size="lg"></MDBIcon> <span class="d-lg-nonee">{{ appName }}</span></MDBNavbarItem>
          
          <MDBNavbarItem class="mx-2" :to="{name: 'dao-list', query: {}}" :title="t('default.organizations')"><i class="bi bi-people"/> <span class="d-lg-nonee">{{ t('default.organizations') }}</span></MDBNavbarItem>
          
          <MDBNavbarItem class="mx-2" :to="{name: 'market', query: {}}" :title="t('default.market')"><i class="bi bi-bag"/> <span class="d-lg-nonee">{{ t('default.market') }}</span></MDBNavbarItem>
          
          <MDBNavbarItem  v-if="isAccountSigned" class="mx-2">
            <!-- Navbar dropdown -->
            <MDBDropdown class="nav-item" align="end" v-model="dropdown">
              <MDBDropdownToggle tag="a" class="nav-link" @click="dropdown = !dropdown"> <i class="bi bi-wallet2"/> <span class="d-lg-nonee"> {{ accountId }} </span> </MDBDropdownToggle>
              <MDBDropdownMenu aria-labelledby="dropdownMenuButton">
                <MDBDropdownItem :href="walletUrl">{{t('default.wallet')}}</MDBDropdownItem>
                <MDBDropdownItem tag="button" @click="logout()">{{t('default.log_out') }}</MDBDropdownItem>
              </MDBDropdownMenu>
            </MDBDropdown>
          </MDBNavbarItem>

          <MDBNavbarItem v-if="isAccountSigned" :to="{name: 'dao-create'}" linkClass="btn btn-black btn-rounded mx-2 text-light px-4 gradient-background"><i class="bi bi-plus me-1"/>{{ t('default.create_dao') }}</MDBNavbarItem>
          <MDBNavbarItem v-else>
            <MDBBtn @click="login()" block class="btn btn-black btn-rounded mx-2 gradient-background" data-mdb-toggle="tooltip" data-mdb-placement="bottom" title="Log In">{{ t('default.log_in') }}</MDBBtn>
          </MDBNavbarItem>
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
    MDBIcon,
    MDBDropdown,
    MDBDropdownToggle,
    MDBDropdownMenu,
    MDBDropdownItem
  } from 'mdb-vue-ui-kit';
  //import { mapGetters } from 'vuex'

  import { useI18n } from 'vue-i18n';

  export default {
    components: {
      MDBIcon, MDBNavbar, MDBNavbarToggler, MDBNavbarBrand, MDBNavbarNav, MDBNavbarItem, MDBCollapse, MDBBtn,
      MDBDropdown,
      MDBDropdownToggle,
      MDBDropdownMenu,
      MDBDropdownItem
    },
    setup() {
      const collapse = ref(false);
      const dropdown = ref(false);
      const { t } = useI18n();
      return {
        t,
        collapse,
        dropdown
      }
    },
    computed: {
      accountId() {
        return this.$store.getters['near/getAccountId']
      },
      appName() {
        return process.env.VUE_APP_BRAND_NAME
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
.logo_style{
  width: 32px;
  vertical-align: top
}

.navbar_logo_text{
  letter-spacing: 2.35px
}

</style>