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
      <pdf class="m-3" v-if="doc.ext == 'pdf'" :src="content" :page="1"></pdf>
      <section class="m-3" v-if="doc.ext == 'html'" v-html="content"></section>
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
} from "mdb-vue-ui-kit";
import pdf from 'pdfvuer'

export default {
  components: {
    MDBModal, MDBModalHeader, MDBModalTitle, MDBModalBody
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
    }
  },
  setup(props) {
    const { t } = useI18n();

    const { show, doc } = toRefs(props)

    const active = ref(false)
    const content = ref('')
    
    const openModal = () => { active.value = true }
    const changeDoc = async () => { 
      console.log('Change doc')
      if (props.doc.name) {
        // console.log(props.doc.ext)
        switch (props.doc.ext) {
          case 'html':
            content.value = await props.doc.data.text()
            break;
          case 'pdf':
            content.value = URL.createObjectURL(props.doc.data)
            break;
          default:
            break;
        }
        // console.log(content.value)
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