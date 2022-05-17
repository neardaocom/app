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
                {{t('default.download_text')}}
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
                {{downloaded ? t('default.upgrade_text') : ''}}
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
import { ref, toRefs, watch, inject } from "vue";
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
    const config = inject('config')
    const { t } = useI18n();

    const { show } = toRefs(props)

    const factoryAccount = computed(() => (config.near.contractName))
    const active = ref(false)
    
    const openModal = () => { active.value = true }

    watch(show, openModal)

    

    const downloaded = ref(false)

    return {
      t, active, factoryAccount, downloaded
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
          this.$logger.error('D', 'app@components/dao/ModalUgprade', 'DownloadNewVersion-blockchain', `Failed to download new DAO version [${this.contractId}]`)
          this.$logger.error('B', 'app@components/dao/ModalUgprade', 'DownloadNewVersion-blockchain', `Failed to download new DAO version [${this.contractId}]`)
          this.$notify.danger(this.t('default.notify_download_new_version_fail_title'),  this.t('default.notify_blockchain_fail') + " " +  this.t('default.notify_download_new_version_fail_message'))
          this.$notify.flush()
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
          this.$logger.error('D', 'app@components/dao/ModalUgprade', 'UpgradeDao-blockchain', `Failed to upgrade DAO [${this.contractId}]`)
          this.$logger.error('B', 'app@components/dao/ModalUgprade', 'UpgradeDao-blockchain', `Failed to upgrade DAO [${this.contractId}]`)
          this.$notify.danger(this.t('default.notify_upgrade_dao_fail_title'),  this.t('default.notify_blockchain_fail') + " " +  this.t('default.notify_upgrade_dao_fail_message'))
          this.$notify.flush()
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
        this.$logger.error('D', 'app@components/dao/ModalUgprade', 'CompareDaoNewestHash-blockchain', `Failed to load version hash [${this.contractId}]`)
        this.$logger.error('B', 'app@components/dao/ModalUgprade', 'CompareDaoNewestHash-blockchain', `Failed to load version hash [${this.contractId}]`)
        console.log(e)
      }
    }

  }
};
</script>