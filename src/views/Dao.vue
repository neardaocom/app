<template>
  <Header></Header>

  <main>
    <!-- dashboard -->
    <section class="bg-white shadow-2 mb-3">
      <div class="container">
        <!-- Breadcrumb -->
        <Breadcrumb :account="'podílník.cz'" :list-router="'daos'" :list-name="'organizations'"/>
        <!-- /Breadcrumb -->
        <!-- Dashboard -->
        <Dashboard :dao="dao"/>
        <!-- /Dashboard -->
        <!-- Buttons -->
        <Buttons :dao="dao"/>
        <!-- /Buttons -->
      </div>
    </section>

    <!-- Parts -->
    <section>
      <div class="container">
        <Overview v-if="this.$route.query.page === 'overview' && this.$route.query.page === undefined" :dao="dao"/>
        <Voting v-if="this.$route.query.page === 'overview' || this.$route.query.page === undefined" :dao="dao"/>
        <Voting v-if="this.$route.query.page === 'voting'" :dao="dao"/>
        <Treasury v-if="this.$route.query.page === 'treasury'" :dao="dao"/>
        <Members v-if="this.$route.query.page === 'members'" :dao="dao"/>
        <Tokens v-if="this.$route.query.page === 'tokens'" :dao="dao"/>
        <Organization v-if="this.$route.query.page === 'organization'" :dao="dao"/>
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
import Buttons from '@/views/dao/Buttons.vue'
import Overview from '@/views/dao/Overview.vue'
import Voting from '@/views/dao/Voting.vue'
import Treasury from '@/views/dao/Treasury.vue'
import Members from '@/views/dao/Members.vue'
import Tokens from '@/views/dao/Tokens.vue'
import Organization from '@/views/dao/Organization.vue'
import DAOs from '@/repository/DAOs'
// import { MDBProgress, MDBProgressBar } from 'mdb-vue-ui-kit'
// MDBContainer, MDBTable, MDBBreadcrumb, MDBBreadcrumbItem, MDBInput, MDBBtn, MDBBtnGroup
import { useI18n } from 'vue-i18n'
import { ref, reactive } from 'vue'
import _ from 'lodash'
import Breadcrumb from '@/views/dao/Breadcrumb.vue'
import DAOPodilnik from '@/repository/DAOPodilnik'
import * as nearAPI from "near-api-js"

export default {
  components: {
    Header, Footer, Breadcrumb, Dashboard, Buttons, Overview, Voting, Treasury, Members, Tokens, Organization
    // , MDBProgress, MDBProgressBar //MDBChart //, MDBContainer, MDBTable, MDBBreadcrumb, MDBBreadcrumbItem, MDBInput, MDBBtn, MDBBtnGroup
  },
  created() {
    // dao id
    if (this.$route.params.id !== undefined) {
      this.q_id = this.$route.params.id
      this.contract = new nearAPI.Contract(
          this.wallet.account(), this.q_id, {
            viewMethods: ['statistics_ft', 'statistics_members', 'registred_user_count', 'proposal', 'proposals', 'ft_balance_of', 'ft_total_supply', 'ft_metadata'],
            changeMethods: ['add_proposal', 'vote', 'finish_proposal'],
          }
        )
    } else {
      console.log('Unknown dao id')
    }

    // page
    if (this.$route.query.page !== undefined) {
      this.q_page = this.$route.query.page
    } else {
      this.q_page = 'overview'
    }
  },
  async mounted() {
    this.proposals = await this.contract.proposals(0, 100);
    this.statistics_ft = await this.contract.statistics_ft();
  },
  setup() {
    const { t } = useI18n()
    const daos = ref(DAOs.data().daos)
    const search = ref('')
    const filter = reactive({})
    const favorites = [1]
    const q_id = null
    const q_page = null
    const dao = ref(DAOPodilnik.data())
    const contract = null
    const proposals = null
    const statistics_ft = null

    return { t, dao, daos, q_id, q_page, search, filter, favorites, contract, proposals, statistics_ft}
  },
  computed: {
    dao_favorites: function() {
      return this.daos.map(dao => dao.id)
      //this.data.map(tooth => this.parseMeasure(tooth.measure))
    },
    wallet() {
      return this.$store.getters['near/getWallet']
    },
  },
  methods: {
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