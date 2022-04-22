<template>
  <span v-if="amount !== undefined && amount !== null">{{ n(number) }}</span>
  <span v-else>—</span>
</template>

<script>
  import { useI18n } from 'vue-i18n';
  import { toRefs, computed } from "vue"

  export default {
    props: {
      amount: {
        type: [Object, Number],
        required: false
      }
    },
    setup(props) {
      const { n } = useI18n();
      const { amount } = toRefs(props)
      const number = computed(() => typeof amount.value === "number" && amount.value !== undefined ? amount.value : amount.value?.toNumber() )
      return {
        n, number
      }
    }
  };
</script>

<style>

</style>