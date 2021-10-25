<template>
  <div v-if="show" style="width: auto; margin-top: .25rem; font-size: .875rem; color: #f93154; margin-top: -1.0rem;">{{ getMessage }}</div>
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