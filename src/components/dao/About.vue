<template>
  <div class="container mb-2">
    <div class="row">
      <div class="col-6 col-md-6 col-lg-4">
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
      <div class="col-6 col-md-6 col-lg-4">
        <div class="card text-start w-auto p-2" style="width: 18rem">
          <div class="card-body">
            <ul class="list-unstyled text-muted mb-1">
              <li>
                <i class="fas fa-users fa-fw me-3 mb-3"></i
                ><strong>{{ t("default.council") }}</strong>
                {{ dao.groups.council.amount || "0" }}% |
                <strong>{{ t("default.community") }}</strong>
                {{ dao.groups.community.amount || "0" }}%
              </li>
              <li>
                <i class="fas fa-chart-line fa-fw me-3 mb-3"></i
                ><strong>{{ t("default.investor") }}</strong>
                {{ dao.groups.investor.amount || "0" }}% |
                <strong>{{ t("default.public_sale") }}</strong>
                {{ dao.groups.public_sale.amount || "0" }}%
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
    <hr/>
    <div class="row mt-2">
      <!-- Novy clen -->
      <div v-for="(proposal, index) in results" :key="index" class="col-12 col-md-12 mb-4 mb-md-0">
        <section class="mb-4 text-start">
          <Proposal :proposal="proposal" :contractId="dao.wallet"/>
        </section>
      </div>
      <div v-if="results.length == 0" class="col-12 col-md-12 mb-4 mb-md-0 text-center">
        <h5>{{ t("default.no_active_proposal") }}</h5>
      </div>
    </div>
  </div>
</template>

<script>
// import { MDBProgress, MDBProgressBar } from 'mdb-vue-ui-kit'
//import NumberFormatter from "@/components/NumberFormatter.vue"
import { useI18n } from "vue-i18n";
import Proposal from "@/components/dao/Proposal.vue"
import { transform } from '@/models/proposal';
import { toRefs } from "vue"
import _ from "lodash"

export default {
  components: {
    //MDBProgress, MDBProgressBar,
    //NumberFormatter,
    Proposal
  },
  props: {
    dao: {
      type: Object,
      required: true,
    },
    accountId: {
      type: String,
      required: true,
    },
  },
  setup(props) {
    const { t, n } = useI18n();
    const { dao, accountId } = toRefs(props)
    const proposals = dao.value.proposals.map((proposal) => transform(proposal, dao.value.docs, dao.value.token_holders, dao.value.token_holded, accountId.value, t))
    return { t, n, proposals };
  },
  computed: {
    results() {
      let results = this.proposals
      // filter
      results = results.filter(item => _.intersection([item.stateIndex], ['in_progress']).length > 0)
      // order
      results = _.orderBy(results, ['id'], ['asc'])

      return results
    },
  },
};
</script>