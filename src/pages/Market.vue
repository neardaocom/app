<template>
  <Header :daoId="rDaoId"></Header>
  <main>
    <MDBContainer>
      <Breadcrumb :daoId="rDaoId" />
    </MDBContainer>

    <MDBContainer>
      <h1 class="text-start">{{ t('default.market')}}</h1>
      <h6 class="text-start">{{ t('default.market_sub')}}</h6>

        <div  class="row mt-5">
          <div class="col-6 col-md-4 col-lg-3">
            <MDBInput
              inputGroup
              formOutline
              wrapperClass="mb-3 my_filter_form"
              v-model="filterSearch"
              size="sm"
              aria-describedby="search-addon"
              :aria-label="t('default.search')"
            >
              <template #prepend>
                <span class="input-group-text border-0" id="search-addon"><MDBIcon icon="search" iconStyle="fas" /></span>
              </template>
            </MDBInput>
          </div>
          <div class="col-12 col-md-4 col-lg-7 text-start pt-1 ps-4">
          </div>
          <div class="col-6 col-md-4 col-lg-2 text-end">
            <MDBSelect size="sm" v-model:options="filterOrderOptions" v-model:selected="filterOrder" />
          </div>
        </div>


      <div class="row mb-4">
        <MDBCard>
          <MDBCardBody>
            <MDBCardText>
              <MDBTable responsive borderless striped>
                <thead>
                  <tr>
                    <!-- <th scope="col"></th>-->
                    <th scope="col">#</th>
                    <th scope="col" class="text-start">{{ t('default.name') }}</th>
                    <th scope="col" class="text-start">{{ t('default.description') }}</th>
                    <th scope="col" class="text-start">{{ t('default.creator') }}</th>
                    <th scope="col" class="text-start">{{ t('default.version') }}</th>
                    <th scope="col" class="text-start"></th>
                  </tr>
                </thead>
                <tbody>

                  <tr>
                    <td colspan="7" class="p-0">
                      <MDBProgress class="my-1">
                        <MDBProgressBar bg="secondary" :value="fetchProgress" />
                      </MDBProgress>
                    </td>
                  </tr>

                  <tr v-for="(template, index) in dataResults" :key="index">
                    <td>{{ index + 1 }}</td>
                    <td class="text-start">
                      <router-link v-if="false" class="h6" :to="{ name: 'market-workflow', params: {id: template.id}}">{{ template.name }}</router-link>
                      <span v-else class="h6">{{ t('default.wf_templ_' + template.code) }}</span>
                    </td>
                    <td class="text-start">{{ t('default.wf_templ_' + template.code + '_description') }}</td>
                    <td class="text-start">{{ creator.name }}</td>
                    <td class="text-start">v{{ template.version }}.0</td>
                    <td class="text-start">
                      <button
                        v-if="template.status === t('default.buy')"
                        type="button" class="btn btn-rounded px-4 py-1 btn-buy fw-bold"
                        @click.prevent="open(template)"
                      ><i class="bi bi-cart me-2 fa-lg"></i>{{ template.status }} {{ getPrice(template.code) }}</button>
                      <button
                        v-else-if="template.status === t('default.installed')"
                        type="button" class="btn btn-rounded px-4 py-1 btn-installed fw-bold"
                        @click.prevent=""
                      ><i class="bi bi-check-circle me-2 fa-lg"></i>{{ template.status }}</button>
                      <button
                        v-else
                        type="button" class="btn btn-rounded px-4 py-1 btn-in-progress fw-bold"
                      ><i class="bi bi-clock me-2 fa-lg"></i>{{ template.status }}</button>
                    </td>
                  </tr>
                </tbody>
              </MDBTable>
            </MDBCardText>
          </MDBCardBody>
        </MDBCard>
      </div>
    </MDBContainer>
  </main>

  <!-- Modals -->
  <ModalProposal :title="modalTitle" :show="modalProposal" @vote="vote()">
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
import Breadcrumb from '@/components/market/Breadcrumb.vue'
import {
  MDBContainer, MDBTable, MDBProgress, MDBProgressBar,
  MDBCard, MDBCardBody, MDBCardText, MDBInput,
  MDBIcon,
  MDBSelect,
} from 'mdb-vue-ui-kit'
import { useI18n } from 'vue-i18n'
import { useTemplateList, useCreators } from "@/hooks/workflow";
import { onMounted, watch, ref } from 'vue'
import { useRouter } from "@/hooks/dao";
import { useNear } from '@/hooks/vuex'
import { useStore } from 'vuex'
import { market } from "@/data/workflow";
import loGet from "lodash/get";
import loFind from "lodash/find";
import { loadById } from "@/models/dao";
import { check, getDAORights, getWalletRights } from '@/models/rights'
// import { getDAORights } from '@/models/rights'
import ModalProposal from '@/components/proposal/Modal.vue'
import AddWorkflow from './dao/activities/workflows/wf_add/ProposalMarket.vue'
import ModalMessage from '@/components/forms/ModalMessage.vue'

export default {
  components: {
    Header, Breadcrumb, Footer, MDBContainer, MDBTable
    , MDBProgress, MDBProgressBar
    , MDBCard, MDBCardBody, MDBCardText
    , MDBIcon
    , MDBInput
    , MDBSelect
    , ModalProposal, ModalMessage, AddWorkflow,
  },
  setup() {
    const { t, n } = useI18n()
    const { dataSource, dataResults, fetchProgress, fetch, filterSearch, filterOrder, filterOrderOptions, filter } = useTemplateList()
    const { creator, provider } = useCreators()
    const store = useStore()
    const { nearService, wallet } = useNear()
    const { rDaoId } = useRouter()
    const daoTemplatesCodes = ref([])
    const dao = ref({})
    const daoRights = ref([])
    const walletRights = ref([])

    const modalProposal = ref(0)
    const modalTitle = t('default.wf_templ_wf_add')
    const modalProps = ref({})
    const modalMessage = ref(0)

    onMounted(() => {
      if (rDaoId.value) {
        store.commit('near/setContract', rDaoId.value)

        loadById(nearService.value, rDaoId.value, t, wallet.value?.getAccountId())
          .then(r => {
            dao.value = r
            daoRights.value = getDAORights(r)
            walletRights.value = getWalletRights(r, wallet.value?.getAccountId())
          })
          .catch((e) => {
            //this.$logger.error('D', 'app@pages/Dao', 'GetDao', `Dao with id [${this.rDaoId}] failed to load`)
            //this.$logger.error('B', 'app@pages/Dao', 'GetDao', `Dao with id [${this.rDaoId}] failed to load`)
            //this.$notify.danger(this.t('default.notify_dao_load_fail_title'), this.t('default.notify_blockchain_fail') + " " + this.t('default.notify_dao_load_fail_message', {id: this.rDaoId}))
            //this.$notify.flush()
            console.log(e)
          })

        nearService.value.getWfTemplates(rDaoId.value).then(r => {
          // daoTemplatesCodes
          r.forEach((template) => {
            daoTemplatesCodes.value.push(template[1][0].name)
          })

          fetch(daoTemplatesCodes.value)
        })
      } else {
        fetch([])
      }
    })

    watch([filterSearch, filterOrder], () => { filter() })

    return {
      t, n, dataSource, dataResults, creator, provider, fetchProgress, filterSearch, filterOrder, filterOrderOptions, filter,
      rDaoId, daoTemplatesCodes, modalProposal, modalTitle, modalProps, modalMessage, dao, daoRights, walletRights,
    }
  },
  methods: {
    getPrice(templateCode) {
      const price = loGet(market, [templateCode])?.price ?? 0
      return (price == 0) ? this.t('default.free') : this.n(price) + ' N';
    },
    open(template){
      if (this.rDaoId) {
        const rights = loFind(this.dao.templates, {code: 'wf_add'})?.settings[0].proposeRights ?? []
        if (check(this.walletRights, rights)) {
          this.modalProposal += 1
          this.modalTitle = this.t('default.implement') + ' ' + this.t('default.wf_templ_' + template.code) + ' ' + this.t('default.feature')
          this.modalProps = {
            template: template,
            contractId: this.rDaoId,
            dao: this.dao,
            daoRights: this.daoRights,
            price: loGet(market, [template.code])?.price ?? 0,
          }
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

<style scoped>
.btn-buy {
    color: #FFFFFF;
    text-transform: none;
    background: transparent linear-gradient(112deg, #5F8AFA 0%, #6B6EF9 100%) 0% 0% no-repeat padding-box;
    width: 90%;
}
.btn-installed {
    color: #FFFFFF;
    text-transform: none;
    /* background: transparent linear-gradient(297deg, #ABD055 0%, #CDE39D 100%) 0% 0% no-repeat padding-box;*/
    background: transparent linear-gradient(297deg, #ABD085 0%, #ABD085 100%) 0% 0% no-repeat padding-box;
    /*ABD085  */
    width: 90%;
}
.btn-in-progress {
    color: #FFFFFF;
    text-transform: none;
    /* background: transparent linear-gradient(297deg, #ABD055 0%, #CDE39D 100%) 0% 0% no-repeat padding-box;*/
    background: transparent linear-gradient(297deg, #FFC870 0%, #FFC870 100%) 0% 0% no-repeat padding-box;
    width: 90%;
}
</style>