<template>
  <Header></Header>
  <main>
    <MDBContainer>
      <Breadcrumb :list-name="'organization'" />
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
                    <th scope="col" class="text-start">{{ t('default.wallet') }}</th>
                    <th scope="col" class="text-end">{{ t('default.tokens') }}</th>
                    <th scope="col" class="text-end">{{ t('default.count') }}</th>
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
                    <td class="fw-bold text-start"><router-link :to="{ name: 'dao', params: {id: dao[0] + '.' + this.factoryAccount}}">{{ dao[1].name }}</router-link></td>
                    <td class="text-start"><a class="text-reset font-weight-bold" :href="walletUrl + '/accounts/' + dao[0] + '.' + this.factoryAccount">{{ dao[0] + '.' + this.factoryAccount }}</a></td>
                    <td class="text-end">{{ dao[1].ft_name }}</td>
                    <td class="fw-bold text-end text-primary">{{ n(dao[1].ft_amount) }}</td>
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
import Header from '@/views/layout/Header.vue'
import Footer from '@/views/layout/Footer.vue'
import DAOs from '@/types/DAOs'
import {
  MDBContainer, MDBTable, MDBProgress, MDBProgressBar
  , MDBCard, MDBCardBody, MDBCardTitle, MDBCardText
} from 'mdb-vue-ui-kit'
import { useI18n } from 'vue-i18n'
import { ref } from 'vue'
import Breadcrumb from './dao_list/Breadcrumb.vue'
import { getRandom } from '@/utils/integer'

export default {
  components: {
    Header, Breadcrumb, Footer, MDBContainer, MDBTable
    , MDBProgress, MDBProgressBar
    , MDBCard, MDBCardBody, MDBCardTitle, MDBCardText
  },
  setup() {
    const { t, n } = useI18n()
    const daos = ref(DAOs.data().daos)
    const list = ref([])
    const loadingProgress = ref(0)
    return { t, n, daos, list, loadingProgress}
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
      this.nearService.getDaoList()
        .then(r => {
          this.list = r
          this.loadingProgress = 100
        })
        .catch((e) => {
          console.log(e)
        })
      this.loadingProgress = getRandom(25, 75)
    }
  }
}
</script>