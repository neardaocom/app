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
                  <tr v-for="dao in daos" :key="dao.id">
                    <!-- <td><a @click="favorite_switch(dao.id)" class="">
                        <i v-if="favorites.indexOf(dao.id) >= 0" class="fas text-warning fa-star fa-xs pe-1"></i>
                        <i v-else class="far fa-star fa-xs pe-1" ></i>
                      </a>
                    </td>-->
                    <td>{{ dao.id }}</td>
                    <td class="fw-bold text-start"><router-link :to="{ name: 'dao', params: {id: dao.wallet}}">{{ dao.name }}</router-link></td>
                    <td class="text-start"><a class="text-reset font-weight-bold" :href="'https://explorer.near.org/accounts/' + dao.wallet">{{ dao.wallet }}</a></td>
                    <td class="text-end">POD</td>
                    <td class="fw-bold text-end text-primary">{{ n(1_000_000) }}</td>
                  </tr>
                  <tr v-for="(dao, index) in list" :key="index">
                    <!-- <td><a @click="favorite_switch(dao.id)" class="">
                        <i v-if="favorites.indexOf(dao.id) >= 0" class="fas text-warning fa-star fa-xs pe-1"></i>
                        <i v-else class="far fa-star fa-xs pe-1" ></i>
                      </a>
                    </td>-->
                    <td>{{ index + 2 }}</td>
                    <td class="fw-bold text-start"><router-link :to="{ name: 'dao', params: {id: dao[0] + '.' + 'podilnik.testnet'}}">{{ dao[1].name }}</router-link></td>
                    <td class="text-start"><a class="text-reset font-weight-bold" :href="'https://explorer.near.org/accounts/' + dao[0] + '.' + 'podilnik.testnet'">{{ dao[0] + '.' + 'podilnik.testnet' }}</a></td>
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
import DAOs from '@/repository/DAOs'
import {
  MDBContainer, MDBTable, MDBProgress, MDBProgressBar
  , MDBCard, MDBCardBody, MDBCardTitle, MDBCardText
} from 'mdb-vue-ui-kit'
import { useI18n } from 'vue-i18n'
import { ref, reactive } from 'vue'
import _ from 'lodash'
import Breadcrumb from './dao_list/Breadcrumb.vue'

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
    const search = ref('')
    const filter = reactive({})
    const favorites = [1]
    const loadingProgress = ref(0)
    return { t, n, daos, search, filter, favorites, list, loadingProgress}
  },
  computed: {
    dao_favorites() {
      return this.daos.map(dao => dao.id)
      //this.data.map(tooth => this.parseMeasure(tooth.measure))
    },
    factoryContract() {
      return this.$store.getters['near/getFactoryContract']
    }
  },
  methods: {
    favorite_switch(id) {
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
    },
    parseMeasure(measure) {
        var measures = []
        var measure_space = measure.split(' ')
        for (let i in measure_space) {
            console.log(measure_space[i])
            var measure_list = measure_space[i].split('-')
            for (let j in measure_list) {
                // console.log(measure)
                measures.push(measure_list[j])
            }
        }
        console.log(measures)
        return measures
    },
    mathRandom(min, max) {
      min = Math.ceil(min);
      max = Math.floor(max);
      return Math.floor(Math.random() * (max - min + 1) + min);
    },
    fetchList() {
      this.factoryContract.get_dao_list()
        .then(r => {
          this.list = r
          this.loadingProgress = 100
        })
        .catch((e) => {
          console.log(e)
        })
      this.loadingProgress = this.mathRandom(25, 75)
    }
  },
  mounted() {
    this.loadingProgress = 10
    this.fetchList()
  }
}
</script>