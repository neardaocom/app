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
        <Buttons v-if="loaded" :walletRights="walletRights" :daoRights="daoRights" />
        <SkeletonButtons v-else />
        <!-- /Buttons -->
      </div>
    </section>

    <!-- Parts -->
    <section>
      <div class="container">
        <Dashboard v-if="loaded === true && rPage === 'overview'" :walletId="wallet.accountId" :walletRights="walletRights" :daoRights="daoRights" />
        <Voting v-if="loaded === true && rPage === 'voting'" />
        <Activities v-if="loaded === true && rPage === 'activities'" :walletId="wallet.accountId" :walletRights="walletRights" :daoRights="daoRights" />
        <DeFi v-if="loaded === true && rPage === 'defi'"/>
        <Tokens v-if="loaded === true && rPage === 'tokens'" :dao="dao" />
        <Resources v-if="loaded === true && rPage === 'resources'" :docs="dao.docs" />
        <About v-if="loaded === true && rPage === 'about'" />
        <Settings v-if="loaded === true && rPage === 'settings'"/>
        <Treasury v-if="loaded === true && rPage === 'treasury'"/>
        <Governance v-if="loaded === true && rPage === 'governance'"/>
        <Rewards v-if="loaded === true && rPage === 'rewards'"/>
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
import Rewards from './dao/Rewards.vue'
import { useI18n } from 'vue-i18n'
import { ref, onMounted, provide, inject, onUnmounted } from 'vue'
import Rights from '@/models/dao/Rights'
import DaoLoader from '@/models/dao/DaoLoader'
import DaoMarket from '@/models/dao/DaoMarket'
import { useRouter } from "@/hooks/dao";
import { useDao } from "@/hooks/daoList";
import { useRewards, useClaimableRewards } from "@/hooks/rewards";

export default {
  components: {
    About, Activities, Header, Footer, Breadcrumb, Buttons, Dashboard, Voting, Tokens, Resources, DeFi, Settings,
    SkeletonButtons, SkeletonBody, Governance, Treasury, Rewards,
    Title,
    SkeletonTitle,
  },
  setup() {
    const config = inject('config')
    const loader = inject('loader')
    const wallet = inject('wallet')

    const { t } = useI18n()
    const {rDaoId, rPage, rSearch, rOrder} = useRouter(config)
    const { daoInfo } = useDao(rDaoId.value)


    const dao = ref({tags: []})
    const templateMeta = ref([])
    const loaded = ref(false)
    const daoRights = ref([])
    const walletRights = ref([])

    provide('dao', dao)
    provide('daoRights', daoRights)
    provide('walletRights', walletRights)
    provide('templateMeta', templateMeta)

    const { daoRewards } = useRewards(dao, loader)
    const {
      rewardsClaimable, rewardsLoadClaimable, rewardsAssetStats,
      rewardsLoadIntervalStep, rewardsLoadIntervalId, rewardsLoadTurnOn, rewardsLoadTurnOff,
      rewardsCounting, rewardsCountingIntervalId, rewardsCountingTurnOn, rewardsCountingTurnOff,
    } = useClaimableRewards(
      dao, wallet, daoRewards, loader
    )
    provide('rewardsClaimable', rewardsClaimable)
    provide('rewardsAssetsStats', rewardsAssetStats)

    onMounted(async () => {
      // const daoFactory = await loader?.value.get('dao/Factory')
      // const servicePool = daoFactory.value.createServicePool();
      const servicePool = await loader.value.get('dao/ServicePool')
      const daoLoader = new DaoLoader(rDaoId.value, servicePool.value, t, daoInfo.value)
      dao.value = await daoLoader.getDao(wallet.value.accountId)

      // load templates metadata
      const daoMarket = new DaoMarket(config.value.near.wfProviderAccountId, servicePool.value)
      templateMeta.value = await daoMarket.list([], t) || []

      //console.log(dao.value)
      loaded.value = true
      daoRights.value = Rights.getDAORights(dao.value)
      walletRights.value = Rights.getWalletRights(dao.value, wallet.value.accountId)

      // rewards
      rewardsLoadClaimable()
      rewardsCounting()
      rewardsLoadTurnOn()
      rewardsCountingTurnOn()
    })

    onUnmounted(() => {
      rewardsLoadTurnOff()
      rewardsCountingTurnOff()
    })

    return {
      t, rDaoId, rPage, rSearch, rOrder, dao, daoInfo, loaded, daoRights, wallet, walletRights,
      daoRewards, rewardsLoadIntervalStep, rewardsLoadIntervalId, rewardsCountingIntervalId,
    }
  }
}
</script>

<style>
  .title-background-image {
    background-image: url("../../public/img/cover_cropt.png");
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