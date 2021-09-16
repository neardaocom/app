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

.skeleton {
  display: inline-block;
  background-color: #b0c0c7;
  animation-name: shine;
  animation-duration: 2.4s;
  animation-iteration-count: infinite;
}

.skeleton-text {
  height: 16px;
  margin-bottom: 5px;
}

.skeleton-h1 {
  height: 48px;
  margin-bottom: 5px;
}

.skeleton-h2 {
  height: 36px;
  margin-bottom: 5px;
}

.skeleton-avatar {
  float: left;
  width: 48px;
  height: 48px;
  margin-right: 12px;
  margin-bottom: 5px;
}

@keyframes shine {
  0% { 
    opacity: 1;
  }
  50% {
    opacity: 0.35;
  }
  100% {
    opacity: 1;
  }
}

</style>