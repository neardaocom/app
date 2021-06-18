<template>
  <header>
    <!-- Navbar -->
    <Navigation></Navigation>
    <!-- Navbar -->

    <!--Section: Design Block-->
    <Introduction></Introduction>
    <!--Section: Design Block-->
  </header>

  <main>
    <Services></Services>
    <Statistics></Statistics>
    <Price></Price>
  </main>

  <Footer></Footer>
</template>

<script>
import Navigation from '@/views/landing_page/Navigation.vue'
import Introduction from '@/views/landing_page/Introduction.vue'
import Services from '@/views/landing_page/Services.vue'
import Statistics from '@/views/landing_page/Statistics.vue'
import Price from '@/views/landing_page/Price.vue'
import Footer from '@/views/landing_page/Footer.vue'

export default {
  name: 'Home',
  components: {
    Navigation, Introduction, Services, Statistics, Price, Footer
  },
  created () {
    console.log(this.$router)
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
      background-color: #dddde4;
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