<template>
  <div class="container mb-2 text-start">
    <div v-if="docs.files.length > 0" >
      <div class="row my-4 mx-4">
        <div class="col-6 col-md-4 col-lg-3">
          <Search v-model="searchQuery"/>
        </div>
        <div v-if="false" class="col-12 col-md-6 col-lg-9 text-start pt-1 ps-4">
          <MDBCheckbox :label="filterType.pdf.name" inline v-model="filterType.pdf.active"/>
          <MDBCheckbox :label="filterType.link.name" inline v-model="filterType.link.active"/>
          <MDBCheckbox :label="filterType.html.name" inline v-model="filterType.html.active"/>
        </div>
        <div class="col-12 col-md-6 col-lg-9 text-end pt-1 ps-4">
        </div>
      </div>

      <MDBCard>
        <MDBCardBody>
            <ResourcesTable :resources="results" @openResource="open" :progress="loadingProgress"  :fileLoading="fileLoading"/>
        </MDBCardBody>
      </MDBCard>
    </div>

    <NoData v-if="docs.files.length == 0" :text="t('default.no_doc_files')" hint="This is a hint" />
  </div>

  <ModalDocument :show="modalDocument" :doc="selectedDoc" :data="docData"/>
</template>

<script>
import { ref, inject } from "vue";
import { computed, reactive } from "@vue/reactivity";
import {
  MDBCard, MDBCardBody, MDBCheckbox
} from 'mdb-vue-ui-kit'
import { useI18n } from "vue-i18n";
import ModalDocument from './modals/ModalDocument.vue'
import StringHelper from '@/models/utils/StringHelper'
import _ from 'lodash'

import { useRouter } from "@/hooks/dao";
import { useResource, useResourceOpening } from "@/hooks/docs";
import Search from "@/components/ui/Search.vue"
import ResourcesTable from '@/components/dao/resources/ResourcesTable.vue'
import IntegerHelper from '@/models/utils/IntegerHelper';
import NoData from '@/components/ui/NoData.vue'
import DocsHelper from '@/models/dao/DocsHelper';

export default {
  components: {
    MDBCard, MDBCardBody, MDBCheckbox,
    ModalDocument, Search, ResourcesTable,
    NoData
  },
  props: {
    docs: {
      type: Object,
      required: true,
    },
  },
  setup() {
    const config = inject('config')
    const loader = inject('loader')
    const dao = inject('dao') 

    const ipfsService = loader.value.load('services/ipfs')

    const { files } = useResource(ipfsService, dao)

    const {fileLoading, selectedDoc, docData, modalDocument, open} = useResourceOpening(ipfsService, dao)
    // console.log(files)
    const { t } = useI18n();
    const openOldVersion = ref(0)
    const fetchedDocs = ref({})
    const loadingProgress = ref(0)

    const { rSearch } = useRouter(config)

    const searchQuery = ref(rSearch.value)
    const filterType = reactive(DocsHelper.getFilterTypes(t))

    const results = computed(() => {
      let results = files.value

      loadingProgress.value = IntegerHelper.getRandom(5, 15)
      // filter
      const filterTypes = Object.values(filterType).filter(item => item.active).map(item => item.type)
      if (filterTypes.length > 0) {
        results = results.filter(item => _.intersection([item.type], filterTypes).length > 0)
      }

      // searching
      const searchText = StringHelper.toSearch(searchQuery.value)
      if (searchText.length > 2) {
        results = results.filter(item => item.search.includes(searchText))
      }

      // order
      results = _.sortBy(results, ['name', 'category'])
      loadingProgress.value = 100
      return results
    })

    const getLastVersions = (versions) => {
      return _.orderBy(versions, ['index'], ['desc']).slice(0, 3)
    }

    return {
      t, files, modalDocument, fetchedDocs, selectedDoc, openOldVersion,
      searchQuery, filterType,
      ipfsService, docData,
      rSearch, results, getLastVersions, open, loadingProgress,
      fileLoading
    };
  }
};
</script>
