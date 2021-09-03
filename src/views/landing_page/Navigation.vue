<template>
    <MDBNavbar expand="lg" position="top" scrolling>
      <MDBContainer>
        <MDBNavbarBrand href="#">NEAR DAO</MDBNavbarBrand>
        <MDBNavbarToggler @click="collapse1 = !collapse1" target="#navbarSupportedContent"></MDBNavbarToggler>
        <MDBCollapse v-model="collapse1" id="navbarSupportedContent">
          <MDBNavbarNav class="mb-2 mb-lg-0">
            <MDBNavbarItem href="#" class="nav-link">Home</MDBNavbarItem>
            <MDBNavbarItem href="#services" class="nav-link">Our services</MDBNavbarItem>
            <MDBNavbarItem href="#price" class="nav-link">Price</MDBNavbarItem>
            <MDBNavbarItem href="#about" class="nav-link">About</MDBNavbarItem>
            <MDBNavbarItem href="#contact" class="nav-link">Contact</MDBNavbarItem>
          </MDBNavbarNav>
          <MDBBtnGroup aria-label="" class="shadow-0">
            <router-link :to="{name: 'daos', query: {}}" :class="['nav-link btn brn-ligth']"><MDBIcon icon="sketch" iconStyle="fab" /> Launch DAO</router-link>
            <router-link :to="{name: 'dao', query: {}}" :class="['nav-link btn brn-ligth']"><MDBIcon icon="flag" iconStyle="far" /> Podilnik</router-link>
            <a v-if="isAccountSigned" @click.prevent="logout()" class="nav-link btn brn-ligth" href="">{{ accountId }} <MDBIcon icon="sign-out-alt" iconStyle="fas" /></a>
            <a v-else @click.prevent="login()" class="nav-link btn brn-ligth" href="">Log In <MDBIcon icon="sign-in-alt" iconStyle="fas"/></a>
          </MDBBtnGroup>
        </MDBCollapse>
      </MDBContainer>
    </MDBNavbar>
</template>

<script>
  import { ref } from 'vue';
  //import { mapGetters } from 'vuex'
  import {
    //MDBBtn,
    MDBBtnGroup,
    MDBNavbar,
    MDBNavbarToggler,
    MDBNavbarBrand,
    MDBNavbarNav,
    MDBNavbarItem,
    MDBCollapse,
    MDBContainer,
    MDBIcon
  } from 'mdb-vue-ui-kit';

  export default {
      //MDBBtn,
    components: {
      MDBBtnGroup,
      MDBNavbar,
      MDBNavbarToggler,
      MDBNavbarBrand,
      MDBNavbarNav,
      MDBNavbarItem,
      MDBCollapse,
      MDBContainer,
      MDBIcon
    },
    setup() {
      const collapse1 = ref(false);
      const dropdown1 = ref(false);
      return {
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