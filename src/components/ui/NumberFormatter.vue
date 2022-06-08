<template>
  <MDBTooltip v-model="tooltip" tag="a">
    <template #reference>
      <span>
        <template v-if="shortNumber !== null">{{shortNumber}}</template>
        <template v-else>—</template>
      </span>
    </template>
    <template #tip>
      {{fullNumber}}
    </template>
  </MDBTooltip>
</template>

<script>
  import { useI18n } from 'vue-i18n';
  import { toRefs, computed, ref } from "vue"
  import Decimal from "decimal.js"
  import loIsNil from "lodash/isNil";
  import { MDBTooltip } from "mdb-vue-ui-kit";
  import NumberHelper from "@/models/utils/NumberHelper"
  import LocaleHelper from "@/models/utils/LocaleHelper"


  export default {
    components: {
      MDBTooltip
    },
    props: {
      amount: {
        type: [Object, Number, String],
        required: false
      },
      digits: {
        type: Number,
        required: false,
        default: 2
      }
    },
    setup(props) {
      const { locale } = useI18n();
      const { amount, digits } = toRefs(props)
      const shortNumber = computed(() => loIsNil(amount.value) ? null : NumberHelper.numFormatter(new Decimal(amount.value).toNumber(), digits.value), locale.value)
      const fullNumber = computed(() => loIsNil(amount.value) ? null : LocaleHelper.stringNumberToLocale(new Decimal(amount.value).toFixed(), locale.value))

       const tooltip = ref(false);
      return {
        shortNumber, fullNumber, tooltip
      }
    }
  };
</script>

<style>

</style>