<template>
  <header>
    <!-- Navbar -->
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
              <router-link :to="{name: 'dao', query: {}}" :class="['nav-link']"><i class="fab fa-sketch"></i> Launch DAO</router-link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
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
import Introduction from '@/views/landing_page/Introduction.vue'
import Services from '@/views/landing_page/Services.vue'
import Statistics from '@/views/landing_page/Statistics.vue'
import Price from '@/views/landing_page/Price.vue'
import Footer from '@/views/landing_page/Footer.vue'

export default {
  name: 'Home',
  components: {
    Introduction, Services, Statistics, Price, Footer
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