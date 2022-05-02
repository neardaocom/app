<template>
  <div class="row">
    <div class="col-12">
      <div
        class="d-flex align-items-center justify-content-center"
        style="height: 350px;"
      >
        <MDBSpinner />
      </div>
    </div>
  </div>
</template>

<script>
import { MDBSpinner } from 'mdb-vue-ui-kit'
export default {
  components: {
    MDBSpinner
  },
  setup() {
  }
};
</script>