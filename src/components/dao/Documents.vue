<template>
  <div class="container mb-2">
    <MDBCard>
      <MDBCardBody class="text-start">
        <div v-if="docs.files.length > 0">
          <div class="row mt-1">
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
              <MDBCheckbox :label="filterType.pdf.name" inline v-model="filterType.pdf.active"/>
              <MDBCheckbox :label="filterType.link.name" inline v-model="filterType.link.active"/>
              <MDBCheckbox :label="filterType.html.name" inline v-model="filterType.html.active"/>
            </div>
            <div class="col-12 col-md-6 col-lg-9 text-end pt-1 ps-4">
              
            </div>
          </div>
          <MDBProgress class="my-1">
            <MDBProgressBar :value="100" />
          </MDBProgress>
          <MDBTable sm responsive striped>
            <thead>
              <tr>
                <th scope="col">#</th>
                <th scope="col"></th>
                <th scope="col">{{ t("default.name")}}</th>
                <th scope="col">{{ t("default.category")}}</th>
                <th scope="col" style="min-width:200px">{{ t("default.description")}}</th>
                <!-- <th scope="col" style="min-width:200px">{{ t("default.tags")}}</th>-->
                <th scope="col">{{ t("default.valid")}}</th>
                <th scope="col">{{ t("default.version")}}</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(doc, index) in results" :key="index">
                <td>{{ doc.index + 1 }}</td>
                <td><MDBIcon :icon="getIcon(doc.ext)" iconStyle="fas" /></td>
                <td class="fw-bold text-start"><a href="#" @click="openDoc(doc.index)">{{ doc.name }} <MDBIcon v-if="doc.ext.includes('url')" size="sm" icon="external-link-alt" iconStyle="fas" /></a></td>
                <td class="text-start">{{ doc.category }}</td>
                <td class="text-truncate">{{ doc.description }}</td>
                <!-- <td class="text-start">{{ doc.tags.join(', ') }}</td>-->
                <td class="text-start" :class="doc.valid ? 'text-success' : 'text-danger'"><MDBIcon style="font-size:25px" :icon="doc.valid ? 'check-circle' : 'times-circle'" iconStyle="far" /></td>
                <td>
                    <!-- <DocumentVersion :list="doc.versions" :version="doc.version" :open="openOldVersion"/> -->
                    <MDBBtnGroup size="sm" role="toolbar">
                      <MDBBtn color="primary" @click="openDoc(doc.index)">{{ doc.version }}</MDBBtn>
                      <MDBBtn v-for="item in doc.versions.slice(0, 3)" :key="item.index" color="info" @click="openDoc(item.index)">{{ item.version }}</MDBBtn>
                    </MDBBtnGroup>
                </td>
                </tr>
            </tbody>
          </MDBTable>
        </div>
        <p v-if="docs.files.length == 0">{{ t("default.no_doc_files") }}</p>
      </MDBCardBody>
    </MDBCard>
  </div>
  <ModalDocument :show="modalDocument" :doc="selectedDoc"/>
</template>

<script>
import { ref, toRefs } from "vue";
import { reactive } from "@vue/reactivity";
import {
  MDBCard, MDBCardBody, MDBIcon, MDBTable
  // , MDBDropdown, MDBDropdownToggle, MDBDropdownMenu, MDBDropdownItem
  , MDBBtn, MDBBtnGroup
  , MDBInput, MDBCheckbox
  , MDBProgress, MDBProgressBar
} from 'mdb-vue-ui-kit'
import { useI18n } from "vue-i18n";
// import DocumentVersion from '@/components/dao/DocumentVersion'
import ModalDocument from '@/components/dao/ModalDocument'
import { transform } from "@/models/document"
import { toSearch } from '@/utils/string'
import _ from 'lodash'

export default {
  components: {
    MDBCard, MDBCardBody, MDBIcon, MDBTable, ModalDocument
    , MDBBtn
    , MDBBtnGroup
    , MDBInput, MDBCheckbox
    , MDBProgress, MDBProgressBar
    // , MDBDropdown, MDBDropdownToggle, MDBDropdownMenu, MDBDropdownItem
    // , DocumentVersion
  },
  props: {
    docs: {
      type: Object,
      required: true,
    },
  },
  setup(props) {
    const { docs } = toRefs(props)
    const files = transform(docs.value) // _.sortBy(transform(docs.value), ['category', 'name'])
    const { t } = useI18n();
    const modalDocument = ref(0)
    const openOldVersion = ref(0)
    const fetchedDocs = ref({})
    const selectedDoc = ref({})

    const searchQuery = ref('')
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
    return {
      t, files, modalDocument, fetchedDocs, selectedDoc, openOldVersion
      , searchQuery, filterType
    };
  },
  computed: {
    ipfsService() {
      return this.$store.getters['ipfs/getService']
    },
    results() {
      let results = this.files
      // filter
      const filterTypes = Object.values(this.filterType).filter(item => item.active).map(item => item.ext)
      if (filterTypes.length > 0) {
        results = results.filter(item => _.intersection([item.ext], filterTypes).length > 0)
      }
      // searching
      const searchText = toSearch(this.searchQuery)
      if (searchText.length > 2) {
        results = results.filter(item => item.search.includes(searchText))
      }
      // order
      results = _.sortBy(results, ['name', 'category'])
      return results
    },
  },
  methods: {
    getIcon(type) {
      let icon = ''
      switch (type) {
        case 'pdf':
          icon = 'file-pdf'
          break;
        case 'html':
          icon = 'file-alt'
          break;
        case 'url':
          icon = 'link'
          break;
        default:
          break;
      }
      return icon
    },
    async openDoc(index) {
      let doc = this.docs.files[index]

      if (_.indexOf(this.fetchedDocs, doc.ipfs_cid) == -1) {
        this.fetchedDocs[doc.ipfs_cid] = await this.ipfsService.retrieveFiles(doc.ipfs_cid)
      } else {
        null
      }

      doc.data = this.fetchedDocs[doc.ipfs_cid][0]

      switch (doc.ext) {
        case 'url': {
          const doc_link = await doc.data.text();
          window.open(doc_link, "_blank");
          break;
        }
        case 'pdf':
        case 'html': {
          this.selectedDoc = doc;
          this.modalDocument += 1;
          break;
        }
        default:
          console.log('Undefined doc.ext: ' + doc.ext);
      }
    }
  }
};
</script>