<template>
    <MDBModal
        id="modalDocument"
        tabindex="-1"
        labelledby="modalDocumentLabel"
        v-model="active"
        size="xl"
    >
        <MDBModalHeader>
        <MDBModalTitle id="modalDocumentLabel"> {{ t('default.document') + ': ' + doc.name + doc.ext + ', ' + t('default.version') + ': ' + doc.version}} </MDBModalTitle>
        </MDBModalHeader>
        <MDBModalBody class="text-start">
          <object v-if="doc.ext.includes('pdf')" type="application/pdf" :data="doc.data" width="100%" height="500px"></object>
          <iframe v-else-if="doc.ext.includes('html')" :srcdoc="doc.data" width="100%" height="500px"></iframe>
          <div v-else width="100%" height="500px">{{ doc.data }}</div>
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

export default {
  components: {
    MDBModal, MDBModalHeader, MDBModalTitle, MDBModalBody
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

    const { show } = toRefs(props)

    const active = ref(false)
    
    const openModal = () => { active.value = true }

    watch(show, openModal)

    return {
      t, active
    };
  },
  methods: {
    close() {
      this.active = false
    },
  }
};
</script>