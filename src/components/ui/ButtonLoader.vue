<template>
   <MDBBtn :disabled="loading">
      <MDBSpinner v-show="loading" tag="span" size="sm" class="me-1" />
      <slot></slot>
   </MDBBtn>
</template>

<script>
import { MDBSpinner, MDBBtn } from "mdb-vue-ui-kit";
export default {
   components:{
      MDBSpinner,
      MDBBtn
   },
   props:{
      loading: {
         type: Boolean,
         reguired: true,
         default: false
      },
   },
   setup () {
      return {}
   }
}
</script>