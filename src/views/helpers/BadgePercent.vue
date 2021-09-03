<template>
  <span class="badge bg-info" v-if="amount == undefined"> — %</span>
  <span class="badge bg-primary" v-else-if="amount > 0.0"><i class="fas fa-caret-up"></i> {{ n(amount) }} %</span>
  <span class="badge bg-danger" v-else-if="amount < 0.0"><i class="fas fa-caret-down"></i> {{ n(amount) }} %</span>
  <span class="badge bg-info" v-else><i class="fas fa-caret-right"></i> 0 %</span>
</template>

<script>
  import {useI18n} from 'vue-i18n';

  export default {
    props: {
      amount: {
        type: Number,
        required: false
      }
    },
    setup() {
      const {n} = useI18n();
      return {n}
    }
  };
</script>

<style>

</style>