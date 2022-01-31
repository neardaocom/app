<template>
  <Header></Header>
  <main>
    <MDBContainer>
      <Breadcrumb />
    </MDBContainer>
    <MDBContainer>
      <div class="row">
        <div class="col-12 text-center">
          <h2>{{ t('default.workflows')}}</h2>
          <p>{{ t('default.workflows_header')}}</p>
        </div>
      </div>
      <div class="row mt-2 mb-4">
        <MDBCard>
          <MDBCardBody>
            <MDBCardText>
              <div class="row mt-3">
                <div class="col-6 col-md-4 col-lg-3">
                  <MDBInput
                    inputGroup
                    :formOutline="false"
                    wrapperClass="mb-3"
                    class="rounded"
                    v-model="searchQuery"
                    aria-describedby="search-addon"
                    :aria-label="t('default.search')"
                    :placeholder="t('default.search')"
                  >
                    <template #prepend>
                      <span class="input-group-text border-0" id="search-addon"><MDBIcon icon="search" iconStyle="fas" /></span>
                    </template>
                  </MDBInput>
                </div>
                <div class="col-12 col-md-6 col-lg-9 text-start pt-1 ps-4">
                  
                </div>
              </div>
              <MDBProgress class="my-1">
                <MDBProgressBar :value="loadingProgress" />
              </MDBProgress>
              <MDBTable responsive striped>
                <thead>
                  <tr>
                    <!-- <th scope="col"></th>-->
                    <th scope="col">#</th>
                    <th scope="col" class="text-start">{{ t('default.organization') }}</th>
                    <th scope="col" class="text-start"></th>
                    <th scope="col" class="text-start">{{ t('default.wallet') }}</th>
                    <th scope="col" class="text-end">{{ t('default.dao_funds') }}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(dao, index) in results" :key="index">
                    <!-- <td><a @click="favorite_switch(dao.id)" class="">
                        <i v-if="favorites.indexOf(dao.id) >= 0" class="fas text-warning fa-star fa-xs pe-1"></i>
                        <i v-else class="far fa-star fa-xs pe-1" ></i>
                      </a>
                    </td>-->
                    <td>{{ dao.index + 1 }}</td>
                    <td class="text-start">
                      <router-link class="fw-bold" :to="{ name: 'dao', params: {id: dao.id + '.' + this.factoryAccount}}">{{ dao.name }} <MDBIcon v-if="dao.location != null" :flag="dao.location"/></router-link>
                      <br>
                      <span class="fw-light">{{dao.description}}</span>
                    </td>
                    <td class="text-start">
                      <span
                        class="badge bg-info"
                        v-for="(tag, index) in dao.tags"
                        :key="index"
                        >{{ tag }}</span
                      >
                    </td>
                    <td class="text-start">
                      <a class="text-reset" target="_blank" :href="walletUrl + '/accounts/' + dao.id + '.' + this.factoryAccount">
                        {{ dao.id + '.' + this.factoryAccount }} <MDBIcon size="sm" icon="external-link-alt" iconStyle="fas" />
                      </a>
                    </td>
                    <td class="text-end">
                      <span class="fw-bold me-1">{{ dao.amount }}</span><span v-if="dao.amount" class="text-muted">USD</span>
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

  <Footer></Footer>
</template>

<script>
import Header from '@/components/layout/Header.vue'
import Footer from '@/components/layout/Footer.vue'
import Breadcrumb from '@/components/workflows/Breadcrumb.vue'
import DAOs from '@/data/DAOs'
import {
  MDBContainer, MDBTable, MDBProgress, MDBProgressBar
  , MDBCard, MDBCardBody, MDBCardText, MDBIcon
  , MDBInput
} from 'mdb-vue-ui-kit'
import { useI18n } from 'vue-i18n'
import { ref } from 'vue'
import { reactive } from "@vue/reactivity";
import { transform, transTags } from '@/models/dao'
import { getRandom } from '@/utils/integer'
import { toSearch } from '@/utils/string'
import _ from "lodash"
import Decimal from 'decimal.js';

export default {
  components: {
    Header, Breadcrumb, Footer, MDBContainer, MDBTable
    , MDBProgress, MDBProgressBar
    , MDBCard, MDBCardBody, MDBCardText
    , MDBIcon
    , MDBInput
  },
  setup() {
    const { t, n } = useI18n()
    const daos = ref(DAOs.data().daos)
    const list = ref([])
    const tags = ref([])
    const searchQuery = ref('')
    const filterTag = reactive({
      agency: {
        name: t('default.agency'),
        active: false,
      },
      startup: {
        name: t('default.startup'),
        active: false,
      },
      project: {
        name: t('default.project'),
        active: false,
      },
      club: {
        name: t('default.club'),
        active: false,
      },
    })
    const loadingProgress = ref(0)
    return {
      t, n, daos, list, tags, loadingProgress, searchQuery, filterTag
    }
  },
  computed: {
    nearService() {
      return this.$store.getters['near/getService']
    },
    factoryAccount() {
        return this.$store.getters['near/getFactoryAccount']
    },
    walletUrl() {
        return this.$store.getters['near/getWalletUrl']
    },
    nearPrice() {
      return this.$root.near_price
    },
    results() {
      let results = this.list
      // filter
      const filterTags = Object.values(this.filterTag).filter(item => item.active).map(item => item.name)
      if (filterTags.length > 0) {
        results = results.filter(item => _.intersection(item.tags, filterTags).length > 0)
      }
      // searching
      const searchText = toSearch(this.searchQuery)
      if (searchText.length > 2) {
        results = results.filter(item => item.search.includes(searchText))
      }
      // order
      return results
    },
    headerText() {
      return _.join(_.orderBy(this.tags), ' | ')
    }
  },
  mounted() {
    this.loadingProgress = getRandom(5, 15)
    this.fetchList()
  },
  methods: {
    fetchList() {
      Promise.all([
        this.nearService.getDaoList(),
        this.nearService.getTags(),
      ]).then(r => {
        this.loadingProgress = 75
        this.list = transform(r[0], r[1], this.t, this.n)
        this.tags = transTags(r[1], this.t)

        // load amount
        this.nearService.getDaosAmount(this.list.map((item) => item.id + '.' + this.factoryAccount)).then(
          wallets => {
            // console.log(wallets)
            this.list.forEach((element, index) => {
              element.amount = new Decimal(wallets[index]).times(this.nearPrice).toFixed(2)
            });
            this.loadingProgress = 100
          }
        )
      }).catch((e) => {
        this.$logger.error('D', 'app@pages/DaoList', 'FetchingDaoList', 'Fetching Dao list failed')
        this.$logger.error('B', 'app@pages/DaoList', 'FetchingDaoList', 'Fetching Dao list failed')
        this.$notify.warning(this.t('default.notify_dao_list_fetching_fail_title'), this.t('default.notify_blockchain_fail') + " " + this.t('default.notify_dao_list_fetching_fail_message'))
        this.$notify.flush()
        console.log(e)
      })
      this.loadingProgress = getRandom(25, 50)
    }
  }
}
</script>