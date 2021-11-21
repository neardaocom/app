<template>
    <MDBModal
        id="modalUpgrade"
        tabindex="-1"
        labelledby="modalUpgradeLabel"
        v-model="active"
        size="lg"
    >
        <MDBModalHeader>
            <MDBModalTitle id="modalUpgradeLabel"> {{ t('default.upgrade_contract') }} </MDBModalTitle>
        </MDBModalHeader>
        <MDBModalBody class="text-start">
            {{t('default.')}}
        </MDBModalBody>
        <MDBModalFooter>
            <MDBBtn color="secondary" @click="close()">{{ t('default.close') }}</MDBBtn>
            <MDBBtn color="primary" @click="upgrade()">{{ t('default.upgrade_contract') }}</MDBBtn>
        </MDBModalFooter>
    </MDBModal>
</template>

<script>
import { ref, toRefs, watch } from "vue";
import { useI18n } from "vue-i18n";
import {
  MDBBtn,
  MDBModal,
  MDBModalHeader,
  MDBModalTitle,
  MDBModalBody,
  MDBModalFooter
} from "mdb-vue-ui-kit";

export default {
  components: {
    MDBBtn, MDBModal, MDBModalHeader, MDBModalTitle, MDBModalBody, MDBModalFooter
  },
  props: {
    show: {
      type: Number,
      required: true
    },
    contractId: {
      type: String,
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
  computed: {
    factoryAccount() {
      return this.$store.getters['near/getFactoryAccount']
    },
    accountId() {
      return this.$store.getters['near/getAccountId']
    },
    nearService() {
      return this.$store.getters['near/getService']
    },
  },
  methods: {
    async upgrade() {
        // Blockchain
        this.nearService.downloadNewVersion(
            this.contractId
        ).then(r => {
            console.log(r)
            this.active = false
        }).catch((e) => {
            console.log(e)
        })
    },

    close() {
      this.active = false
    },
  }
};
</script>