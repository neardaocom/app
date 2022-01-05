<template>
  <div class="container mb-2">
    <div class="row">
      <div class="col-12 col-md-6 col-lg-4 mb-4">
        <div class="card text-start w-auto p-2" style="width: 18rem">
          <div class="card-body">
            <h5 class="text-center text-muted mb-0">{{ t("default.dao_funds") }}</h5>
            <h2 v-if="nearPrice" class="text-center">
              <NumberFormatter :amount="dao.treasury.near * nearPrice"/> <small class="text-muted">USD</small>
            </h2>
            <h2 v-else class="text-center">
              <NumberFormatter :amount="dao.treasury.near"/> <small class="text-muted">Ⓝ</small>
            </h2>
            <hr/>
            <h5 v-if="false" class="text-center text-muted mb-1">{{ t("default.treasury") }}</h5>
            <h5 v-if="nearPrice" class="text-center">
              <NumberFormatter :amount="dao.treasury.near"/> <small class="text-muted">Ⓝ</small>
            </h5>
            <h5 class="text-center">
              <NumberFormatter :amount="dao.token_stats.public.free"/> <small class="text-muted">{{ dao.token_name }}</small>
            </h5>
            <h5 v-if="false && token_public_to_unlock" class="text-center text-muted">
              <NumberFormatter :amount="token_public_to_unlock"/>
            </h5>
          </div>
        </div>
      </div>
      <div class="col-12 col-md-6 col-lg-4 mb-4">
        <div class="card text-start w-auto p-2" style="width: 18rem">
          <div class="card-body text-center">
            <h5 class="text-muted mb-0">{{ t("default.my_share") }}</h5>
            <h2 class="mb-0">
              <NumberFormatter :amount="myTokensShare"/><small class="text-muted">%</small>
            </h2>
            <h5 v-if="false && myTokensAmount" class="text-muted">
              <NumberFormatter :amount="myTokensAmount"/> <small class="text-muted">{{ dao.token_name }}</small>
            </h5>
            <h5 v-if="false && token_council_to_unlock != null && isCouncil === true" class="text-center text-muted">
              +<NumberFormatter :amount="token_council_to_unlock"/>
            </h5>
          </div>
        </div>
      </div>
      <div class="col-12 col-md-6 col-lg-4 mb-4">
        <div class="card text-start w-auto p-2" style="width: 18rem">
          <div class="card-body text-center">
            <h5 class="text-muted">{{ t("default.activity") }}</h5>
            <ul class="list-inline list-unstyled mb-0">
              <li class="list-inline-item me-3">
                <router-link :to="{ name: 'dao', params: {id: dao.wallet}, query: {page: 'voting' }}" class="text-reset">
                  <MDBIcon icon="vote-yea" size="2x"></MDBIcon><MDBBadge color="danger" pill notification>{{ dao.proposals.length }}</MDBBadge>
                </router-link>
              </li>
              <li class="list-inline-item ms-3">
                <router-link :to="{ name: 'dao', params: {id: dao.wallet}, query: {page: 'documents' }}" class="text-reset">
                  <MDBIcon icon="file-alt" size="2x"></MDBIcon><MDBBadge color="danger" pill notification>{{ dao.docs.files.length }}</MDBBadge>
                </router-link>
              </li>
            </ul>
          </div>
        </div>
      </div>
       <div v-if="refFinanceFounds" class="col-12 col-md-6 col-lg-4 mb-4">
        <div class="card text-start w-auto p-2" style="width: 18rem">
          <div class="card-body text-center">
            <h5 class="text-muted">{{ t("default.ref_finance_funds") }}</h5>
            <h2 v-if="nearPrice" class="text-center"> 
              <NumberFormatter :amount="refFinanceNear * nearPrice" /> <small class="text-muted">USD</small>
            </h2>
            <h2 v-else class="text-center">
              <NumberFormatter :amount="refFinanceNear" /> <small class="text-muted">Ⓝ</small>
            </h2>
            <hr/>
            <h5 v-if="false" class="text-center text-muted mb-1">{{ t("default.treasury") }}</h5>
            <h5 v-if="nearPrice && refFinanceNear" class="text-center">
              <NumberFormatter :amount="refFinanceNear" /> <small class="text-muted">Ⓝ</small>
            </h5>
            <h5 v-if="refFinanceFounds[dao.wallet]" class="text-center">
              <NumberFormatter :amount="refFinanceDaoToken" /> <small class="text-muted">{{ dao.token_name }}</small>
            </h5>
            <hr/>
              <div v-if="refFinanceFounds['wrap.testnet'] && refFinanceFounds[dao.wallet]" class="d-flex justify-content-center align-self-end">
                <MDBBtn @click="modalRefWithdrawNearOpen" color="primary">{{t('default.withdraw')}} Ⓝ</MDBBtn>
                <MDBBtn @click="modalRefWithdrawDaoTokenOpen" color="primary">{{`${t('default.withdraw')} ${dao.token_name}`}}</MDBBtn>
                <ModalRefWithdrawNear :show="modalRefWithdrawNear" :contractId="dao.wallet" :balance="refFinanceNear"  />
                <ModalRefWithdrawDaoToken :show="modalRefWithdrawDaoToken" :contractId="dao.wallet" :balance="refFinanceDaoToken"  :tokenDecimals="dao.token_stats.decimals" />
              </div>  
          </div>
        </div>
      </div>
    </div> 
    <AuctionList
      :scenario="'active'"
      :dao="dao"
      :nearService="nearService"
    />
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
import { MDBIcon, MDBBadge, MDBBtn } from 'mdb-vue-ui-kit'
import NumberFormatter from "@/components/NumberFormatter.vue"
import AuctionList from "@/components/dao/AuctionList.vue"
import SalesList from "@/components/dao/SalesList.vue"
import { useI18n } from "vue-i18n";
import Proposal from "@/components/dao/Proposal.vue"
import { transform } from '@/models/proposal';
import Analytics from "@/models/analytics"
import { ref, toRefs, onMounted, onUnmounted, computed } from "vue"
import { useStore } from 'vuex'
import _ from "lodash"
import Decimal from 'decimal.js'
import { nowToSeconds } from '@/utils/date';
import { RefFinanceService } from '@/services/refFinanceService'
import ModalRefWithdrawDaoToken from '@/components/dao/ModalRefWithdrawDaoToken.vue'
import ModalRefWithdrawNear from '@/components/dao/ModalRefWithdrawNear.vue'
import { yoctoNear } from '@/services/nearService'

export default {
  components: {
    MDBIcon, MDBBadge, MDBBtn,
    NumberFormatter,
    Proposal, AuctionList,
    SalesList, ModalRefWithdrawDaoToken,
    ModalRefWithdrawNear
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

    // council
    const token_council_interval = ref(null);
    const token_council_to_unlock = ref(null)
    const token_council_step = ref(Analytics.getInterval(Analytics.parseAlgorithm(dao.value.token_stats.council.algorithm)))
    const token_council_counter = () => {
      const unlocking = Analytics.computeUnlocking(
          Analytics.parseAlgorithm(dao.value.token_stats.council.algorithm),
          nowToSeconds(),
          dao.value.token_stats.council
      )
      //console.log(unlocking)
      token_council_to_unlock.value = new Decimal(unlocking).minus(dao.value.token_stats.council.distributed).div(dao.value.groups.council.wallets.length).round().toNumber()
    }
    if (dao.value.token_stats.council.algorithm !== "None") {
      token_council_to_unlock.value = new Decimal(Analytics.computeUnlocking(
        Analytics.parseAlgorithm(dao.value.token_stats.council.algorithm),
        nowToSeconds(),
        dao.value.token_stats.council
      )).minus(dao.value.token_stats.council.distributed).div(dao.value.groups.council.wallets.length).round().toNumber()
    }

    // public
    const token_public_interval = ref(null);
    const token_public_to_unlock = ref(null)
    const token_public_step = ref(Analytics.getInterval(Analytics.parseAlgorithm(dao.value.token_stats.public.algorithm)))
    const token_public_counter = () => {
      const unlocking = Analytics.computeUnlocking(
          Analytics.parseAlgorithm(dao.value.token_stats.public.algorithm),
          nowToSeconds(),
          dao.value.token_stats.public
      )
      // console.log(unlocking)
      token_public_to_unlock.value = new Decimal(unlocking).minus(dao.value.token_stats.public.unlocked).toNumber()
    }
    if (dao.value.token_stats.public.algorithm !== "None") {
      token_public_to_unlock.value = new Decimal(Analytics.computeUnlocking(
        Analytics.parseAlgorithm(dao.value.token_stats.public.algorithm),
        nowToSeconds(),
        dao.value.token_stats.public
      )).minus(dao.value.token_stats.public.unlocked).toNumber()
    }

    onMounted(() => {
      //console.log(token_council_step.value, token_public_step.value)
      token_council_interval.value = setInterval(token_council_counter, token_council_step.value)
      token_public_interval.value = setInterval(token_public_counter, token_public_step.value)
      //console.log('mounted')
    })

    onUnmounted(() => {
      clearInterval(token_council_interval.value)
      clearInterval(token_public_interval.value)
      //console.log('unmounted')
    })

    // refFinance deposits
    const refFinance = ref(null)
    const refFinanceFounds = ref(null)

    const refFinanceFetchFounds = () => {
      refFinance.value.contract.get_deposits({"account_id": dao.value.wallet}).then( deposits => {
        if(Object.keys(deposits).length !== 0){
          refFinanceFounds.value = deposits
        }
      })
    }

    onMounted(() => {
      nearService.value.getNear().account(dao.value.wallet).then( account => {
          refFinance.value = new RefFinanceService(account, 'pstu.testnet') // TODO: Move to config
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
      , token_council_interval, token_council_to_unlock, token_council_step, token_council_counter
      , token_public_interval, token_public_to_unlock, token_public_step, token_public_counter
      , nearService, refFinanceFounds, modalRefWithdrawDaoToken, modalRefWithdrawNear,
      modalRefWithdrawDaoTokenOpen, modalRefWithdrawNearOpen
    };
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
    isCouncil() {
      return this.dao.groups.council.wallets.includes(this.accountId)
    },
    nearPrice() {
      return this.$root.near_price
    },
    refFinanceNear(){
      return new Decimal(+this.refFinanceFounds['wrap.testnet'] || 0).dividedBy(yoctoNear).toNumber() // TODO: wrap.testnet move to config -->
    },
    refFinanceDaoToken(){
      return new Decimal(+this.refFinanceFounds[this.dao.wallet] || 0).dividedBy(10 ** this.dao.token_stats.decimals).toNumber()
    }
  },
};
</script>