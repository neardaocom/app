<template>
  <span>
    <template v-if="number !== null">
      <template v-if="number > 0.0009">{{ n(number) }}</template>
      <template v-else>{{number}}</template>
    </template>
    <template v-else>—</template>
  </span>
</template>

<script>
  import { useI18n } from 'vue-i18n';
  import { toRefs, computed } from "vue"
  import Decimal from "decimal.js"
  import loIsNil from "lodash/isNil";

  export default {
    props: {
      amount: {
        type: [Object, Number, String],
        required: false
      }
    },
    setup(props) {
      const { n } = useI18n();
      const { amount } = toRefs(props)
      const number = computed(() => loIsNil(amount.value) ? null : new Decimal(amount.value).toNumber() )
      return {
        n, number
      }
    }
  };
</script>

<style>

</style>