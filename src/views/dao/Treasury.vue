<template>
  <div class="container mb-2">
    <div class="row">
      <div class="col-3">
        <div class="card text-start w-auto p-2" style="width: 18rem">
          <div class="card-body">
            <h2>
              {{ n(dao.treasury.near) || "-" }} <span title="NEAR">Ⓝ </span>
              <BadgePercent :amount="dao.treasury.w_delta" />
            </h2>
            <p>
              ≈ <NumberFormatter :amount="dao.treasury.currency_amount" />
              {{ t("default.currency_" + dao.treasury.currency) }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// import { MDBProgress, MDBProgressBar } from 'mdb-vue-ui-kit'
import NumberFormatter from "@/views/helpers/NumberFormatter.vue";
import { useI18n } from "vue-i18n";

export default {
  components: {
    NumberFormatter,
  },
  props: {
    dao: {
      type: Object,
      required: true,
    },
  },
  setup() {
    const { t, n } = useI18n();
    return { t, n };
  },
};
</script>