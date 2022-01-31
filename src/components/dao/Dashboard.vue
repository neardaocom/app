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

      <div v-if="refFinanceFounds" class="col-12 col-md-6 col-lg-4 mb-4">
        <div class="card text-start w-auto p-2" style="width: 18rem">
          <div class="card-body text-center">
            <h5 class="text-muted">{{ t("default.ref_finance_funds") }}</h5>
            <hr/>
            <h5 v-if="nearPrice && refFinanceFounds[tokenId]" class="text-center">
              <NumberFormatter :amount="refFinanceNear" /> <small class="text-muted">{{tokenSymbol}}</small>
            </h5>
            <h5 v-if="refFinanceFounds[dao.wallet]" class="text-center">
              <NumberFormatter :amount="refFinanceDaoToken" /> <small class="text-muted">{{ dao.token_name }}</small>
            </h5>
            <hr/>
              <div v-if="refFinanceFounds[tokenId] && refFinanceFounds[dao.wallet]" class="d-flex justify-content-center align-self-end">
                <MDBBtn @click="modalRefWithdrawNearOpen" color="primary">{{`${t('default.withdraw')} ${tokenSymbol}`}}</MDBBtn>
                <MDBBtn @click="modalRefWithdrawDaoTokenOpen" color="primary">{{`${t('default.withdraw')} ${dao.token_name}`}}</MDBBtn>
                <ModalRefWithdrawNear :show="modalRefWithdrawNear" :contractId="dao.wallet" :balance="refFinanceNear" :tokenId="tokenId" :tokenDecimals="tokenDecimals" :tokenSymbol="tokenSymbol" />
                <ModalRefWithdrawDaoToken :show="modalRefWithdrawDaoToken" :contractId="dao.wallet" :balance="refFinanceDaoToken" :tokenId="dao.wallet" :tokenDecimals="dao.token_stats.decimals" :tokenSymbol="dao.token_name" />
              </div>  
          </div>
        </div>
      </div>
    </div>
    <SalesList
      :dao="dao"
      :nearService="nearService"
    />
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
import { MDBBtn } from 'mdb-vue-ui-kit'
import NumberFormatter from "@/components/NumberFormatter.vue"
import SkywardFinance from "@/components/dao/dashboard/SkywardFinance.vue";
import About from "@/components/dao/dashboard/About.vue";
import Treasury from "@/components/dao/dashboard/Treasury.vue";
import Share from "@/components/dao/dashboard/Share.vue";
import Activity from "@/components/dao/dashboard/Activity.vue";
import SalesList from "@/components/dao/SalesList.vue"
import { useI18n } from "vue-i18n";
import Proposal from "@/components/dao/Proposal.vue"
import { transform } from '@/models/proposal';
import { ref, toRefs, onMounted, computed } from "vue"
import { useStore } from 'vuex'
import _ from "lodash"
import Decimal from 'decimal.js'
import { RefFinanceService } from '@/services/refFinanceService'
import ModalRefWithdrawDaoToken from '@/components/dao/ModalRefWithdrawDaoToken.vue'
import ModalRefWithdrawNear from '@/components/dao/ModalRefWithdrawNear.vue'
import { GeneralTokenService } from '@/services/generalTokenService';

export default {
  components: {
    MDBBtn,
    NumberFormatter,
    Proposal,
    About,
    SalesList, ModalRefWithdrawDaoToken,
    ModalRefWithdrawNear, SkywardFinance, Treasury, Share, Activity,
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
    const { t, n, d} = useI18n();
    const { dao, accountId } = toRefs(props)
    const proposals = dao.value.proposals.map((proposal) => transform(proposal, dao.value.vote_policies, dao.value.docs, dao.value.token_holders, dao.value.token_holded, accountId.value, t, d))
    const store = useStore()
    const nearService = computed(() => store.getters['near/getService'])

    // refFinance deposits
    const refFinance = ref(null)
    const refFinanceFounds = ref(null)
    const nearAccount = ref(null)
    const tokenMetadata = ref(null)
    const tokenId = ref('')

    const refFinanceFetchFounds = () => {
      refFinance.value.getDeposits(dao.value.wallet).then( deposits => {
        if(Object.keys(deposits).length !== 0){
          Object.entries(deposits).forEach( async ([key]) => {
            if (key !== dao.value.wallet){
              tokenId.value = key
              const generalTokenService = new GeneralTokenService(nearAccount.value, key)
              tokenMetadata.value =  await generalTokenService.getFtMetadata()
            }
          })
          refFinanceFounds.value = deposits
        }
      })


    }

    onMounted(() => {
      nearService.value.getNear().account(dao.value.wallet).then( account => {
          nearAccount.value = account
          refFinance.value = new RefFinanceService(account, window.process.env.VUE_APP_REF_FINANCE_CONTRACT)
          refFinanceFetchFounds()
      })
    })

    // modals
    const modalRefWithdrawDaoToken = ref(0)
    const modalRefWithdrawNear = ref(0)

    const modalRefWithdrawDaoTokenOpen = () => {
        modalRefWithdrawDaoToken.value += 1
    }
    const modalRefWithdrawNearOpen = () => {
        modalRefWithdrawNear.value += 1
    }

    return { t, n, proposals
      , nearService, refFinanceFounds, modalRefWithdrawDaoToken, modalRefWithdrawNear, tokenId
      , tokenMetadata,  modalRefWithdrawDaoTokenOpen, modalRefWithdrawNearOpen
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
    refFinanceNear(){
      return new Decimal(+this.refFinanceFounds[this.tokenId] || 0).dividedBy(10 ** this.tokenDecimals ).toNumber()
    },
    refFinanceDaoToken(){
      return new Decimal(+this.refFinanceFounds[this.dao.wallet] || 0).dividedBy(10 ** this.dao.token_stats.decimals).toNumber()
    },
    tokenSymbol(){
      return this.tokenMetadata ? this.tokenMetadata.symbol : ''
    },
    tokenDecimals(){
      return this.tokenMetadata ? this.tokenMetadata.decimals : 0
    }
  },
};
</script>