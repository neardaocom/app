<template>
  <div class="container mb-2">
    <DashboardOverview :nearPrice="nearPrice" />
    <div class="row mb-4">
      <div class="col-12 col-md-6 col-lg-5 mb-4">
        <About />
      </div>
      <div class="col-12 col-md-6 col-lg-5 mb-4">
        <GovernanceToken />
      </div>
      <div class="col-12 col-md-6 col-lg-5 mb-4">
        <Incentives />
      </div>
      <div class="col-12 col-md-6 col-lg-5 mb-4">
        <ActiveProposals />
      </div>
      <Bounty/>
      <SkywardFinance v-if="skywardSaleIds.length > 0" :scenario="'active'" :salesIds="skywardSaleIds" />
    </div> 

    <h5 class="text-start">{{t('default.dao_assets')}}</h5>
    <!-- <div class="row">
      <div class="col-12 col-md-6 col-lg-5 mb-4">
        <DaoAsset  :accountId="treasuryNear.asset.symbol" :amount="availableNearAmount" :suffix="treasuryNear.asset.symbol" :icon="treasuryNear.asset.icon" type="Token"/>
      </div>
      <div class="col-12 col-md-6 col-lg-5 mb-4">
        <DaoAsset  :accountId="treasuryToken.asset.accountId" :amount="availableTokenAmount" :suffix="treasuryToken.asset.symbol" :icon="treasuryToken.asset.icon" type="Token"/>
      </div>
      <div v-for="(ftAsset, index) in treasuryFtAssets" :key="index" class="col-12 col-md-6 col-lg-5 mb-4">
        <DaoAsset :accountId="ftAsset.asset.accountId" :amount="ftAsset.amount - ftAsset.amountLockedInLocks" :suffix="ftAsset.asset.symbol" :icon="ftAsset.asset.icon" type="Token"/>
      </div>
    </div> -->

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
import Bounty from "@/components/dao/dashboard/Bounty.vue";
import GovernanceToken from "@/components/dao/dashboard/GovernanceToken.vue";
import { useI18n } from "vue-i18n";
import Proposal from "@/components/dao/Proposal.vue"
import Auction from '@/models/auction';
import { inject, ref } from "vue"
import _ from "lodash"
// import loFind from "lodash/find"
import DashboardOverview from '../../components/dao/dashboard/DashboardOverview.vue'
import ActiveProposals from '@/components/dao/dashboard/ActiveProposals.vue'
// import DaoAsset from '@/components/dao/dashboard/DaoAsset.vue'
import Incentives from '@/components/dao/dashboard/Incentives.vue';
import { useAnalytics } from '@/hooks/treasury';



export default {
  components: {
    Proposal,
    About,
    SkywardFinance, Bounty,
    DashboardOverview,
    GovernanceToken,
    ActiveProposals,
    // DaoAsset,
    Incentives
  },
  props: {
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
  setup() {
    const { t, n } = useI18n();
    const dao = inject('dao')
    const loader = inject('loader')
    // const { walletId, walletRights, daoRights } = toRefs(props)
    const { dataLoaded, treasuryLocks, treasuryTotalAssets, treasuryNear, treasuryToken, treasuryFtAssets, availableNearAmount,  availableTokenAmount } = useAnalytics(dao, loader)
    const skywardSaleIds = ref(Auction.getSkywardSaleIds(dao.value.storage))
    // console.log(dao, walletId, walletRights, daoRights, d)
    // proposals
    const proposals = dao.value.proposals.map(() => {
      
      // return transform(proposal, loFind(dao.value.templates, {id: proposal.templateId}), dao.value.tokenHolders, dao.value.treasury.token.holded, walletId.value, walletRights.value, daoRights.value, t, d, n)
      return {}
    })
    // const proposals = []


    return {
      dao, t, n, proposals, skywardSaleIds,
      treasuryNear, availableNearAmount, treasuryFtAssets,
      treasuryToken, treasuryTotalAssets, treasuryLocks,
      dataLoaded, availableTokenAmount
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