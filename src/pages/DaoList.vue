<template>
  <Header></Header>
  <main>
    <MDBContainer>
      <Breadcrumb :list-name="'organizations'" />
    </MDBContainer>
    <MDBContainer>
      <div class="row mt-4 mb-4">
        <MDBCard>
          <MDBCardBody>
            <MDBCardTitle>{{ t('default.organizations')}}</MDBCardTitle>
            <MDBCardText>
              <MDBProgress class="my-4">
                <MDBProgressBar :value="loadingProgress" />
              </MDBProgress>
              <MDBTable responsive striped>
                <thead>
                  <tr>
                    <!-- <th scope="col"></th>-->
                    <th scope="col">#</th>
                    <th scope="col" class="text-start">{{ t('default.organization') }}</th>
                    <th scope="col" class="text-start">{{ t('default.marks') }}</th>
                    <th scope="col" class="text-start">{{ t('default.wallet') }}</th>
                    <th scope="col" class="text-end">{{ t('default.tokens') }}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(dao, index) in list" :key="index">
                    <!-- <td><a @click="favorite_switch(dao.id)" class="">
                        <i v-if="favorites.indexOf(dao.id) >= 0" class="fas text-warning fa-star fa-xs pe-1"></i>
                        <i v-else class="far fa-star fa-xs pe-1" ></i>
                      </a>
                    </td>-->
                    <td>{{ index + 1 }}</td>
                    <td class="text-start">
                      <router-link class="fw-bold" :to="{ name: 'dao', params: {id: dao[0] + '.' + this.factoryAccount}}">{{ dao[1].name }} <MDBIcon v-if="dao[1].lang != null" :flag="dao[1].state"/></router-link>
                      <br>
                      <span class="fw-light">{{dao[1].description}}</span>
                    </td>
                    <td class="text-start">
                      <span
                        class="badge bg-info"
                        v-for="(tag, index) in dao[1].tags"
                        :key="index"
                        >{{ t('default.' + this.tags[tag]) }}</span
                      >
                    </td>
                    <td class="text-start">
                      <a class="text-reset" target="_blank" :href="walletUrl + '/accounts/' + dao[0] + '.' + this.factoryAccount">
                        {{ dao[0] + '.' + this.factoryAccount }} <MDBIcon size="sm" icon="external-link-alt" iconStyle="fas" />
                      </a>
                    </td>
                    <td class="text-end">
                      <span class="fw-bold">{{ dao[1].ft_name }}</span>
                      <br>
                      <span class="fw-light">{{ n(dao[1].ft_amount) }}</span>
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
import Breadcrumb from '@/components/daoList/Breadcrumb.vue'
import DAOs from '@/data/DAOs'
import {
  MDBContainer, MDBTable, MDBProgress, MDBProgressBar
  , MDBCard, MDBCardBody, MDBCardTitle, MDBCardText, MDBIcon
} from 'mdb-vue-ui-kit'
import { useI18n } from 'vue-i18n'
import { ref } from 'vue'
import { getRandom } from '@/utils/integer'

export default {
  components: {
    Header, Breadcrumb, Footer, MDBContainer, MDBTable
    , MDBProgress, MDBProgressBar
    , MDBCard, MDBCardBody, MDBCardTitle, MDBCardText
    , MDBIcon
  },
  setup() {
    const { t, n } = useI18n()
    const daos = ref(DAOs.data().daos)
    const list = ref([])
    const tags = ref([])
    const loadingProgress = ref(0)
    return { t, n, daos, list, tags, loadingProgress}
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
        console.log(r)
        this.list = r[0]
        this.tags = r[1]
        this.loadingProgress = 100
      }).catch((e) => {
        console.log(e)
      })
      this.loadingProgress = getRandom(25, 75)
    }
  }
}
</script>