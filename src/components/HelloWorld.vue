<template>
  <div class="hello">
    <MDBContainer>
      <div
        class="d-flex justify-content-center align-items-center"
        style="height: 100vh"
      >
        <div class="text-center">
          <img
            class="mb-4"
            src="https://mdbootstrap.com/img/logo/mdb-transparent-250px.png"
            style="width: 250px; height: 90px"
          />
          <h5 class="mb-3">{{ msg }}</h5>
          <p class="mb-3">MDB Team</p>
          <p class="mt-5 mb-3">
            PS. We'll be releasing "How to build your first project with MDB 5
            Vue" tutorial soon. Make sure to join our newsletter not to miss it!
          </p>
          <a
            class="btn btn-primary btn-lg"
            href="https://mdbootstrap.com/newsletter/"
            target="_blank"
            role="button"
            >Join now</a
          >
        </div>
      </div>
    </MDBContainer>
  </div>
</template>

<script>
import { MDBContainer } from "mdb-vue-ui-kit";

export default {
  name: "HelloWorld",
  components: {
    MDBContainer
  },
  props: {
    msg: String
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped></style>
