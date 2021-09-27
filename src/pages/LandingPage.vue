<template>
  <Header></Header>

  <main>
    <Services></Services>
    <Statistics></Statistics>
    <Price></Price>
  </main>

  <Footer></Footer>
</template>

<script>
import Header from '@/components/layout/Header.vue'
import Footer from '@/components/layout/Footer.vue'
import Services from '@/components/landingPage/Services.vue'
import Statistics from '@/components/landingPage/Statistics.vue'
import Price from '@/components/landingPage/Price.vue'

export default {
  name: 'Home',
  components: {
    Services, Statistics, Price, Footer, Header
  },
  setup() {
    const daoDefault = process.env.VUE_APP_DAO_DEFAULT
    return { daoDefault }
  },
  created() {
  },
  mounted() {
    this.$router.push({ name: 'dao', params: { id: this.daoDefault }})
  }
}
</script>

<style>
.navbar {
      background-color: #fff;
    }

    .navbar-scroll .navbar-brand,
    .navbar-scroll .nav-link,
    .navbar-scroll .fa-bars {
      color: #112f6b;
    }

    .navbar-scrolled .navbar-brand,
    .navbar-scrolled .nav-link,
    .navbar-scrolled .fa-bars {
      color: #112f6b;
    }

    .navbar-scrolled {
      background-color: #fff;
    }

    @media (max-width: 450px) {
      #intro {
        height: 950px !important;
      }
    }

    @media (min-width: 550px) and (max-width: 750px) {
      #intro {
        height: 1100px !important;
      }
    }

    @media (min-width: 800px) and (max-width: 990px) {
      #intro {
        height: 600px !important;
      }
    }
</style>