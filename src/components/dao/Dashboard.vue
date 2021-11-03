<template>
  <div class="container mb-2">
    <div class="row">
      <div class="col-12 col-md-6 col-lg-4 mb-4">
        <div class="card text-start w-auto p-2" style="width: 18rem">
          <div class="card-body">
            <h5 class="text-center text-muted mb-0">{{ t("default.treasury") }}</h5>
            <h2 class="text-center">
              ≈ <NumberFormatter :amount="dao.treasury.near"/> <span title="NEAR">Ⓝ</span>
            </h2>
          </div>
        </div>
      </div>
      <div class="col-12 col-md-6 col-lg-4 mb-4">
        <div class="card text-start w-auto p-2" style="width: 18rem">
          <div class="card-body text-center">
            <h5 class="text-muted mb-0">{{ t("default.my_share") }}</h5>
            <h2 class="mb-0">
              <NumberFormatter :amount="myTokensAmount"/>
            </h2>
            <h5 v-if="myTokensAmount" class="text-muted">≈ <NumberFormatter :amount="myTokensShare"/>%</h5>
          </div>
        </div>
      </div>
      <div class="col-12 col-md-6 col-lg-4 mb-4">
        <div class="card text-start w-auto p-2" style="width: 18rem">
          <div class="card-body text-center">
            <h5 class="text-muted">{{ t("default.activity") }}</h5>
            <ul class="list-inline list-unstyled mb-0">
              <li class="list-inline-item me-3"><MDBIcon icon="vote-yea" size="2x"></MDBIcon><MDBBadge color="danger" pill notification>{{ dao.proposals.length }}</MDBBadge></li>
              <li class="list-inline-item ms-3"><MDBIcon icon="file-alt" size="2x"></MDBIcon><MDBBadge color="danger" pill notification>{{ dao.docs.files.length }}</MDBBadge></li>
            </ul>
          </div>
        </div>
      </div>
    </div>
    <hr/>
    <div class="row mt-2">
      <!-- Novy clen -->
      <div class="col-12 col-md-6 text-start">
        <h5 v-if="activeProposals.length > 0" >{{ t("default.active_proposals") }}</h5>
        <h6 v-else>{{ t("default.no_active_proposal") }}</h6>
      </div>
      <div v-for="(proposal, index) in activeProposals" :key="index" class="col-12 col-md-12 mb-4 mb-md-0">
        <section class="mb-4 text-start">
          <Proposal :proposal="proposal" :contractId="dao.wallet"/>
        </section>
      </div>
    </div>
  </div>
</template>

<script>
import { MDBIcon, MDBBadge } from 'mdb-vue-ui-kit'
import NumberFormatter from "@/components/NumberFormatter.vue"
import { useI18n } from "vue-i18n";
import Proposal from "@/components/dao/Proposal.vue"
import { transform } from '@/models/proposal';
import { toRefs } from "vue"
import _ from "lodash"
import Decimal from 'decimal.js'

export default {
  components: {
    MDBIcon, MDBBadge,
    NumberFormatter,
    Proposal
  },
  props: {
    dao: {
      type: Object,
      required: true,
    },
    accountId: {
      type: String,
      required: false,
    },
  },
  setup(props) {
    const { t, n } = useI18n();
    const { dao, accountId } = toRefs(props)
    const proposals = dao.value.proposals.map((proposal) => transform(proposal, dao.value.docs, dao.value.token_holders, dao.value.token_holded, accountId.value, t))
    return { t, n, proposals };
  },
  computed: {
    myTokensAmount() {
      return this.dao.token_holders[this.accountId]
    },
    myTokensShare() {
      return (this.dao.token_holded > 0) ? new Decimal(this.dao.token_holders[this.accountId] || 0).dividedBy(this.dao.token_holded).times(100).round().toNumber() : null
    },
    activeProposals() {
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