<template>
  <main>
  </main>
</template>

<script>
export default {
  name: 'Home',
  components: {
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