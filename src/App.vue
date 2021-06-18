<template>
  <router-view/>
</template>

<script>
  export default {
    components: {
    },
    data() {
    },
    created() {
      this.$store.commit('accountLogin', 'petrfilla.near')
      console.log('count is: ' + this.$store.state.accountId) // => "count is: 1"
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

</style>