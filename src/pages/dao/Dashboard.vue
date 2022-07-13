<template>
  <div class="container mb-2">
    <DashboardOverview :nearPrice="nearPriceUsd" />
    <div class="row mb-4">
      <div class="col-12 col-md-6 mb-4">
        <About />
      </div>
      <div v-if="isDaoMember" class="col-12 col-md-6 mb-4">
        <Governance />
      </div>
      <div v-if="isDaoMember" class="col-12 col-md-4 mb-4">
        <Rewards />
      </div>
      <div v-if="false" class="col-12 col-md-6 mb-4">
        <ActiveProposals />
      </div>
      <Bounty/>
      <SkywardFinance v-if="skywardSaleIds.length > 0" :scenario="'active'" />
    </div> 


    <!-- Active proposals -->
    <div v-if="proposals.length > 0">
      <h5 class="text-start">{{t('active_proposals')}}</h5>
      <div class="col-6 col-md-4 col-lg-3">
        <Search v-model="searchQuery" />
      </div>

      <div class="row mt-3">
        <div v-for="(proposal) in filteredProposals" :key="proposal.id" class="col-12 col-md-6 mb-4 mb-md-0">
          <section class="mb-4 text-start">
            <Proposal :proposal="proposal" :contractId="dao.wallet" @openResource="open" :fileLoading="fileLoading"/>
          </section>
        </div>
      </div>
      <ModalDocument :show="modalDocument" :doc="selectedDoc" :data="docData"/>
    </div>
      
  </div>
</template>

<script>
import SkywardFinance from "@/components/dao/dashboard/SkywardFinance.vue";
import About from "@/components/dao/dashboard/About.vue";
import Bounty from "@/components/dao/dashboard/Bounty.vue";
import Governance from "@/components/dao/dashboard/Governance.vue";
import { useI18n } from "vue-i18n";
import { computed, inject, ref } from "vue"
import DashboardOverview from '../../components/dao/dashboard/DashboardOverview.vue'
import ActiveProposals from '@/components/dao/dashboard/ActiveProposals.vue'
import Rewards from '@/components/dao/dashboard/Rewards.vue';
import { useNearPrice } from '@/hooks/market';
import DaoHelper from '@/models/dao/DaoHelper';
import Search from "@/components/ui/Search.vue";
import Proposal from "@/components/dao/Proposal.vue"
import ModalDocument from './modals/ModalDocument.vue'
import { useList } from '@/hooks/proposal';
import { useResourceOpening } from '@/hooks/docs';
import StringHelper from '@/models/utils/StringHelper';

export default {
  components: {
    About,
    SkywardFinance, Bounty,
    DashboardOverview,
    Governance,
    ActiveProposals,
    Rewards,
    Search,
    ModalDocument,
    Proposal
  },
  props: {
  },
  setup() {
    const { t, n } = useI18n();
    const dao = inject('dao')
    const loader = inject('loader')
    const wallet = inject('wallet')
    const walletRights = inject('walletRights')
    const templateMeta = inject('templateMeta')
    const isDaoMember = inject('isDaoMember')
    const skywardSaleIds = ref(DaoHelper.storageGetValues(dao.value.storage, 'skyward1', 'skyward_auction_id'))
    const { nearPriceUsd } = useNearPrice()

    const ipfsService = loader.value.load('services/ipfs')

    const { activeProposals } = useList(dao, templateMeta, wallet, walletRights, loader)

    const proposals = activeProposals()

    const {fileLoading, selectedDoc, docData, modalDocument, open} = useResourceOpening(ipfsService, dao)

    const searchQuery = ref('')
 
    const searchText = computed(() => StringHelper.toSearch(searchQuery.value))
    
    const filteredProposals = computed(() => {
      const result = proposals
      if (searchText.value.length > 2) {
        return result.filter(item => item.search.includes(searchText.value))
      }
      return result
    } )


    return {
      t, n,
      dao,
      skywardSaleIds,
      nearPriceUsd,
      isDaoMember, 
      proposals,
      fileLoading, selectedDoc, docData, modalDocument, open,
      searchQuery, 
      filteredProposals
    };
  },
};
</script>