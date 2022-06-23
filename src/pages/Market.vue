<template>
  <Header :daoId="rDaoId" ></Header>
  <main>
    <MDBContainer>
      <Breadcrumb :daoId="rDaoId" listName="market" />
    </MDBContainer>

    <MDBContainer>
      <h1 class="text-start">{{ t('default.market')}}</h1>
      <h6 class="text-start">{{ t('default.market_sub')}}</h6>

        <div  class="row mt-5">
          <div class="col-6 col-md-4 col-lg-3">
            <Search v-model="filterSearch"/>
          </div>
          <div class="col-12 col-md-4 col-lg-7 text-start pt-1 ps-4">
          </div>
          <div class="col-6 col-md-4 col-lg-2 text-end">
            <MDBSelect size="sm" v-model:options="filterOrderOptions" v-model:selected="filterOrder" />
          </div>
        </div>


        <MDBProgress class="my-2">
          <MDBProgressBar bg="secondary" :value="fetchProgress" />
        </MDBProgress>

        <h5 v-if="dao" class="text-start mt-5">Owned sevices</h5>
        <div class="row gx-5 mt-3">
          <div class="col-md-6" v-for="(template, index) in dataResults.filter((template) => template.status === t('default.installed'))" :key="index">
            <TemplateCard :template="template" @btn-click="open" />
          </div>
        </div> 

        <h5 class="text-start mt-5">Services to buy</h5>
        <div class="row gx-5 mt-3">
          <div class="col-md-6" v-for="(template, index) in dataResults.filter((template) => template.status !== t('default.installed'))" :key="index">
            <TemplateCard :template="template" @btn-click="open"/>
          </div>
        </div>

    </MDBContainer>
  </main>

  <!-- Modals -->
  <ModalProposal :title="modalTitle" :show="modalProposal" @submit="vote()" :submitText="t('default.vote')" size="lg">
    <AddWorkflow ref="form" v-bind="modalProps" />
  </ModalProposal>

  <ModalMessage :title="t('default.market')" :show="modalMessage">
    <h6 class="text-center my-4">{{ t('default.market_create_or_sign') }}.</h6>
  </ModalMessage>

  <Footer></Footer>
</template>

<script>
import Header from '@/components/layout/Header.vue'
import Footer from '@/components/layout/Footer.vue'
import Breadcrumb from '@/components/ui/Breadcrumb.vue'
import {
  MDBContainer,
  MDBProgress, 
  MDBProgressBar,
  MDBSelect,
} from 'mdb-vue-ui-kit'
import { useI18n } from 'vue-i18n'
import { useTemplateList } from "@/hooks/workflow";
import { onMounted, watch, ref, inject } from 'vue'
import { useRights, useRouter } from "@/hooks/dao";
// import { useNear } from '@/hooks/vuex'
// import { useStore } from 'vuex'
import { market } from "@/data/workflow";
import loGet from "lodash/get";
import loFind from "lodash/find";
// import { loadById } from "@/models/dao";
import Rights from '@/models/dao/Rights'
// import { Rights.getDAORights } from '@/models/rights'
import ModalProposal from '@/components/proposal/Modal.vue'
import AddWorkflow from '@/components/dao/workflows/wf_add/ProposalMarket.vue'
import ModalMessage from '@/components/forms/ModalMessage.vue'
import TemplateCard from '@/components/market/TemplateCard.vue'
import Search from "@/components/ui/Search.vue"
import { useWallet } from '@/hooks/wallet'
import DaoLoader from '@/models/dao/DaoLoader'
import { useDao } from "@/hooks/daoList";

export default {
  components: {
    Header, Breadcrumb, Footer, MDBContainer,
    MDBProgress, MDBProgressBar,
    MDBSelect,
    ModalProposal, ModalMessage, AddWorkflow,
    TemplateCard, Search
  },
  setup() {
    const { t, n } = useI18n()
    const { rDaoId } = useRouter(config)
    const config = inject('config')
    const loader = inject('loader')
    const dao = ref(null)
    const { wallet } = useWallet(loader)
    const { daoInfo } = useDao(rDaoId.value)
    const { daoRights, walletRights } = useRights(dao, wallet.value?.getAccountId())
    const { dataSource, dataResults, fetchProgress, fetch, filterSearch, filterOrder, filterOrderOptions, filter } = useTemplateList(loader, config)
    const daoTemplatesCodes = ref([])

    const modalProposal = ref(0)
    const modalTitle = t('default.wf_templ_wf_add')
    const modalProps = ref({})
    const modalMessage = ref(0)

    onMounted(async () => {
      if (rDaoId.value) {
        // fetch dao
        const servicePool = await loader?.value.get('dao/ServicePool')
        const daoLoader = new DaoLoader(rDaoId.value, servicePool.value, t, daoInfo.value)
        dao.value = await daoLoader.getDao(wallet.value?.getAccountId())
        console.log(dao.value)
        daoTemplatesCodes.value = Object.values(dao.value.templates).map((template) => template.code)

        // fetch templates
        fetch(daoTemplatesCodes.value)
      } else {
        fetch([])
      }
    })

    watch([filterSearch, filterOrder], () => { filter() })

    return {
      t, n, dataSource, dataResults, fetchProgress, filterSearch, filterOrder, filterOrderOptions, filter,
      rDaoId, daoTemplatesCodes, modalProposal, modalTitle, modalProps, modalMessage, dao, daoRights, walletRights, wallet,
    }
  },
  methods: {
    getPrice(templateCode) {
      const price = loGet(market, [templateCode])?.price ?? 0
      return (price == 0) ? this.t('default.free') : this.n(price) + ' N';
    },
    open(template){
      if (this.rDaoId) {
        const rights = loFind(this.dao.templates, {code: 'basic_pkg1'})?.settings[0].proposeRights ?? []
        if (Rights.check(this.walletRights, rights)) {
          this.modalTitle = this.t('default.implement') + ' ' + this.t('default.wf_templ_' + template.value.code) + ' ' + this.t('default.feature')
          this.modalProps = {
            template: template,
            contractId: this.rDaoId,
            dao: this.dao,
            daoRights: this.daoRights,
            price: loGet(market, [template.code])?.price ?? 0,
          }
          this.modalProposal += 1
        } else {
          console.log('no rights')
        }
      } else {
        this.modalMessage += 1
      }
    },
    vote(){
      this.$refs.form?.onSubmit()
    },
  },
}
</script>
