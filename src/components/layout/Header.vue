<template>
  <header style="margin-top: 58px">
    <MDBNavbar expand="lg" light bg="white" position="top" container>
      <MDBNavbarBrand href="/"><img :src="'/img/logo_neardao.png'" alt="" class="navbar-logo-image"/> <span class="navbar-logo-text">{{ config.app.brandName }}</span></MDBNavbarBrand>
      <MDBNavbarToggler
        @click="collapse = !collapse"
        target="#sidenav"
        :aria-label="t('default.toggle_navigation')"
      ></MDBNavbarToggler>
      <MDBCollapse v-model="collapse" id="sidenav">
        <MDBNavbarNav right class="ms-auto ">
          <MDBNavbarItem v-if="false" class="mx-2" :to="{name: 'landing-page', query: {}}" :title="config.app.brandName"><MDBIcon class="pe-2" icon="home" size="lg"></MDBIcon> <span class="d-lg-nonee">{{ config.app.brandName }}</span></MDBNavbarItem>
          
          <MDBNavbarItem class="mx-2" :to="{name: 'dao-list', query: {}}" :title="t('default.organizations')"><i class="bi bi-people"/> <span class="fw-bold">{{ t('default.organizations') }}</span></MDBNavbarItem>
          
          <MDBNavbarItem class="mx-2" :to="{name: 'market', params: {id: daoId}, query: {}}" :title="t('default.market')"><i class="bi bi-bag"/> <span class="fw-bold">{{ t('default.market') }}</span></MDBNavbarItem>
          
          <MDBNavbarItem  v-if="isSignedIn" class="mx-2">
            <!-- Navbar dropdown -->
            <MDBDropdown class="nav-item" align="end" v-model="dropdown">
              <MDBDropdownToggle tag="a" class="nav-link" @click="dropdown = !dropdown"> <i class="bi bi-wallet2"/> <span class="d-lg-nonee"> {{ wallet.accountId }} </span> </MDBDropdownToggle>
              <MDBDropdownMenu aria-labelledby="dropdownMenuButton">
                <MDBDropdownItem :href="config.near.walletUrl">{{t('default.wallet')}}</MDBDropdownItem>
                <MDBDropdownItem tag="button" @click="logout()">{{t('default.log_out') }}</MDBDropdownItem>
              </MDBDropdownMenu>
            </MDBDropdown>
          </MDBNavbarItem>
        </MDBNavbarNav>
          <MDBBtn v-if="isSignedIn" @click="createDaoPage()"  color="primary" rounded class="bg-gradient-100 fs-6 text-uppercase mx-2"><i class="bi bi-plus me-1"/>{{ t('default.create_dao') }}</MDBBtn>
          <MDBBtn v-else @click="login()" color="primary" rounded class="bg-gradient-100 fs-6 text-uppercase mx-2" data-mdb-toggle="tooltip" data-mdb-placement="bottom" title="Log In">{{ t('default.log_in') }}</MDBBtn>
      </MDBCollapse>
    </MDBNavbar>
  </header>
</template>

<script>
  import { ref, inject } from 'vue';
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

import { useI18n } from 'vue-i18n';
import { useWalletAuth } from '@/hooks/wallet';
import { useLinks } from '@/hooks/router';

  export default {
    components: {
      MDBIcon, MDBNavbar, MDBNavbarToggler, MDBNavbarBrand, MDBNavbarNav, MDBNavbarItem, MDBCollapse, MDBBtn,
      MDBDropdown,
      MDBDropdownToggle,
      MDBDropdownMenu,
      MDBDropdownItem
    },
    props: {
      daoId: {
        type: String,
        required: false,
      }
    },
    setup() {
      const config = inject('config')
      const wallet = inject('wallet')
      const loader = inject('loader')
      const collapse = ref(false);
      const dropdown = ref(false);
      const { t } = useI18n();
      const { createDaoPage } = useLinks()

      const { isSignedIn, login, logout } = useWalletAuth(loader, config)

      return {
        t,
        config,
        collapse,
        dropdown,
        wallet,
        createDaoPage,
        isSignedIn, login, logout,
      }
    },
  };
</script>

<style>
.navbar-logo-image {
  width: 32px;
  vertical-align: top;
}

.navbar-logo-text {
  letter-spacing: 0.0px;
  font-weight: 600;
}

</style>