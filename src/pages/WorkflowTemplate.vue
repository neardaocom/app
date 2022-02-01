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
                <div class="col-6 col-md-4 col-lg-2 text-end">
                  <MDBSelect v-model:options="filterOrder.options" v-model:selected="filterOrder.selected" />
                </div>
              </div>
              <MDBProgress class="my-1">
                <MDBProgressBar :value="fetchProgress" />
              </MDBProgress>
              <MDBTable responsive striped>
                <thead>
                  <tr>
                    <!-- <th scope="col"></th>-->
                    <th scope="col">#</th>
                    <th scope="col" class="text-start">{{ t('default.name') }}</th>
                    <th scope="col" class="text-start">{{ t('default.version') }}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(template, index) in dataResults" :key="index">
                    <td>{{ template.id }}</td>
                    <td class="text-start">
                      <router-link class="fw-bold" :to="{ name: 'workflow', params: {id: template.id}}">{{ template.name }}</router-link>
                    </td>
                    <td class="text-start">
                      v{{ template.version }}
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
import {
  MDBContainer, MDBTable, MDBProgress, MDBProgressBar
  , MDBCard, MDBCardBody, MDBCardText, MDBIcon
  , MDBInput, MDBSelect,
} from 'mdb-vue-ui-kit'
import { useI18n } from 'vue-i18n'
import { useTemplateList } from "@/hooks/workflow";
import { onMounted } from 'vue'

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
    const { dataSource, dataResults, fetchProgress, fetch, filterSearch, filterOrder, filter } = useTemplateList()

    onMounted(() => {
      fetch()
      filter()
    })

    return {
      t, n, dataSource, dataResults, fetchProgress, filterSearch, filterOrder, filter
    }
  },
}
</script>