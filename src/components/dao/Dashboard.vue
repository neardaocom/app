<template>
  <div class="container mb-2">
    <div class="row">
      <div class="col-12 col-md-6 col-lg-4 mb-4">
        <About :dao="dao" />
      </div>
      <div class="col-12 col-md-6 col-lg-4 mb-4">
        <Treasury :dao="dao" :nearPrice="nearPrice" />
      </div>
      <div class="col-12 col-md-6 col-lg-4 mb-4">
        <Share :dao="dao" :accountId="accountId" />
      </div>
      <div class="col-12 col-md-6 col-lg-4 mb-4">
        <Activity :dao="dao" />
      </div>
      <SkywardFinance :dao="dao" :scenario="'active'" />
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
import SkywardFinance from "@/components/dao/dashboard/SkywardFinance.vue";
import About from "@/components/dao/dashboard/About.vue";
import Treasury from "@/components/dao/dashboard/Treasury.vue";
import Share from "@/components/dao/dashboard/Share.vue";
import Activity from "@/components/dao/dashboard/Activity.vue";
import { useI18n } from "vue-i18n";
import Proposal from "@/components/dao/Proposal.vue"
import { transform } from '@/models/proposal';
import { toRefs } from "vue"
import _ from "lodash"

export default {
  components: {
    Proposal,
    About,
    SkywardFinance, Treasury, Share, Activity,
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
    const { t, n, d } = useI18n();
    const { dao, accountId } = toRefs(props)

    // proposals
    const proposals = dao.value.proposals.map((proposal) => transform(proposal, dao.value.vote_policies, dao.value.docs, dao.value.token_holders, dao.value.token_holded, accountId.value, t, d))

    return {
      t, n, proposals
    };
  },
  computed: {
    activeProposals() {
      let results = this.proposals
      // filter
      results = results.filter(item => _.intersection([item.stateIndex], ['in_progress']).length > 0)
      // order
      results = _.orderBy(results, ['id'], ['asc'])

      return results
    },
    
    nearPrice() {
      return this.$root.near_price
    },
  },
};
</script>