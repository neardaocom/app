<template>
    <MDBModal
        id="modalGeneral"
        tabindex="-1"
        labelledby="modalGeneralLabel"
        v-model="active"
        size="lg"
    >
        <MDBModalHeader>
        <MDBModalTitle id="modalGeneralLabel"> {{ t('default.general_proposal') }} </MDBModalTitle>
        </MDBModalHeader>
        <MDBModalBody class="text-start">
          <label for="title-id-input" class="form-label">{{ t('default.title') }}</label>
          <MDBInput id="title-id-input" inputGroup :formOutline="false" aria-describedby="title-addon" v-model="formTitle"
          @keyup="validateTitle()" @blur="validateTitle()" :isValid="!errors.formTitle" :isValidated="isValidated.formTitle" :invalidFeedback="errors.formTitle"
          >
          </MDBInput>
          <br/>
          <label for="description-id-input" class="form-label">{{ t('default.description') }}</label>
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
import { requiredValidator, isValid, minLength, maxLength } from '@/utils/validators'
import { getRandom } from '@/utils/integer'
import { makeFileFromString } from "@/services/ipfsService/IpfsService.js"
import { MDBWysiwyg } from "mdb-vue-wysiwyg-editor";
import {
  MDBBtn,
  MDBInput,
  MDBModal,
  MDBModalHeader,
  MDBModalTitle,
  MDBModalBody,
  MDBModalFooter
} from "mdb-vue-ui-kit";

export default {
  components: {
    MDBBtn
    , MDBWysiwyg
    , MDBInput
    , MDBModal, MDBModalHeader, MDBModalTitle, MDBModalBody, MDBModalFooter
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

    const formTitle = ref('')
    const formDescription = ref('')

    const isValidated = ref({
        formTitle: false,
        formDescription: false,
    })

    const errors = reactive({});

    return {
      t, active
      , formTitle, formDescription
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
    validateTitle(){
      const field = "formTitle"
      const requiredVal = requiredValidator(this.formTitle)
      const maxLengthVal = maxLength(this.formTitle, 40)
      const minLengthVal = minLength(this.formTitle, 5)
      if (requiredVal.valid === false) {
        this.errors[field] = this.t('default.' + requiredVal.message, requiredVal.params)
      } else if (maxLengthVal.valid === false) {
        this.errors[field] = this.t('default.' + maxLengthVal.message, maxLengthVal.params)
      } else if (minLengthVal.valid === false) {
        this.errors[field] = this.t('default.' + minLengthVal.message, minLengthVal.params)
      } else {
        this.errors[field] = null
      }
      this.isValidated.formTitle = true
    },
    validateDescription(){
      const field = "formDescription"
      this.formDescription = ref(this.$refs.refWysiwyg.getCode())
      const requiredVal = requiredValidator(this.formDescription)
      if (requiredVal.valid === false) {
        this.errors[field] = this.t('default.' + requiredVal.message, requiredVal.params)
      } else {
        this.errors[field] = null
      }
      this.isValidated.formDescription = true
    },
    validate(){
      this.validateTitle()
      this.validateDescription()
    },
    async vote() {
      this.validate()
      if (isValid(this.errors) === true) {
        // IPFS
        let ipfs_cid = null
        try {
          const name = this.accountId + '-general-' + this.formTitle + '-' + getRandom(1, 999)
          ipfs_cid = await this.ipfsService.storeFiles(makeFileFromString(this.formDescription, name), name)
        } catch(e){
          this.$logger.error('D', 'app@components/dao/ModalGeneral', 'StoreFile-ipfs', 'File saving to ipfs failed')
          this.$logger.error('B', 'app@components/dao/ModalGeneral', 'StoreFile-ipfs', 'File saving to ipfs failed')
          this.$notify.danger(this.t('default.notify_save_file_ipfs_fail_title'), this.t('default.notify_ipfs_fail') + " " + this.t('default.notify_save_file_ipfs_fail_message'))
          this.$notify.flush()
          console.log(e);
          return
        }
        // Blockchain
        this.nearService.addProposal(
            this.contractId
            , ipfs_cid
            , [this.t('default.general_proposal')]
            , {
                'GeneralProposal': {
                    title: this.formTitle,
                }
            }
            , 0.5
            , this.accountId
        ).then(r => {
            console.log(r)
            this.formTitle = ''
            this.formDescription = ''
            this.active = false
        }).catch((e) => {
            this.$logger.error('D', 'app@components/dao/ModalGeneral', 'AddProposal-blockchain', `Failed to add proposal [${this.formTitle}]`)
            this.$logger.error('B', 'app@components/dao/ModalGeneral', 'AddProposal-blockchain', `Failed to add proposal [${this.formTitle}]`)
            this.$notify.danger(this.t('default.notify_add_proposal_fail_title'), this.t('default.notify_blockchain_fail') + " " +  this.t('default.notify_add_proposal_fail_message', {proposal: this.formTitle}))
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