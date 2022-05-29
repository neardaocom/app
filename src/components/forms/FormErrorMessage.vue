<template>
  <div class="position-relative" v-show="show">
    <div class="position-absolute top-0 start-0 text-danger" style="width: auto; margin-top: -.75rem; font-size: .875rem">{{ getMessage }}</div>
  </div>
</template>

<script>
  import _ from "lodash";

  export default {
    props: {
      show: {
        type: Boolean,
        required: true
      },
      message: {
        type: String,
        required: false
      }
    },
    computed: {
      getMessage() {
        return _.toString(this.message)
      }
    }
  };
</script>