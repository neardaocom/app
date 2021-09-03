<template>
  <router-view/>
</template>

<script>
  export default {
    components: {
    },
    created() {
      this.$store.dispatch('near/init')
    }
  };
</script>

<style>
#app {
  font-family: Roboto, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  padding: 30px;
}

body {
  background-color: #f0f2f5;
}

.bg-light {
  background-color: #f0f2f5 !important;
}
.container {
  max-width: 1140px;
}

</style>