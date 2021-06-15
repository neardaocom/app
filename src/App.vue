<template>
  <div id="nav">
    <MDBBtnGroup aria-label="Basic example">
      <router-link to="/" :class="['btn','btn-primary']">Home</router-link>
      <router-link to="/about" :class="['btn','btn-primary']">About</router-link>
    </MDBBtnGroup>
  </div>
  <router-view/>
</template>

<script>
  import { MDBBtnGroup } from 'mdb-vue-ui-kit';

  export default {
    components: {
      MDBBtnGroup,
    },
  };
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  padding: 30px;
}

</style>
