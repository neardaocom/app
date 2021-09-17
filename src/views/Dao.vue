<template>
  <Header></Header>

  <main>
    <!-- dashboard -->
    <section class="bg-white shadow-2 mb-3">
      <div class="container">
        <!-- Breadcrumb -->
        <Breadcrumb :account="q_id" :list-router="'daos'" :list-name="'organizations'"/>
        <!-- /Breadcrumb -->
        <!-- Dashboard -->
        <Dashboard v-if="loaded === true" :dao="dao"/>
        <DashboardSkeleton v-else />

        <!-- /Dashboard -->
        <!-- Buttons -->
        <Buttons v-if="loaded" :dao="dao"/>
        <ButtonsSkeleton v-else />
        <!-- /Buttons -->
      </div>
    </section>

    <!-- Parts -->
    <section>
      <div class="container">
        <Overview v-if="loaded === true && this.$route.query.page === 'overview' && this.$route.query.page === undefined" :dao="dao"/>
        <Voting v-if="loaded === true && (this.$route.query.page === 'overview' || this.$route.query.page === undefined)" :dao="dao"/>
        <Voting v-if="loaded === true && this.$route.query.page === 'voting'" :dao="dao"/>
        <Treasury v-if="loaded === true && this.$route.query.page === 'treasury'" :dao="dao"/>
        <Members v-if="loaded === true && this.$route.query.page === 'members'" :dao="dao"/>
        <Tokens v-if="loaded === true && this.$route.query.page === 'tokens'" :dao="dao"/>
        <Organization v-if="loaded === true && this.$route.query.page === 'organization'" :dao="dao"/>
        <BodySkeleton v-if="loaded === false" />
      </div>
    </section>
    <!-- /Parts -->
  </main>

  <Footer></Footer>
</template>

<script>
import Header from '@/views/layout/Header.vue'
import Footer from '@/views/layout/Footer.vue'
import Dashboard from '@/views/dao/Dashboard.vue'
import DashboardSkeleton from '@/views/dao/DashboardSkeleton.vue'
import Buttons from '@/views/dao/Buttons.vue'
import ButtonsSkeleton from '@/views/dao/ButtonsSkeleton.vue'
import Overview from '@/views/dao/Overview.vue'
import Voting from '@/views/dao/Voting.vue'
import Treasury from '@/views/dao/Treasury.vue'
import Members from '@/views/dao/Members.vue'
import Tokens from '@/views/dao/Tokens.vue'
import Organization from '@/views/dao/Organization.vue'
import BodySkeleton from '@/views/dao/BodySkeleton.vue'
// import { MDBProgress, MDBProgressBar } from 'mdb-vue-ui-kit'
// MDBContainer, MDBTable, MDBBreadcrumb, MDBBreadcrumbItem, MDBInput, MDBBtn, MDBBtnGroup
import { useI18n } from 'vue-i18n'
import { ref, reactive } from 'vue'
import _ from 'lodash'
import Breadcrumb from '@/views/dao/Breadcrumb.vue'
import DAO from '@/types/DAO'
import DAOs from '@/types/DAOs'
import * as nearAPI from "near-api-js"

export default {
  components: {
    Header, Footer, Breadcrumb, Dashboard, Buttons, Overview, Voting, Treasury, Members, Tokens, Organization
    , DashboardSkeleton, ButtonsSkeleton, BodySkeleton
    // , MDBProgress, MDBProgressBar //MDBChart //, MDBContainer, MDBTable, MDBBreadcrumb, MDBBreadcrumbItem, MDBInput, MDBBtn, MDBBtnGroup
  },
  setup() {
    const { t } = useI18n()
    const daos = ref(DAOs.data().daos)
    const search = ref('')
    const filter = reactive({})
    const favorites = [1]
    const q_id = null
    const q_page = null
    const dao = ref(DAO.data)
    const dao_data = ref(DAO.data)
    const contract = null
    const proposals = null
    const statistics_ft = null
    const loaded = ref(false)

    return { t, dao, daos, q_id, q_page, search, filter, favorites, contract, proposals, statistics_ft, loaded, dao_data}
  },
  created() {
    // dao id
    if (this.$route.params && this.$route.params.id) {
      this.q_id = this.$route.params.id
      this.contract = new nearAPI.Contract(
          this.wallet.account(), this.q_id, {
            viewMethods: ['statistics_ft', 'statistics_members', 'registred_user_count', 'proposal', 'proposals', 'ft_balance_of', 'ft_total_supply', 'ft_metadata'],
            changeMethods: ['add_proposal', 'vote', 'finish_proposal'],
          }
        )
    } else {
      this.q_id = process.env.VUE_APP_DAO_DEFAULT
    }
    this.$store.commit('near/setContract', this.q_id)

    // page
    if (this.$route.query.page !== undefined) {
      this.q_page = this.$route.query.page
    } else {
      this.q_page = 'overview'
    }

    // dao
    this.dao.id = this.q_id
    this.dao.wallet = this.q_id
  },
  computed: {
    wallet() {
      return this.$store.getters['near/getWallet']
    },
    nearService() {
      return this.$store.getters['near/getService']
    },
  },
  mounted() {
    this.$store.commit('near/setContract', this.q_id)
    this.getState()
    //this.proposals = await this.contract.proposals(0, 100);
    //this.statistics_ft = await this.contract.statistics_ft();
  },
  methods: {
    getState() {
      console.log('getState')
      this.nearService.getDaoById(this.q_id)
        .then(r => {
          console.log(r)
          //this.dao_state = r
          this.dao = r
          this.loaded = true
        })
        .catch((e) => {
          console.log(e)
        })
    },
    favorite_switch: function (id) {
      // console.log(this.favorites);
      // console.log(_.indexOf(this.favorites, id));

      if (_.indexOf(this.favorites, id) >= 0) {
        _.pull(this.favorites, id)
        console.log('Favorites REMOVE: ' + id)
      } else {
        this.favorites.push(id)
        console.log('Favorites ADD: ' + id)
      }

      // console.log(this.favorites);
    },
    favorite_is(id) {
      return _.indexOf(this.favorites, id) >= 0
    }

  }
}
</script>