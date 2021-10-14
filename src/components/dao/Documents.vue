<template>
  <div class="container mb-2">
    <MDBCard>
      <MDBCardBody class="text-start">
        <MDBCardTitle>{{ t('default.documents') }}</MDBCardTitle>
          <div v-if="docs.files.length > 0">
            <MDBTable sm responsive striped>
              <thead>
                <tr>
                  <th scope="col">#</th>
                  <th scope="col"></th>
                  <th scope="col">{{ t("default.name")}}</th>
                  <th scope="col">{{ t("default.category")}}</th>
                  <th scope="col" style="min-width:200px">{{ t("default.description")}}</th>
                  <th scope="col" style="min-width:200px">{{ t("default.tags")}}</th>
                  <th scope="col">{{ t("default.valid")}}</th>
                  <th scope="col">{{ t("default.version")}}</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(doc, index) in docs.files" :key="index">
                  <td>{{ index + 1 }}</td>
                  <td><MDBIcon :icon="getIcon(doc.ext)" iconStyle="fas" /></td>
                  <td class="fw-bold text-start"><a href="#" @click="openDoc(index)">{{ doc.name }} <MDBIcon v-if="doc.ext.includes('url')" size="sm" icon="external-link-alt" iconStyle="fas" /></a></td>
                  <td class="text-start">{{ doc.category }}</td>
                  <td>{{ doc.description }}</td>
                  <td class="text-start">{{ doc.tags.join(', ') }}</td>
                  <td class="text-start" :class="doc.valid ? 'text-success' : 'text-danger'"><MDBIcon style="font-size:25px" :icon="doc.valid ? 'check-circle' : 'times-circle'" iconStyle="far" /></td>
                  <td class="text-start">{{ doc.version }}</td>
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
import { ref } from "vue";
import { MDBCard, MDBCardBody, MDBCardTitle, MDBIcon, MDBTable } from 'mdb-vue-ui-kit'
import { useI18n } from "vue-i18n";
import ModalDocument from '@/components/dao/ModalDocument'
import _ from 'lodash'

export default {
  components: {
    MDBCard, MDBCardBody, MDBCardTitle, MDBIcon, MDBTable, ModalDocument
  },
  props: {
    docs: {
      type: Object,
      required: true,
    },
  },
  setup() {
    const { t } = useI18n();
    const modalDocument = ref(0)
    const fetchedDocs = ref({})
    const selectedDoc = ref({})
    return { t, modalDocument, fetchedDocs, selectedDoc};
  },
  computed: {
    ipfsService() {
      return this.$store.getters['ipfs/getService']
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

      if (_.indexOf(this.fetchedDocs, doc.ipfs_hash) == -1) {
        this.fetchedDocs[doc.ipfs_hash] = await this.ipfsService.retrieveFiles(doc.ipfs_hash)
      } else {
        null
      }

      doc.data = this.fetchedDocs[doc.ipfs_hash][0]

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