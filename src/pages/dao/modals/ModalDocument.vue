<template>
  <MDBModal
      id="modalDocument"
      tabindex="-1"
      labelledby="modalDocumentLabel"
      v-model="active"
      size="xl"
  >
    <MDBModalHeader>
      <MDBModalTitle class="ms-3" id="modalDocumentLabel">{{ doc.name }} <small class="ms-4">{{ doc.category }} | v{{ doc.version }}</small></MDBModalTitle>
    </MDBModalHeader>
    <MDBModalBody class="text-start">
      <p v-if="['application/pdf', 'text/html'].includes(doc.type)" class="text-center">IPFS: <strong>{{doc.value.cid.ipfs}}</strong> [{{doc.value.cid.cid}}]</p>
      <pdf class="m-3" v-if="doc.type == 'application/pdf'" :src="content" :page="1"></pdf>
      <section class="m-3" v-else-if="doc.type == 'text/html'" v-html="content"></section>
      <section class="m-3" v-else-if="doc.type == 'text/plain'">{{content}}</section>
      <p class="m-3 text-center" v-else-if="doc.type == 'url'"><a :href="content" target="_blank"> <MDBIcon size="sm" icon="external-link-alt" iconStyle="fas" />{{ content }}</a></p>
    </MDBModalBody>
  </MDBModal>
</template>

<script>
import { ref, toRefs, watch } from "vue";
import { useI18n } from "vue-i18n";
import {
  MDBModal,
  MDBModalHeader,
  MDBModalTitle,
  MDBModalBody,
  MDBIcon
} from "mdb-vue-ui-kit";
import pdf from 'pdfvuer'

export default {
  components: {
    MDBModal, MDBModalHeader, MDBModalTitle, MDBModalBody, MDBIcon
    , pdf
  },
  props: {
    show: {
      type: Number,
      required: true
    },
    doc: {
      type: Object,
      required: true
    },
    data:{
      type: [Object, String],
      required: false
    }
  },
  setup(props) {
    const { t } = useI18n();

    const { show, doc, data } = toRefs(props)

    const active = ref(false)
    const content = ref('')
    
    const openModal = () => { active.value = true }
    const changeDoc = async () => { 
      if (doc.value.name) {
        content.value = data.value
        }
    }

    watch(show, openModal)
    watch(doc, changeDoc)

    return {
      t, active, content, changeDoc
    };
  },
  methods: {
    close() {
      this.active = false
    }

  },
  mounted() {
    this.changeDoc()
  }
};
</script>
<style src="pdfvuer/dist/pdfvuer.css"></style>