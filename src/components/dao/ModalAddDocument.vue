<template>
  <MDBModal
    id="modalAddDocument"
    tabindex="-1"
    labelledby="modalAddDocumentLabel"
    v-model="active"
    size="xl"
  >
    <MDBModalHeader>
      <MDBModalTitle id="modalAddDocumentLabel"> {{ t('default.add_document') }} </MDBModalTitle>
    </MDBModalHeader>
    <MDBModalBody class="text-start">
      <div class="form-outline mb-4">
        <label :for="'add-document-name-input-' + formNameId" class="form-label">{{ t('default.name') }}</label>
        <MDBAutocomplete
          :class="[!errors.formName ? '' : 'is-invalid']"
          :id="'add-document-name-input-' + formNameId"
          v-model="formName"
          :filter="filterFormName"
          maxlength="100"
          @keyup="validateName()" @blur="validateName()" :isValid="!errors.formName" :isValidated="isValidated.formName" :invalidFeedback="errors.formName"
        />
      </div>
      <div class="form-outline mb-4">
        <label :for="'add-document-category-input-' + formCategoryId" class="form-label">{{ t('default.category') }}</label>
        <MDBAutocomplete
          :class="[!errors.formCategory ? '' : 'is-invalid']"
          :id="'add-document-category-input-' + formCategoryId"
          v-model="formCategory"
          :filter="filterFormCategory"
          maxlength="100"
          @keyup="validateCategory()" @blur="validateCategory()" :isValid="!errors.formCategory" :isValidated="isValidated.formCategory" :invalidFeedback="errors.formCategory"
        />
      </div>
      <br/>
      <MDBSwitch wrapperClass="mb-2" :label="t('default.version_upgrade_major')" v-model="formVersionUpgrageMajor"/>
      <br/>

      <p class="note note-danger" v-if="errors.formFiles != null"  color="danger" static>{{ errors.formFiles }}</p>
      <p class="note note-danger" v-if="errors.formUrl != null"  color="danger" static>{{ errors.formUrl }}</p>
      <p class="note note-danger" v-if="errors.formHtml != null"  color="danger" static>{{ errors.formHtml }}</p>

      <MDBAccordion v-model="formDocumentType" flush fluid>
        <MDBAccordionItem :headerTitle="documentTypeDropdown.pdf" collapseId="flush-pdf" :class="[formDocumentType === 'flush-pdf' ? 'accourdition-pdf-open' : '']">
          <MDBFileUpload @change="handleUpload" @remove="handleUpload" accept="application/pdf" :maxFilesQuantity="1" :maxFileSize="10"
            :defaultMsg="fileUploadMsg.defautlMessage" :maxSizeError="fileUploadMsg.maxSizeError" :previewMsg="fileUploadMsg.previewMsg"
            :removeBtn="fileUploadMsg.removeBtn"
          />
        </MDBAccordionItem>
        <MDBAccordionItem :headerTitle="documentTypeDropdown.link" collapseId="flush-url" :class="[formDocumentType === 'flush-url' ? 'accourdition-url-open' : '']">
          <label for="add-document-url-input" class="form-label">{{ t('default.url') }}</label>
          <MDBInput id="add-document-url-input" type="url" :formOutline="false" inputGroup v-model="formUrl"/>
        </MDBAccordionItem>
        <MDBAccordionItem :headerTitle="documentTypeDropdown.editor" collapseId="flush-html">
          <MDBWysiwyg :fixedOffsetTop="58" ref="refWysiwyg">
            <p v-html="formHtml"></p>
          </MDBWysiwyg>
        </MDBAccordionItem>
      </MDBAccordion>
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
import { requiredValidator, requiredArrayValidator, isValid, minLength, maxLength } from '@/utils/validators'
import { getRandom } from '@/utils/integer'
import {
  MDBBtn,
  MDBInput, //, MDBSelect,
  MDBAutocomplete,
  MDBAccordion, MDBAccordionItem,
  MDBSwitch,
  MDBModal,
  MDBModalHeader,
  MDBModalTitle,
  MDBModalBody,
  MDBModalFooter
} from "mdb-vue-ui-kit";
import { MDBFileUpload } from "mdb-vue-file-upload";
import { MDBWysiwyg } from "mdb-vue-wysiwyg-editor";

export default {
  components: {
    MDBBtn
    , MDBInput //, MDBSelect
    , MDBAutocomplete, MDBSwitch
    , MDBModal, MDBModalHeader, MDBModalTitle, MDBModalBody, MDBModalFooter
    , MDBAccordion, MDBAccordionItem
    , MDBFileUpload, MDBWysiwyg
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
    },
    tokenHolders: {
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

    const formName = ref("")
    const formNameId = getRandom(1000, 9999)
    const formNameOptions = ref([ t('default.founding_document') ])
    const formCategory = ref("")
    const formCategoryId = getRandom(1000, 9999)
    const formCategoryOptions = ref([ t('default.fundamental') ])
    const formDescription = ref('')
    const formTagsNew = ref([])
    const formTags = ref([])
    const formFiles = ref([])
    const formUrl = ref('')
    const formHtml = ref('')
    const formVersionUpgrageMajor = ref(false)
    const formDocumentType = ref('flush-pdf');

    const filterFormName = value => {
      return formNameOptions.value.filter(item => {
        return item.toLowerCase().startsWith(value.toLowerCase());
      });
    };

    const filterFormCategory = value => {
      return formCategoryOptions.value.filter(item => {
        return item.toLowerCase().startsWith(value.toLowerCase());
      });
    };
  

    const isValidated = ref({
        formName: false,
        formDescription: false,
        formCategoryNew: false,
        formCategory: false,
        formTagsNew: false,
        formTags: false,
        formFiles: false,
        formUrl: false,
        formHtml: false,
        formVersionUpgrageMajor: false,
    })

    const errors = reactive({});

    return {
      t, active
      , formName, formNameOptions, formNameId, formDescription, formCategory, formCategoryId, formCategoryOptions, formTagsNew, formTags, formFiles, formUrl, formHtml, formVersionUpgrageMajor
      , formDocumentType, filterFormName, filterFormCategory
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
    documentTypeDropdown() {
      return {
        pdf: this.t('default.pdf'),
        link: this.t('default.link'),
        editor: this.t('default.editor'),
      }
    },
    fileUploadMsg() {
      return {
        defautlMessage: this.t('default.file_upload_default_msg'),
        mainError: this.t('default.file_upload_main_error'),
        maxSizeError: this.t('default.file_upload_max_size_error'),
        previewMsg: this.t('default.file_upload_preview_msg'),
        removeBtn: this.t('default.file_upload_remove_btn')
      }
    },
  },
  mounted() {
    // this.formNameOptions.concat([]) // TODO: Add document names in dao
    // this.formCategoryOptions.concat([]) // TODO: Add document names in dao
  },
  methods: {
    validateName(){
      const field = "formName"
      const requiredVal = requiredValidator(this.formName)
      const minLengthVal = minLength(this.formName, 3)
      const maxLengthVal = maxLength(this.formName, 80)
      if (requiredVal.valid === false) {
        this.errors[field] = this.t('default.' + requiredVal.message, requiredVal.params)
      } else if (minLengthVal.valid === false) {
        this.errors[field] = this.t('default.' + minLengthVal.message, minLengthVal.params)
      } else if (maxLengthVal.valid === false) {
        this.errors[field] = this.t('default.' + maxLengthVal.message, maxLengthVal.params)
      } else {
        this.errors[field] = null
      }
      this.isValidated.formName = true
    },
    validateCategory(){
      const field = "formCategory"
      const requiredVal = requiredValidator(this.formCategory)
      const minLengthVal = minLength(this.formCategory, 3)
      const maxLengthVal = maxLength(this.formCategory, 80)
      if (requiredVal.valid === false) {
        this.errors[field] = this.t('default.' + requiredVal.message, requiredVal.params)
      } else if (minLengthVal.valid === false) {
        this.errors[field] = this.t('default.' + minLengthVal.message, minLengthVal.params)
      } else if (maxLengthVal.valid === false) {
        this.errors[field] = this.t('default.' + maxLengthVal.message, maxLengthVal.params)
      } else {
        this.errors[field] = null
      }
      this.isValidated.formCategory = true
    },
    validateFileUpload(){
      const field = "formFiles"
      const requiredVal = requiredArrayValidator(this.formFiles)
      if (requiredVal.valid === false) {
        this.errors[field] = this.t('default.' + requiredVal.message, requiredVal.params)
      } else {
        this.errors[field] = null
      }
      this.isValidated.formFiles = true
    },
    validateUrl(){
      const field = "formUrl"
      const requiredVal = requiredArrayValidator(this.formUrl)
      if (requiredVal.valid === false) {
        this.errors[field] = this.t('default.' + requiredVal.message, requiredVal.params)
      } else {
        this.errors[field] = null
      }
      this.isValidated.formUrl = true
    },
    validateHtml(){
      const field = "formHtml"
      const requiredVal = requiredArrayValidator(this.formHtml)
      if (requiredVal.valid === false) {
        this.errors[field] = this.t('default.' + requiredVal.message, requiredVal.params)
      } else {
        this.errors[field] = null
      }
      this.isValidated.formHtml = true
    },
    validate() {
      // console.log(this.$refs.refWysiwyg.getCode())
      this.formHtml = ref(this.$refs.refWysiwyg.getCode())
      this.validateName()
      this.validateFileUpload()
      switch (this.formDocumentType) {
        case 'flush-pdf':
          this.validateFileUpload()
          break;
        case 'flush-url':
          this.validateUrl()
          break;
        case 'flush-html':
          this.validateHtml()
          break;
        default:
          break;
      }
    },
    handleUpload(files) {
      this.formFiles = files
    },
    vote() {
      this.validate()
      // console.log(this.$refs.refWysiwyg.getCode())
      if (isValid(this.errors) === true) {

        // IPFS
        const ipfs_hash = null // TODO: IPFS service

        // BLOCKCHAIN
        this.nearService.addDoc(
            this.contractId,
            this.formName, // name
            this.formDescription, // description
            ipfs_hash, // ipfs_hash
            null, // categoryId
            this.formCategory, // category
            this.formDocumentType.replace('flush-', ''), // ext
            [], // tagsIds
            [], // tags
            1,
        ).then(r => {
            console.log(r)
            this.formName = ''
            this.formDescription = 0
            this.formCategory = ''
            this.active = false
        }).catch((e) => {
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

<style>
.accourdition-pdf-open {
  min-height: 280px;
}

.accourdition-url-open {
  min-height: 120px;
}

</style>