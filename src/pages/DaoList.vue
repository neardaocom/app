<template>
  <Header></Header>
  <main>
    <MDBContainer>
      <Breadcrumb :list-name="'organizations'"/>
    </MDBContainer>

    <MDBContainer>
    <h1 class="text-start">{{ t('default.organizations')}}</h1>
    <div class="row mt-5">
      <div class="col-6 col-md-4 col-lg-3">
        <Search v-model="searchQuery"/>
      </div>
      <div class="col-12 col-md-6 col-lg-9 text-start pt-1 ps-4">
        <small> <MDBCheckbox  :label="filterTag.agency.name" inline v-model="filterTag.agency.active" class="rounded-3"/> </small>
        <small> <MDBCheckbox :label="filterTag.club.name" inline v-model="filterTag.club.active" class="rounded-3"/> </small>
        <small> <MDBCheckbox :label="filterTag.project.name" inline v-model="filterTag.project.active" class="rounded-3"/> </small>
        <small> <MDBCheckbox :label="filterTag.startup.name" inline v-model="filterTag.startup.active" class="rounded-3"/> </small>
      </div>
    </div>

    <MDBProgress class="my-2">
      <MDBProgressBar bg="secondary" :value="loadingProgress" />
    </MDBProgress>

    <div class="row gx-5 mt-3">
      <div class="col-md-6" v-for="(dao, index) in results" :key="index">
        <DaoCard :dao="dao" />
      </div>
    </div> 

    </MDBContainer>
  </main>

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
  MDBCheckbox
} from 'mdb-vue-ui-kit'
import { useI18n } from 'vue-i18n'
import { ref, inject } from 'vue'
import { reactive } from "@vue/reactivity";
import StringHelper from '@/models/utils/StringHelper'
import _ from "lodash"
import DaoCard from '@/components/daoList/DaoCard.vue'
import Search from "@/components/ui/Search.vue"
import { useFetch } from "@/hooks/daoList";

export default {
  components: {
    Header,
    Breadcrumb, 
    Footer, 
    MDBContainer,
    MDBProgress, 
    MDBProgressBar,
    MDBCheckbox,
    DaoCard,
    Search
  },
  setup() {
    const { t, n } = useI18n()

    const nearDaoFactory = inject('nearDaoFactory')

    const { loadingProgress, tags, list } = useFetch(nearDaoFactory.value)

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
    return {
      t, n, list, tags, loadingProgress, searchQuery, filterTag
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
      const searchText = StringHelper.toSearch(this.searchQuery)
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
}
</script>