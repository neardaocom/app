<template>
  <Header :daoId="rDaoId"></Header>
  <main>
    <!-- dashboard -->
    <!-- <section class="bg-white shadow-2 mb-3">-->
    <section class="mb-3">
      <div class="container">
        <!-- Breadcrumb -->
        <Breadcrumb :daoId="rDaoId" />
        <!-- /Breadcrumb -->
        <!-- Dashboard -->

        <Title v-if="loaded === true" :dao="dao"/>
        <SkeletonTitle v-else />


        <!-- /Dashboard -->
        <!-- Buttons -->
        <Buttons v-if="loaded" :accountRole="accountRole" :walletRights="walletRights" :daoRights="daoRights" />
        <SkeletonButtons v-else />
        <!-- /Buttons -->
      </div>
    </section>

    <!-- Parts -->
    <section>
      <div class="container">
        <Dashboard v-if="loaded === true && rPage === 'overview'" :walletId="accountId" :walletRights="walletRights" :daoRights="daoRights" />
        <Voting v-if="loaded === true && rPage === 'voting'" :walletId="accountId" :walletRights="walletRights" :daoRights="daoRights" />
        <Activities v-if="loaded === true && rPage === 'activities'" :walletId="accountId" :walletRights="walletRights" :daoRights="daoRights" />
        <DeFi v-if="loaded === true && rPage === 'defi'"/>
        <Tokens v-if="loaded === true && rPage === 'tokens'" :dao="dao" />
        <Resources v-if="loaded === true && rPage === 'resources'" :docs="dao.docs" />
        <About v-if="loaded === true && rPage === 'about'" />
        <Settings v-if="loaded === true && rPage === 'settings'"/>
        <Treasury v-if="loaded === true && rPage === 'treasury'"/>
        <Governance v-if="loaded === true && rPage === 'governance'"/>
        <SkeletonBody v-if="loaded === false" />
      </div>
    </section>
    <!-- /Parts -->
  </main>

  <Footer></Footer>
</template>

<script>
import About from './dao/About.vue'
import Header from '@/components/layout/Header.vue'
import Footer from '@/components/layout/Footer.vue'
import Breadcrumb from '@/components/ui/Breadcrumb.vue'
import SkeletonBody from './dao/SkeletonBody.vue'
import Buttons from './dao/Buttons.vue'
import Title from '@/components/dao/Title.vue'
import DeFi from './dao/DeFi.vue'
import Dashboard from './dao/Dashboard.vue'
import SkeletonButtons from './dao/SkeletonButtons.vue'
import SkeletonTitle from '@/components/dao/SkeletonTitle.vue'
import Tokens from './dao/Tokens.vue'
import Voting from './dao/Voting.vue'
import Resources from './dao/Resources.vue'
import Activities from './dao/Activities.vue'
import Settings from './dao/Settings.vue'
import Treasury from './dao/Treasury.vue'
import Governance from './dao/Governance.vue'
import { useI18n } from 'vue-i18n'
import { ref, onMounted, provide, inject } from 'vue'
import { getRole } from "@/models/dao";
import Rights from '@/models/dao/Rights'
import DaoLoader from '@/models/dao/DaoLoader'
import { useRouter } from "@/hooks/dao";
// import { useStore } from 'vuex'
// import { useNear, useWallet } from "@/hooks/vuex";
import { useWallet } from "@/hooks/vuex";

export default {
  components: {
    About, Activities, Header, Footer, Breadcrumb, Buttons, Dashboard, Voting, Tokens, Resources, DeFi, Settings,
    SkeletonButtons, SkeletonBody, Governance, Treasury,
    Title,
    SkeletonTitle,
  },
  setup() {
    const config = inject('config')
    const loader = inject('loader')

    const { t } = useI18n()
    // const store = useStore()
    // const { nearService, wallet } = useNear()
    const { wallet } = useWallet()
    const {rDaoId, rPage, rSearch, rOrder} = useRouter(config)
    const dao = ref({tags: []})
    const loaded = ref(false)
    const daoRights = ref([])
    const walletRights = ref([])

    provide('dao', dao)

    onMounted(async () => {
      const daoFactory = await loader?.value.get('dao/Factory')
      const servicePool = daoFactory.value.createServicePool();
      const contractService = servicePool.getContract(rDaoId.value)
      const accountService = await servicePool.getAccount(rDaoId.value)
      const daoLoader = new DaoLoader(rDaoId.value, contractService, accountService, t)
      dao.value = await daoLoader.getDao(wallet.value?.getAccountId())
      //console.log(dao.value)
      loaded.value = true
      daoRights.value = Rights.getDAORights(dao.value)
      walletRights.value = Rights.getWalletRights(dao.value, wallet.value?.getAccountId())
      //store.commit('near/setContract', rDaoId.value)
      //loadById(nearService.value, rDaoId.value, t, wallet.value?.getAccountId())
      //  .then(r => {
      //    // console.log('load DAO', r)
      //    //this.dao_state = r
      //    dao.value = r
      //    loaded.value = true
      //    daoRights.value = getDAORights(r)
      //    walletRights.value = getWalletRights(r, wallet.value?.getAccountId())
      //    // console.log(this.walletRights)
      //  })
      //  .catch((e) => {
      //    //this.$logger.error('D', 'app@pages/Dao', 'GetDao', `Dao with id [${this.rDaoId}] failed to load`)
      //    //this.$logger.error('B', 'app@pages/Dao', 'GetDao', `Dao with id [${this.rDaoId}] failed to load`)
      //    //this.$notify.danger(this.t('default.notify_dao_load_fail_title'), this.t('default.notify_blockchain_fail') + " " + this.t('default.notify_dao_load_fail_message', {id: this.rDaoId}))
      //    //this.$notify.flush()
      //    console.log(e)
      //  })
    })

    return { t, rDaoId, rPage, rSearch, rOrder, dao, loaded, daoRights, wallet, walletRights }
  },
  computed: {
    accountId() {
      return this.$store.getters["near/getAccountId"];
    },
    accountRole() {
      return getRole(this.dao, this.wallet.getAccountId())
    },
  },
  methods: {
  }
}
</script>

<style>
  .title-background-image {
    background-image: url("/img/cover_cropt.png");
    height: 263px;
    border-radius: 8px 8px 0px 0px;
  }
  .buttons_nav {
    background-color: white;
     border-radius: 0px 0px 8px 8px;
  }

  .buttons_dropdown {
    border-radius: 0px 0px 8px 0px;
  }
</style>