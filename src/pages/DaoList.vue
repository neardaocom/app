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
        <MDBInput
          inputGroup
          formOutline
          wrapperClass="mb-3 my_filter_form"
          v-model="searchQuery"
          size="sm"
          aria-describedby="search-addon"
          :aria-label="t('default.search')"
        >
          <template #prepend>
            <span class="input-group-text border-0" id="search-addon"><MDBIcon icon="search" iconStyle="fas" /></span>
          </template>
        </MDBInput>
      </div>
      <div class="col-12 col-md-6 col-lg-9 text-start pt-1 ps-4">
        <small> <MDBCheckbox  :label="filterTag.agency.name" inline v-model="filterTag.agency.active" class="rounded-3"/> </small>
        <small> <MDBCheckbox :label="filterTag.club.name" inline v-model="filterTag.club.active" class="rounded-3"/> </small>
        <small> <MDBCheckbox :label="filterTag.project.name" inline v-model="filterTag.project.active" class="rounded-3"/> </small>
        <small> <MDBCheckbox :label="filterTag.startup.name" inline v-model="filterTag.startup.active" class="rounded-3"/> </small>
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
                    <th scope="col" class="text-start">{{ t('default.organization') }}</th>
                    <th scope="col" class="text-start"></th>
                    <th scope="col" class="text-start">{{ t('default.wallet') }}</th>
                    <th scope="col" class="text-end">{{ t('default.dao_funds') }}</th>
                  </tr>
                </thead>
                
                <tbody>

                  <tr>
                    <td colspan="5" class="p-0">
                      <MDBProgress class="my-1">
                        <MDBProgressBar bg="secondary" :value="loadingProgress" />
                      </MDBProgress>
                    </td>
                  </tr>

                  <tr v-for="(dao, index) in results" :key="index">
                    <!-- <td><a @click="favorite_switch(dao.id)" class="">
                        <i v-if="favorites.indexOf(dao.id) >= 0" class="fas text-warning fa-star fa-xs pe-1"></i>
                        <i v-else class="far fa-star fa-xs pe-1" ></i>
                      </a>
                    </td>-->
                    <td>{{ dao.index + 1 }}</td>
                    <td class="text-start">
                      <router-link class="h6 color-dark" :to="{ name: 'dao', params: {id: dao.id + '.' + this.factoryAccount}}">{{ dao.name }} <MDBIcon v-if="dao.location != null" :flag="dao.location"/></router-link>
                      <br>
                      <span class="fw-light">{{dao.description}}</span>
                    </td>
                    <td class="text-start">
                      <span
                        class="badge bg-secondary"
                        v-for="(tag, index) in dao.tags"
                        :key="index"
                        >{{ tag }}</span
                      >
                    </td>
                    <td class="text-start">
                      <a class="text-reset" target="_blank" :href="config.near.walletUrl + '/accounts/' + dao.id + '.' + this.factoryAccount">
                        {{ dao.id + '.' + this.factoryAccount }} <i class="bi bi-box-arrow-up-right color-secondary ms-1"/>
                      </a>
                    </td>
                    <td class="text-end">
                      <template v-if="dao.treasuryAmountUsd">
                        <span class="fw-bold me-1">{{ dao.treasuryAmountUsd }}</span><span class="text-muted">USD</span>
                      </template>
                      <template v-else-if="dao.treasuryAmount">
                        <span class="fw-bold me-1">{{ dao.treasuryAmoun }}</span><span class="text-muted">{{ dao.ftName }}</span>
                      </template>
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
import {
  MDBContainer, MDBTable, MDBProgress, MDBProgressBar,
   MDBCard, MDBCardBody, MDBCardText, MDBIcon, MDBInput,
   MDBCheckbox
} from 'mdb-vue-ui-kit'
import { useI18n } from 'vue-i18n'
import { ref, inject } from 'vue'
import { reactive } from "@vue/reactivity";
import StringHelper from '@/models/utils/StringHelper'
import loIntersection from "lodash/intersection"

import { useList } from "@/hooks/daoList";
//import { useList } from "@/hooks/search";


export default {
  components: {
    Header, Breadcrumb, Footer, MDBContainer, MDBTable
    , MDBProgress, MDBProgressBar
    , MDBCard, MDBCardBody, MDBCardText
    , MDBIcon
    , MDBInput
    , MDBCheckbox
  },
  setup() {
    const config = inject('config')
    const { t, n } = useI18n()

    const { loadingProgress, list, factoryAccount } = useList(config.value)
    // const { searchText, searchOrder, searchOrderOptions, search } = useList()

    const searchQuery = ref('')
    const filterTag = reactive({
      agency: {
        name: t('default.agency'),
        active: false,
      },
    // const { nearService, wallet } = useNear()
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
      t, n, config, list, loadingProgress, searchQuery, filterTag, factoryAccount
    }
  },
  computed: {
    results() {
      let results = this.list
      // filter
      const filterTags = Object.values(this.filterTag).filter(item => item.active).map(item => item.name)
      if (filterTags.length > 0) {
        results = results.filter(item => loIntersection(item.tags, filterTags).length > 0)
      }
      // searching
      const searchText = StringHelper.toSearch(this.searchQuery)
      if (searchText.length > 2) {
        results = results.filter(item => item.search.includes(searchText))
      }
      // order
      return results
    }
  },
}
</script>