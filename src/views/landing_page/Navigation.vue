<template>
    <nav class="navbar navbar-expand-lg fixed-top navbar-scroll">
      <div class="container">
        <a class="navbar-brand" href="#">NEAR DAO</a>
        <button class="navbar-toggler" type="button" data-mdb-toggle="collapse"
          data-mdb-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false"
          aria-label="Toggle navigation">
          <i class="fas fa-bars"></i>
        </button>
        <div class="collapse navbar-collapse" id="navbarSupportedContent">
          <ul class="navbar-nav me-auto">
            <li class="nav-item">
              <a class="nav-link" href="#services">Our services</a>
            </li>
            <li class="nav-item">
              <a class="nav-link" href="#price">Price</a>
            </li>
            <li class="nav-item">
              <a class="nav-link active" aria-current="page" href="#about">About</a>
            </li>
            <li class="nav-item">
              <a class="nav-link" href="#contact">Contact</a>
            </li>
          </ul>
          <ul class="navbar-nav d-flex flex-row">
            <li class="nav-item me-3 me-lg-0">
              <router-link :to="{name: 'dao', query: {}}" :class="['nav-link']"><MDBIcon icon="sketch" iconStyle="fab" /> Launch DAO</router-link>
            </li>
            <li class="nav-item me-3 me-lg-0">
              <a v-if="account !== undefined" @click.prevent="logout()" class="nav-link" href=""><MDBIcon icon="user-alt" iconStyle="fas" /> {{ account }}</a>
              <a v-else @click.prevent="login()" class="nav-link" href=""><MDBIcon icon="sign-in-alt" iconStyle="fas"/> Log In</a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
</template>

<script>
  import {MDBIcon} from 'mdb-vue-ui-kit';

  export default {
    components: {
        MDBIcon
    },
    computed: {
      account() {
          return this.$store.state.accountId
      }
    },
    methods: {
        login() {
            console.log('login')
            this.$store.commit('accountLogin', 'petrfilla.near')
        },
        logout() {
            console.log('logout')
            this.$store.commit('accountLogout')
        }
    }
  };
</script>

<style>

</style>