<template>
  <MDBModal
    id="modalAddRightsForAction"
    tabindex="-1"
    labelledby="modalAddRightsForActionLabel"
    v-model="active"
    size="lg"
  >
    <MDBModalHeader>
      <MDBModalTitle id="modalAddRightsForActionLabel"> {{ t('default.add_rights') }} </MDBModalTitle>
    </MDBModalHeader>
    <MDBModalBody class="text-start">
      <label for="group-input" class="form-label">{{ t('default.group') }}</label>
      <MDBSelect class="text-left" id="group-input" inputGroup :formOutline="false" aria-describedby="group-addon"
        v-model:selected="formGroup"
        v-model:options="formGroupOptions"
          @keyup="validateGroup()" @blur="validateGroup()" :isValid="!errors.formGroup" :isValidated="isValidated.formGroup" :invalidFeedback="errors.formGroup"
      />
      <br/>
      <label for="rights-input" class="form-label">{{ t('default.rights') }}</label>
      <MDBSelect class="text-left" id="rights-input" inputGroup :formOutline="false" aria-describedby="rights-addon"
        v-model:selected="formRights"
        v-model:options="formRightsOptions"
          @keyup="validateRights()" @blur="validateRights()" :isValid="!errors.formRights" :isValidated="isValidated.formRights" :invalidFeedback="errors.formRights"
      />
      <br/>
      <label for="description-input" class="form-label">{{ t('default.description') }}</label>
      <MDBWysiwyg :fixedOffsetTop="58" ref="refWysiwyg">
        <section v-html="formDescription"></section>
      </MDBWysiwyg>
    </MDBModalBody>
    <MDBModalFooter>
      <MDBBtn color="secondary" @click="close()">{{ t('default.close') }}</MDBBtn>
      <MDBBtn color="primary" @click="vote()">{{ t('default.vote') }}</MDBBtn>
      </MDBModalFooter>
  </MDBModal>
</template>

<script>
import { ref, toRefs, watch } from "vue";
import { reactive } from "@vue/reactivity";
import { useI18n } from "vue-i18n";
import Validator from '@/models/utils/Validator'
import IntegerHelper from '@/models/utils/IntegerHelper'
import { makeFileFromString } from "@/services/ipfsService/IpfsService.js"
import Auction from "@/models/auction"
import {
  MDBBtn,
  //MDBInput,
  MDBSelect,
  MDBModal,
  MDBModalHeader,
  MDBModalTitle,
  MDBModalBody,
  MDBModalFooter
} from "mdb-vue-ui-kit";
import { MDBWysiwyg } from "mdb-vue-wysiwyg-editor";

export default {
  components: {
    MDBBtn
    //, MDBInput
    , MDBSelect
    , MDBModal, MDBModalHeader, MDBModalTitle, MDBModalBody, MDBModalFooter
    , MDBWysiwyg
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

    const formGroup = ref('Council')
    const formGroupOptions = ref([
        {value: 'Council', text: t('default.council')},
    ])
    const formRights = ref(null)
    const formRightsOptions = ref([
        {value: 'RefFinance', text: t('default.' + Auction.getTranslateKey('RefFinance'))},
        {value: 'SkywardFinance', text: t('default.' + Auction.getTranslateKey('SkywardFinance'))},
    ])
    const formDescription = ref('')

    const isValidated = ref({
        formGroup: false,
        formRights: false,
        formDescription: false,
    })

    const errors = reactive({});

    return {
      t, active
      , formGroup, formGroupOptions, formRights, formRightsOptions, formDescription
      , isValidated, errors
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
    ipfsService() {
      return this.$store.getters['ipfs/getService']
    },
  },
  methods: {
    validateGroup(){
      const field = "formGroup"
      const requiredVal = Validator.requiredValidator(this.formGroup)
      if (requiredVal.valid === false) {
        this.errors[field] = this.t('default.' + requiredVal.message, requiredVal.params)
      } else {
        this.errors[field] = null
      }
      this.isValidated.formGroup = true
    },
    validateRights(){
      const field = "formRights"
      const requiredVal = Validator.requiredValidator(this.formRights)
      if (requiredVal.valid === false) {
        this.errors[field] = this.t('default.' + requiredVal.message, requiredVal.params)
      } else {
        this.errors[field] = null
      }
      this.isValidated.formRights = true
    },
    validateDescription(){
      const field = "formDescription"
      this.formDescription = ref(this.$refs.refWysiwyg.getCode())
      this.errors[field] = null
      this.isValidated.formDescription = true
    },
    validate(){
      this.validateGroup()
      this.validateRights()
      this.validateDescription()
    },
    async vote() {
      this.validate()
      if (isValid(this.errors) === true) {
        //console.log(this.formGroup)
        //console.log(this.formAccount)
        // IPFS
        let ipfs_cid = null
        try {
          const name = this.accountId + '-addRightsForAction-' + IntegerHelper.getRandom(1, 999)
          ipfs_cid = await this.ipfsService.storeFiles(makeFileFromString(this.formDescription, name), name)
        } catch(e){
          this.$logger.error('D', 'app@components/dao/ModalAddRightsForAction', 'StoreFile-ipfs', 'File saving to ipfs failed')
          this.$logger.error('B', 'app@components/dao/ModalAddRightsForAction', 'StoreFile-ipfs', 'File saving to ipfs failed')
          this.$notify.danger(this.t('default.notify_save_file_ipfs_fail_title'), this.t('default.notify_ipfs_fail') + " " + this.t('default.notify_save_file_ipfs_fail_message'))
          this.$notify.flush()
          console.log(e);
          return
        }

        // BLOCKCHAIN
        this.nearService.rightForActionCall(
            this.contractId,
            this.formGroup,
            [this.formRights],
            null,
            null,
            [this.t('default.add_rights')],
            ipfs_cid,
            0.5
        ).then(r => {
            console.log(r)
            this.formRights = []
            this.formDescription = ''
            this.active = false
        }).catch((e) => {
            this.$logger.error('D', 'app@components/dao/ModalAddRightsForAction', 'AddProposal-blockchain', `Failed to add rights`)
            this.$logger.error('B', 'app@components/dao/ModalAddRightsForAction', 'AddProposal-blockchain', `Failed to add rights`)
            this.$notify.danger(this.t('default.notify_add_rights_for_action_fail_title'), this.t('default.notify_blockchain_fail') + " " + this.t('default.notify_add_rights_for_action_message', {}))
            this.$notify.flush()
            console.log(e)
        })
      }
    },
    close() {
      this.active = false
    },
  },
  mounted() {
    //this.$notify.show()
  },
};
</script>