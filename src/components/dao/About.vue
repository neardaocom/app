<template>
  <div class="container mb-2">
    <div class="row">
      <div class="col-12 col-md-6 col-lg-4 mb-4">
        <div class="card text-start w-auto p-2" style="width: 18rem">
          <div class="card-body">
            <ul class="list-unstyled text-muted mb-1">
              <li v-if="dao.address">
                <i class="fas fa-home fa-fw me-3 mb-3"></i>
                <a class="text-reset font-weight-bold" href="">{{ dao.address }}</a>
              </li>
              <li>
                <i class="fas fa-wallet fa-fw me-3 mb-3"></i>
                <a
                  class="text-reset font-weight-bold"
                  :href="nearWalletUrl + '/accounts/' + dao.wallet"
                  target="_blank"
                  >{{ t("default.wallet") }}</a
                >
              </li>
              <li v-if="dao.web">
                <i class="fas fa-globe fa-fw me-3 mb-3"></i
                ><a class="text-reset font-weight-bold" :href="dao.web">{{ dao.domain }}</a>
              </li>
              <li>
                <i class="fas fa-money-bill-wave-alt fa-fw me-3 mb-3"></i>
                <span class="text-reset font-weight-bold">{{ n(dao.token) }}</span> {{ dao.token_name }}
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div class="col-12 col-md-6 col-lg-4 mb-4">
        <div class="card text-start w-auto p-2" style="width: 18rem">
          <div class="card-body">
            <ul class="list-unstyled text-muted mb-1">
              <li>
                <i class="fas fa-users fa-fw me-3 mb-3"></i
                ><strong>{{ t("default.council") }}</strong>
                {{ dao.groups.council.amount || "0" }}% |
                <strong>{{ t("default.community") }}</strong>
                {{ dao.groups.public.amount || "0" }}%
              </li>
              <li v-if="false">
                <i class="fas fa-chart-line fa-fw me-3 mb-3"></i
                ><strong>{{ t("default.investor") }}</strong>
                {{ dao.groups.foundation.amount || "0" }}% |
                <strong>{{ t("default.public_sale") }}</strong>
                {{ dao.groups.public.amount || "0" }}%
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div class="col-12 col-md-6 col-lg-4 mb-4">
        <div class="card text-start w-auto p-2" style="width: 18rem">
          <div class="card-body">
            <h6 class="text-muted text-center">{{ t("default.council") }}</h6>
            <ul class="mb-0">
              <li v-for="(council, index) in dao.groups.council.wallets" :key="index">{{ council }}</li>
            </ul>
          </div>
        </div>
      </div>
      <!-- BEGIN: council unlocking cashflow -->
      <div class="col-12 col-md-6 mb-4">
        <div class="card text-start w-auto p-2" style="width: 18rem">
          <div class="card-body">
            <h6 class="text-muted text-center">{{ t("default.council_unlocking_token") }}</h6>
            <ChartCouncilUnlocking :dao="dao"/>
          </div>
        </div>
      </div>
      <!-- END: council unlocking cashflow -->
    </div>
  </div>
</template>

<script>
//import NumberFormatter from "@/components/NumberFormatter.vue"
import { useI18n } from "vue-i18n";
import ChartCouncilUnlocking from '@/components/dao/ChartCouncilUnlocking.vue';
//import Proposal from "@/components/dao/Proposal.vue"
//import { transform } from '@/models/proposal';
//import { toRefs } from "vue"
//import _ from "lodash"

export default {
  components: {
    ChartCouncilUnlocking
    //MDBProgress, MDBProgressBar,
    //NumberFormatter,
    //Proposal
  },
  props: {
    dao: {
      type: Object,
      required: true,
    },
  },
  computed: {
    nearWalletUrl() {
      return this.$store.getters['near/getWalletUrl']
    },
  },
  setup() {
    const { t, n } = useI18n();
    return { t, n};
  },
};
</script>