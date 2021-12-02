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
          <MDBListGroup>
            <MDBListGroupItem :color="downloaded ? 'success' :  'dark'" >
              <div class="d-flex w-100 justify-content-between">
                <h5 class="mb-1">{{t('default.download_new_version')}}</h5>
                  {{downloaded ? t('default.done') : t('default.click_to_download')  }}
              </div>
              <p class="mb-1">
                {{t('default.')}}
              </p>
              <div class="d-flex w-100 flex-row-reverse">
                <MDBBtn v-if="!downloaded" @click="downloadNewVersion" color="primary" >
                  {{t('default.download')}} <MDBIcon icon="download"></MDBIcon>
                </MDBBtn>
              </div>
            </MDBListGroupItem>
            <MDBListGroupItem :disabled="!downloaded" :color="downloaded ? 'dark' :  'light'">
              <div class="d-flex w-100 justify-content-between">
                <h5 class="mb-1">{{t('default.upgrade_new_version')}}</h5>
                  {{downloaded ? t('default.click_to_upgrade') : t('default.first_download_new_version')  }}
                  
              </div>
              <p class="mb-1">
                {{t('default.')}}
              </p>
              <div class="d-flex w-100 flex-row-reverse">
                <MDBBtn v-if="downloaded" @click="upgrade" color="primary" >
                  {{t('default.upgrade')}} <MDBIcon icon="arrow-circle-up"></MDBIcon>
                </MDBBtn>
              </div>
            </MDBListGroupItem>
          </MDBListGroup>
        </MDBModalBody>
        <MDBModalFooter>
            <MDBBtn color="secondary" @click="close()">{{ t('default.close') }}</MDBBtn>
        </MDBModalFooter>
    </MDBModal>
</template>

<script>
import { ref, toRefs, watch } from "vue";
import { useI18n } from "vue-i18n";
import {
  MDBBtn,
  MDBIcon,
  MDBModal,
  MDBModalHeader,
  MDBModalTitle,
  MDBModalBody,
  MDBModalFooter,
  MDBListGroup,
  MDBListGroupItem
} from "mdb-vue-ui-kit";

export default {
  components: {
    MDBBtn, MDBIcon, MDBModal, MDBModalHeader, MDBModalTitle, MDBModalBody, MDBModalFooter, MDBListGroup, MDBListGroupItem
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

    const downloaded = ref(true)

    return {
      t, active, downloaded
    };
  },
  async mounted() {
    if (await this.compareDaoNewestHash()){
      this.downloaded = true
    }

    if(localStorage.download_new_version === 'true'){
      this.active = true
    } 
    localStorage.download_new_version = 'false'
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
    downloadNewVersion() {
      localStorage.download_new_version = 'true'
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

    upgrade(){
      // Blockchain
      this.nearService.upgrade(
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
      async compareDaoNewestHash(){
      try{
        const daoHash = await this.nearService.getDaoVersionHash(this.contractId)
        const newestHash = await this.nearService.getNewestVersionHash()
        return daoHash === newestHash
      }catch(e){
        console.log(e);
      }
    }

  }
};
</script>