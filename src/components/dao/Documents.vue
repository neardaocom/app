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
        <th scope="col">{{ t("default.name")}}</th>
        <th scope="col" style="min-width:200px">{{ t("default.description")}}</th>
        <th scope="col">{{ t("default.category")}}</th>
        <th scope="col" style="min-width:200px">{{ t("default.tags")}}</th>
        <th scope="col">{{ t("default.valid")}}</th>
        <th scope="col">{{ t("default.version")}}</th>
        <th scope="col">{{ t("default.link")}}</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="(doc, index) in docs.files" :key="index">
                    <td><MDBIcon :icon="doc.ext.includes('pdf') ? 'file-pdf' : 'file-alt'" style="font-size:25px" iconStyle="far" /></td>
                    <td>{{ doc.name + doc.ext }}</td>
                    <td class="fw-bold text-start">{{ doc.description }}</td>
                    <td class="text-start">{{ doc.category }}</td>
                    <td class="text-start">{{ doc.tags.join(', ') }}</td>
                    <td class="text-start">{{ doc.version }}</td>
                    <td class="text-start" :class="doc.valid ? 'text-success' : 'text-danger'"><MDBIcon style="font-size:25px" :icon="doc.valid ? 'check-circle' : 'times-circle'" iconStyle="far" /></td>
                    <td class="text-start"><a @click="openDoc(doc)" class="link-dark"><MDBIcon style="font-size:25px" icon="external-link-alt" iconStyle="fas" /></a></td>
        </tr>
    </tbody>
  </MDBTable>
    </div>
    <p v-if="docs.files.length == 0">{{ t("default.no_doc_files") }}</p>
      </MDBCardBody>
    </MDBCard>
  </div>

      <ModalDocument :show="modalDocument" :doc="selected_doc" />
</template>

<script>
import { ref } from "vue";
import { MDBCard, MDBCardBody, MDBCardTitle, MDBIcon, MDBTable } from 'mdb-vue-ui-kit'
import { useI18n } from "vue-i18n";
import ModalDocument from '@/components/dao/ModalDocument'

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
    const fetchedDocs = ref({});
    const selected_doc = ref({})
    return { t, modalDocument, fetchedDocs, selected_doc};
  },
  computed: {
  },
  methods: {
    openDoc(doc) {
      this.modalDocument += 1;
      if (doc.uuid in this.fetchedDocs) {
        doc = this.fetchedDocs[doc.uuid];
      } else {
        //TODO get doc from ipfs service
        //doc.data = 'Hello darkness, my old friend...'
        //doc.ext = '.whatever'
        //doc.data = '<!DOCTYPE html><html><head><title>Test tiel</title></head><body style="color:red">Hello NEAR</body></html>'
        //doc.ext = 'html'
        //doc.data = 'http://www.africau.edu/images/default/sample.pdf'
        //doc.ext = 'pdf'
        this.fetchedDocs[doc.uuid] = doc
      }
      this.selected_doc = doc;
    }
  }
};
</script>