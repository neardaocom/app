<template>
  <div class="container mb-2">
    <DashboardOverview :dao="dao" :nearPrice="nearPrice" />
    <div class="row">
      <div class="col-12 col-md-6 col-lg-4 mb-4">
        <About :dao="dao" />
      </div>
      <div class="col-12 col-md-6 col-lg-4 mb-4">
        <Share :dao="dao" :walletId="walletId" />
      </div>
      <Bounty :dao="dao" />
      <SkywardFinance v-if="skywardSaleIds.length > 0" :dao="dao" :scenario="'active'" :salesIds="skywardSaleIds" />
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
import Share from "@/components/dao/dashboard/Share.vue";
import Bounty from "@/components/dao/dashboard/Bounty.vue";
import { useI18n } from "vue-i18n";
import Proposal from "@/components/dao/Proposal.vue"
import { transform } from '@/models/proposal';
import Auction from '@/models/auction';
import { toRefs, ref } from "vue"
import _ from "lodash"
import loFind from "lodash/find"
import DashboardOverview from '../../components/dao/dashboard/DashboardOverview.vue'

export default {
  components: {
    Proposal,
    About,
    SkywardFinance, Share, Bounty,
    DashboardOverview,
  },
  props: {
    dao: {
      type: Object,
      required: true,
    },
    walletId: {
      type: String,
      required: false,
    },
    walletRights: {
      type: Object,
      required: true,
    },
    daoRights: {
      type: Object,
      required: true,
    },
  },
  setup(props) {
    const { t, n, d } = useI18n();
    const { dao, walletId, walletRights, daoRights } = toRefs(props)

    const skywardSaleIds = ref(Auction.getSkywardSaleIds(dao.value.storage))
    // console.log(dao, walletId, walletRights, daoRights, d)
    // proposals
    const proposals = dao.value.proposals.map((proposal) => {
      return transform(proposal, loFind(dao.value.templates, {id: proposal.templateId}), dao.value.tokenHolders, dao.value.treasury.token.holded, walletId.value, walletRights.value, daoRights.value, t, d, n)
    })
    // const proposals = []

    return {
      t, n, proposals, skywardSaleIds
    };
  },
  computed: {
    activeProposals() {
      let results = this.proposals
      // filter
      results = results.filter(item => _.intersection([item.stateCode], ['in_progress']).length > 0)
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