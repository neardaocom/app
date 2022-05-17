<template>
    <MDBModal
        id="modalRemoveCouncil"
        tabindex="-1"
        labelledby="modalRemoveCouncilLabel"
        v-model="active"
        size="lg"
    >
        <MDBModalHeader>
          <MDBModalTitle id="modalRemoveCouncilLabel"> {{ t('default.remove_council') }} </MDBModalTitle>
        </MDBModalHeader>
        <MDBModalBody class="text-start">
          <label for="account-input" class="form-label">{{ t('default.account') }}</label>
          <MDBSelect class="text-left" id="account-input" inputGroup :formOutline="false" aria-describedby="account-addon" v-model:options="accountsDropdown" v-model:selected="formAccount"
              @keyup="validateAccount()" @blur="validateAccount()" :isValid="!errors.formAccount" :isValidated="isValidated.formAccount" :invalidFeedback="errors.formAccount"
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
import { ref, toRefs, watch, inject } from "vue";
import { reactive } from "@vue/reactivity";
import { useI18n } from "vue-i18n";
import Validator from '@/models/utils/Validator'
import IntegerHelper from '@/models/utils/IntegerHelper'
import { makeFileFromString } from "@/models/services/ipfsService/IpfsService.js"
import {
  MDBBtn,
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
    },
    groups: {
      type: Object,
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

    const formAccount = ref('')
    const formGroup = ref('Council')
    const formDescription = ref('')

    const isValidated = ref({
        formAccount: false,
        formGroup: false,
        formDescription: false,
    })

    const errors = reactive({});

    return {
      t, active, factoryAccount
      , formAccount, formGroup, formDescription
      , isValidated, errors
    };
  },
  computed: {
    accountId() {
      return this.$store.getters['near/getAccountId']
    },
    nearService() {
      return this.$store.getters['near/getService']
    },
    accountsDropdown() {
      return this.groups[0].members.map(member => {return {value: member.accountId, text: member.accountId}})
    },
    ipfsService() {
      return this.$store.getters['ipfs/getService']
    },
  },
  methods: {
    validateAccount(){
      const field = "formAccount"
      const requiredVal = Validator.requiredValidator(this.formAccount)
      const nearAccountVal = Validator.nearAccountValidator(this.formAccount)
      if (requiredVal.valid === false) {
        this.errors[field] = this.t('default.' + requiredVal.message, requiredVal.params)
      } else if (nearAccountVal.valid === false) {
        this.errors[field] = this.t('default.' + nearAccountVal.message, nearAccountVal.params)
      } else {
        this.errors[field] = null
      }
      this.isValidated.formAccount = true
    },
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
    validateDescription(){
      const field = "formDescription"
      this.formDescription = ref(this.$refs.refWysiwyg.getCode())
      const maxLengthVal = Validator.maxLength(this.formDescription, 100)
      if (maxLengthVal.valid === false) {
        this.errors[field] = this.t('default.' + maxLengthVal.message, maxLengthVal.params)
      } else {
        this.errors[field] = null
      }
      this.isValidated.formDescription = true
    },
    validate(){
      this.validateAccount()
      this.validateGroup()
      this.validateDescription()
    },
    async vote() {
      this.validate()
      if (isValid(this.errors) === true) {
        // console.log(this.formGroup)
        // console.log(this.formAccount)
        // IPFS
        let ipfs_cid = null
        try {
          const name = this.accountId + '-removeCouncil-' + IntegerHelper.getRandom(1, 999)
          ipfs_cid = await this.ipfsService.storeFiles(makeFileFromString(this.formDescription, name), name)
        } catch(e){
          this.$logger.error('D', 'app@components/dao/ModalRemoveCouncil', 'StoreFile-ipfs', 'File saving to ipfs failed')
          this.$logger.error('B', 'app@components/dao/ModalRemoveCouncil', 'StoreFile-ipfs', 'File saving to ipfs failed')
          this.$notify.danger(this.t('default.notify_save_file_ipfs_fail_title'),this.t('default.notify_ipfs_fail') + " " + this.t('default.notify_save_file_ipfs_fail_message'))
          this.$notify.flush()
          console.log(e);
          return
        }

        // BLOCKCHAIN
        this.nearService.addProposal(
            this.contractId
            , ipfs_cid
            , [this.t('default.remove_member')]
            , {
                'RemoveMember': {
                    group: this.formGroup,
                    account_id: (this.formAccount)
                }
            }
            , 0.5
            , this.accountId
        ).then(r => {
            console.log(r)
            this.formAccount = ''
            this.formDescription = ''
            this.active = false
        }).catch((e) => {
          const council = this.formAccount + '.' + this.factoryAccount.split('.')[1]
            this.$logger.error('D', 'app@components/dao/ModalRemoveCouncil', 'AddProposal-blockchain', `Failed to add proposal to remove council [${council}]`)
            this.$logger.error('B', 'app@components/dao/ModalRemoveCouncil', 'AddProposal-blockchain', `Failed to add proposal to remove council [${council}]`)
            this.$notify.danger(this.t('default.notify_remove_council_fail_title'),this.t('default.notify_blockchain_fail') + " " + this.t('default.notify_remove_council_fail_message', {council: council}))
            this.$notify.flush()
            console.log(e)
        })
      }
    },
    close() {
      this.active = false
    },
  }
};
</script>