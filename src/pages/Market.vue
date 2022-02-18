<template>
  <Header></Header>
  <main>
    <MDBContainer>
      <Breadcrumb />
    </MDBContainer>

    <MDBContainer>
      <h1 class="text-start" style="font-size: 3rem">{{ t('default.market')}}</h1>
      <p class="text-start text-muted">{{ t('default.workflows_header')}}</p>

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
                    <th scope="col" class="text-start">{{ t('default.type') }}</th>
                    <th scope="col" class="text-start">{{ t('default.creator') }}</th>
                    <th scope="col" class="text-start">{{ t('default.version') }}</th>
                    <th scope="col" class="text-start">{{ t('default.provider') }}</th>
                    <th scope="col" class="text-start">{{ t('default.code') }}</th>
                  </tr>
                </thead>

                <tbody>

                  <tr>
                    <td colspan="7" class="p-0">
                      <MDBProgress class="my-1">
                        <MDBProgressBar bg="primary" :value="fetchProgress" />
                      </MDBProgress>
                    </td>
                  </tr>

                  <tr v-for="(template, index) in dataResults" :key="index">
                    <td>{{ index + 1 }}</td>
                    <td class="text-start">
                      <router-link v-if="false" class="h6" :to="{ name: 'market-workflow', params: {id: template.id}}">{{ template.name }}</router-link>
                      <span v-else class="h6">{{ t('default.wf_templ_' + template.code) }}</span>
                    </td>
                    <td class="text-start">{{ t('default.workflows') }}</td>
                    <td class="text-start">{{ creator.name }}</td>
                    <td class="text-start">v{{ template.version }}</td>
                    <td class="text-start">{{ provider.name }}</td>
                    <td class="text-start">#{{ template.id }} {{ template.code }}</td>
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
import Breadcrumb from '@/components/market/Breadcrumb.vue'
import {
  MDBContainer, MDBTable, MDBProgress, MDBProgressBar,
  MDBCard, MDBCardBody, MDBCardText, MDBInput,
  MDBIcon,
  MDBSelect,
} from 'mdb-vue-ui-kit'
import { useI18n } from 'vue-i18n'
import { useTemplateList, useCreators } from "@/hooks/workflow";
import { onMounted, watch } from 'vue'

export default {
  components: {
    Header, Breadcrumb, Footer, MDBContainer, MDBTable
    , MDBProgress, MDBProgressBar
    , MDBCard, MDBCardBody, MDBCardText
    , MDBIcon
    , MDBInput
    , MDBSelect
  },
  setup() {
    const { t, n } = useI18n()
    const { dataSource, dataResults, fetchProgress, fetch, filterSearch, filterOrder, filterOrderOptions, filter } = useTemplateList()
    const { creator, provider } = useCreators()

    onMounted(() => {
      fetch()
    })

    watch([filterSearch, filterOrder], () => { filter() })

    return {
      t, n, dataSource, dataResults, creator, provider, fetchProgress, filterSearch, filterOrder, filterOrderOptions, filter,
    }
  },
}
</script>