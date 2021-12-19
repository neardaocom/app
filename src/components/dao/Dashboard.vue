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
    <AuctionList
      :scenario="'active'"
      :dao="dao"
      :nearService="nearService"
    />
  </div>
</template>

<script>
import { MDBIcon, MDBBadge } from 'mdb-vue-ui-kit'
import NumberFormatter from "@/components/NumberFormatter.vue"
import AuctionList from "@/components/dao/AuctionList.vue"
import { useI18n } from "vue-i18n";
import Proposal from "@/components/dao/Proposal.vue"
import { transform } from '@/models/proposal';
import Analytics from "@/models/analytics"
import { ref, toRefs, onMounted, onUnmounted } from "vue"
import _ from "lodash"
import Decimal from 'decimal.js'
import { nowToSeconds } from '@/utils/date';

export default {
  components: {
    MDBIcon, MDBBadge,
    NumberFormatter,
    Proposal, AuctionList,
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

    return { t, n, proposals
      , token_council_interval, token_council_to_unlock, token_council_step, token_council_counter
      , token_public_interval, token_public_to_unlock, token_public_step, token_public_counter
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
    nearService() {
      return this.$store.getters['near/getService']
    },
  },
};
</script>