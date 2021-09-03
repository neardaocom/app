<template>
  <span v-if="amount != undefined">{{ n(amount) }}</span>
  <span v-else>—</span>
</template>

<script>
  import { useI18n } from 'vue-i18n';

  export default {
    props: {
      amount: {
        type: Number,
        required: false
      }
    },
    setup() {
      const { n } = useI18n();
      return {
        n
      }
    }
  };
</script>

<style>

</style>