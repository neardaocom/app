<template>
  <MDBModal
    id="modalDocuments"
    tabindex="-1"
    labelledby="modalDocumentsLabel"
    v-model="active"
    size="xl"
  >
    <MDBModalHeader>
      <MDBModalTitle id="modalDocumentsLabel">
        {{ t("default.documents") }}
      </MDBModalTitle>
    </MDBModalHeader>
    <MDBModalBody class="text-start">
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
                    <td class="text-center" :class="doc.valid ? 'text-success' : 'text-danger'"><MDBIcon style="font-size:25px" :icon="doc.valid ? 'check-circle' : 'times-circle'" iconStyle="far" /></td>
                    <td class="text-center"><a href="#" target="_blank" class="link-dark"><MDBIcon style="font-size:25px" icon="external-link-alt" iconStyle="fas" /></a></td>
        </tr>
    </tbody>
  </MDBTable>
    </div>
    <p v-if="docs.files.length == 0">{{ t("default.no_doc_files") }}</p>

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
  MDBTable,
  MDBIcon,
} from "mdb-vue-ui-kit";

export default {
  components: {
    MDBModal,
    MDBModalHeader,
    MDBModalTitle,
    MDBModalBody,
    MDBTable,
    MDBIcon,
  },
  props: {
    show: {
      type: Number,
      required: true,
    },
    contractId: {
      type: String,
      required: true,
    },
    docs: {
      type: Object,
      required: true,
    }
  },
  setup(props) {
    console.log(props.docs)
    const { t } = useI18n();

    const { show } = toRefs(props);

    const active = ref(false);

    const openModal = () => {
      active.value = true;
    };

    watch(show, openModal);

    return {
      t,
      active,
    };
  },
  computed: {
    factoryAccount() {
      return this.$store.getters["near/getFactoryAccount"];
    },
    accountId() {
      return this.$store.getters["near/getAccountId"];
    },
    nearService() {
      return this.$store.getters["near/getService"];
    },
  },
  methods: {
    close() {
      this.active = false;
    },
  },
};
</script>