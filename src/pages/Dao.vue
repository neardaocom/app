<template>
  <Header></Header>

  <main>
    <!-- dashboard -->
    <!-- <section class="bg-white shadow-2 mb-3">-->
    <section class="mb-3">
      <div class="container">
        <!-- Breadcrumb -->
        <Breadcrumb :account="q_id" :list-router="'dao-list'" :list-name="'organizations'" :tags="dao.tags"/>
        <!-- /Breadcrumb -->
        <!-- Dashboard -->
        <Title v-if="loaded === true" :dao="dao"/>
        <SkeletonTitle v-else />

        <!-- /Dashboard -->
        <!-- Buttons -->
        <Buttons v-if="loaded" :dao="dao" :accountRole="accountRole"/>
        <SkeletonButtons v-else />
        <!-- /Buttons -->
      </div>
    </section>

    <!-- Parts -->
    <section>
      <div class="container">
        <Dashboard v-if="loaded === true && this.q_page === 'overview'" :dao="dao" :accountId="accountId" :accountRole="accountRole" />
        <Voting v-if="loaded === true && this.q_page === 'voting'" :dao="dao" :accountId="accountId" :accountRole="accountRole" />
        <Activities v-if="loaded === true && this.q_page === 'activities'" :dao="dao" :accountId="accountId" :accountRole="accountRole" />
        <Treasury v-if="loaded === true && this.q_page === 'treasury'" :dao="dao" />
        <DeFi v-if="loaded === true && this.q_page === 'defi'" :dao="dao" />
        <Tokens v-if="loaded === true && this.q_page === 'tokens'" :dao="dao" />
        <Documents v-if="loaded === true && this.q_page === 'documents'" :docs="dao.docs" />
        <About v-if="loaded === true && this.q_page === 'about'" :dao="dao" />
        <SkeletonBody v-if="loaded === false" />
      </div>
    </section>
    <!-- /Parts -->
  </main>

  <Footer></Footer>
</template>

<script>
import About from '@/components/dao/About.vue'
import Header from '@/components/layout/Header.vue'
import Footer from '@/components/layout/Footer.vue'
import Breadcrumb from '@/components/dao/Breadcrumb.vue'
import SkeletonBody from '@/components/dao/SkeletonBody.vue'
import Buttons from '@/components/dao/Buttons.vue'
import Title from '@/components/dao/Title.vue'
import DeFi from '@/components/dao/DeFi.vue'
import Dashboard from '@/components/dao/Dashboard.vue'
import SkeletonButtons from '@/components/dao/SkeletonButtons.vue'
import SkeletonTitle from '@/components/dao/SkeletonTitle.vue'
import Treasury from '@/components/dao/Treasury.vue'
import Tokens from '@/components/dao/Tokens.vue'
import Voting from '@/components/dao/Voting.vue'
import Documents from '@/components/dao/Documents.vue'
import Activities from '@/components/dao/Activities.vue'
// import { MDBProgress, MDBProgressBar } from 'mdb-vue-ui-kit'
// MDBContainer, MDBTable, MDBBreadcrumb, MDBBreadcrumbItem, MDBInput, MDBBtn, MDBBtnGroup
import { useI18n } from 'vue-i18n'
import { ref } from 'vue'
import _ from 'lodash'
import { getRole, loadById } from "@/models/dao";
//import * as nearAPI from "near-api-js"

export default {
  components: {
    About, Activities, Header, Footer, Breadcrumb, Title, Buttons, Dashboard, Voting, Treasury, Tokens, Documents, DeFi
    , SkeletonTitle, SkeletonButtons, SkeletonBody
    // , MDBProgress, MDBProgressBar //MDBChart //, MDBContainer, MDBTable, MDBBreadcrumb, MDBBreadcrumbItem, MDBInput, MDBBtn, MDBBtnGroup
  },
  setup() {
    const { t } = useI18n()
    const q_id = null
    const dao = ref(null)
    const loaded = ref(false)

    return { t, dao, q_id, loaded}
  },
  created() {
    // dao id
    if (this.$route.params && this.$route.params.id) {
      this.q_id = this.$route.params.id
    } else {
      this.q_id = process.env.VUE_APP_DAO_DEFAULT
    }
    this.$store.commit('near/setContract', this.q_id)

    // dao
    this.dao = {
      id: this.q_id,
      wallet: this.q_id,
      tags: [],
    }
  },
  computed: {
    wallet() {
      return this.$store.getters['near/getWallet']
    },
    accountId() {
      return this.$store.getters["near/getAccountId"];
    },
    nearService() {
      return this.$store.getters['near/getService']
    },
    q_page() {
      return _.toString(this.$route.query.page) || 'overview'
    },
    accountRole() {
      return getRole(this.dao, this.wallet.getAccountId())
    },
  },
  mounted() {
    this.$store.commit('near/setContract', this.q_id)
    this.getState()
    // console.log(this);
  },
  methods: {
    getState() {
      //console.log('getState')
      loadById(this.nearService, this.q_id, this.wallet.getAccountId())
      // this.nearService.getDaoById(this.q_id) // OLD VERSION
        .then(r => {
          //console.log(r)
          //this.dao_state = r
          this.dao = r
          this.loaded = true
        })
        .catch((e) => {
          this.$logger.error('D', 'app@pages/Dao', 'GetDao', `Dao with id [${this.q_id}] failed to load`)
          this.$logger.error('B', 'app@pages/Dao', 'GetDao', `Dao with id [${this.q_id}] failed to load`)
          this.$notify.danger(this.t('default.notify_dao_load_fail_title'), this.t('default.notify_blockchain_fail') + " " + this.t('default.notify_dao_load_fail_message', {id: this.q_id}))
          this.$notify.flush()
          console.log(e)
        })
    },

  }
}
</script>