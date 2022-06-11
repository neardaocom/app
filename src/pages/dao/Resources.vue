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
import { ref, toRefs, inject } from "vue";
import { computed, reactive } from "@vue/reactivity";
import {
  MDBCard, MDBCardBody, MDBCheckbox
} from 'mdb-vue-ui-kit'
import { useI18n } from "vue-i18n";
// import DocumentVersion from './DocumentVersion'
import ModalDocument from './modals/ModalDocument.vue'
import { transform } from "@/models/document"
import StringHelper from '@/models/utils/StringHelper'
import _ from 'lodash'
import { useIPFS } from "@/hooks/vuex";
import { fetch } from "@/models/ipfs";
import { DAODocsFileType } from '@/models/dao/types/dao';
import { useRouter } from "@/hooks/dao";
import Search from "@/components/ui/Search.vue"
import ResourcesTable from '@/components/dao/resources/ResourcesTable.vue'
import IntegerHelper from '@/models/utils/IntegerHelper';
import NoData from '@/components/ui/NoData.vue'

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
  setup(props) {
    const config = inject('config')

    const { docs } = toRefs(props)
    //console.log(docs.value);
    const files = transform(docs.value) // _.sortBy(transform(docs.value), ['category', 'name'])
    const { t } = useI18n();
    const modalDocument = ref(0)
    const openOldVersion = ref(0)
    const docData = ref(null)
    const fetchedDocs = ref({})
    const selectedDoc = ref({})
    const { ipfsService } = useIPFS()
    const loadingProgress = ref(0)
    const fileLoading = ref(false)

    const { rSearch } = useRouter(config)

    const searchQuery = ref(rSearch.value)
    const filterType = reactive({
      link: {
        name: t('default.link'),
        ext: 'url',
        active: false,
      },
      pdf: {
        name: t('default.pdf'),
        ext: 'pdf',
        active: false,
      },
      html: {
        name: t('default.document'),
        ext: 'html',
        active: false,
      },
    })

    const results = computed(() => {
      let results = files

      loadingProgress.value = IntegerHelper.getRandom(5, 15)
      // filter
      const filterTypes = Object.values(filterType).filter(item => item.active).map(item => item.ext)
      if (filterTypes.length > 0) {
        results = results.filter(item => _.intersection([item.ext], filterTypes).length > 0)
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

    const open = async (index) => {
      fileLoading.value = true
      const doc = docs.value.files[index]
      fetch(doc, ipfsService.value).then(r => {
        console.log(doc);
        switch (doc.type) {
          case DAODocsFileType.url: {
            fileLoading.value = false
            window.open(r, "_blank");
            break;
          }
          case DAODocsFileType.plain: 
          case DAODocsFileType.binaryPdf:
          case DAODocsFileType.html: {
            selectedDoc.value = doc;
            docData.value = r
            fileLoading.value = false
            modalDocument.value += 1;
            break;
          }
          default:
            fileLoading.value = false
            console.log('Undefined doc.ext: ' + doc.ext);
        }
      })
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
