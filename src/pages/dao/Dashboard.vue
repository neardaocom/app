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
        <Rewards />
      </div>
      <div class="col-12 col-md-6 col-lg-5 mb-4">
        <ActiveProposals />
      </div>
      <Bounty/>
      <SkywardFinance v-if="skywardSaleIds.length > 0" :scenario="'active'" :salesIds="skywardSaleIds" />
    </div> 

    <h5  class="text-start">{{t('default.dao_assets')}}</h5>
    <div  v-if="dataLoaded" class="row">
      <div class="col-12 col-md-6 col-lg-4 mb-4">
        <InfoAmountCard :amount="availableNearAmount" :suffix="treasuryNear.asset.symbol" :icon="treasuryNear.asset.icon"/>
      </div>
      <div class="col-12 col-md-6 col-lg-4 mb-4">
        <InfoAmountCard :amount="availableTokenAmount" :suffix="treasuryToken.asset.symbol" :icon="treasuryToken.asset.icon"/>
      </div>
      <div v-for="(ftAsset, index) in treasuryFtAssets" :key="index" class="col-12 col-md-6 col-lg-5 mb-4">
        <InfoAmountCard :amount="ftAsset.amount - ftAsset.amountLockedInLocks" :suffix="ftAsset.asset.symbol" :icon="ftAsset.asset.icon"/>
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
import Auction from '@/models/auction';
import { inject, ref } from "vue"
import DashboardOverview from '../../components/dao/dashboard/DashboardOverview.vue'
import ActiveProposals from '@/components/dao/dashboard/ActiveProposals.vue'
import InfoAmountCard from '@/components/ui/InfoAmountCard.vue'
import Rewards from '@/components/dao/dashboard/Rewards.vue';
import { useAnalytics } from '@/hooks/treasury';



export default {
  components: {
    About,
    SkywardFinance, Bounty,
    DashboardOverview,
    GovernanceToken,
    ActiveProposals,
    InfoAmountCard,
    Rewards
  },
  props: {
  },
  setup() {
    const { t, n } = useI18n();
    const dao = inject('dao')
    const loader = inject('loader')
    const { dataLoaded, treasuryLocks, treasuryTotalAssets, treasuryNear, treasuryToken, treasuryFtAssets, availableNearAmount,  availableTokenAmount } = useAnalytics(dao, loader)
    const skywardSaleIds = ref(Auction.getSkywardSaleIds(dao.value.storage))


    return {
      dao, t, n, skywardSaleIds,
      treasuryNear, availableNearAmount, treasuryFtAssets,
      treasuryToken, treasuryTotalAssets, treasuryLocks,
      dataLoaded, availableTokenAmount
    };
  },
  computed: {
    nearPrice() {
      return this.$root.near_price
    },
  },
};
</script>