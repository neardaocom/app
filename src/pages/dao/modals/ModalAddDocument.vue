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
      <div class="row">
        <div class="col-12 col-lg-6 mb-4">
          <label :for="'add-document-name-input-' + formNameId" class="form-label">{{ t('default.name') }}</label>
          <MDBAutocomplete
            :class="[isValidated.formName && errors.formName && errors.formName.length > 0 ? 'is-invalid' : '']"
            :id="'add-document-name-input-' + formNameId"
            :no-results-text="noResults"
            :displayValue="nameDisplayValueTemplate"
            :itemContent="nameItemTemplate"
            v-model="formName"
            :filter="filterFormName"
            maxlength="100"
            @change="validateName()"
            @itemSelect="handleNameChange"
            @keyup.enter="validateName()" @blur="validateName()" :isValid="!errors.formName" :isValidated="isValidated.formName" :invalidFeedback="errors.formName"
          />
        </div>
      
        <div class="col-12 col-lg-6 mb-4">
          <label :for="'add-document-category-input-' + formCategoryId" class="form-label">{{ t('default.category') }}</label>
          <MDBAutocomplete
            :class="[isValidated.formCategory && errors.formCategory && errors.formCategory.length > 0 ? 'is-invalid' : '']"
            :id="'add-document-category-input-' + formCategoryId"
            :no-results-text="noResults"
            v-model="formCategory"
            :filter="filterFormCategory"
            maxlength="100"
            @update="validateCategory()"
            @blur="validateCategory()"
            @keyup.enter="validateCategory()"
            :isValid="!errors.formCategory" :isValidated="isValidated.formCategory" :invalidFeedback="errors.formCategory"
          />
        </div>
      </div>
      <div class="row">
        <div class="col-12 mt-1 mb-4">
          <MDBSwitch :disabled="isNewFile" :label="(formVersionUpgrageMajor) ? t('default.upgrade_version', {version: getNewVersion}) : t('default.update_version', {version: getNewVersion})" v-model="formVersionUpgrageMajor"/>
        </div>
      </div>
      <div class="row">
        <div class="col-12 mb-4">
          <label for="add-document-description-id-input" class="form-label">{{ t('default.description') }}</label>
          <MDBInput class="text-left" id="add-document-description-id-input" v-model="formDescription" max="161"
            @keyup="validateDescription()" @blur="validateDescription()" :isValid="!errors.formDescription" :isValidated="isValidated.formDescription" :invalidFeedback="errors.formDescription"
          />
        </div>
      </div>
      <!-- <br/> -->
      <label for="add-document-input" class="form-label mt-2">{{ t('default.document') }}</label>

      <MDBAlert color="danger" static v-if="formDocumentType == 'flush-pdf' && errors.formFiles != null">{{ errors.formFiles }}</MDBAlert>
      <MDBAlert color="danger" static v-if="formDocumentType == 'flush-url' && errors.formUrl != null">{{ errors.formUrl }}</MDBAlert>
      <MDBAlert color="danger" static v-if="formDocumentType == 'flush-html' && errors.formHtml != null">{{ errors.formHtml }}</MDBAlert>

      <MDBAccordion v-model="formDocumentType" flush fluid class="mx-4">
        <MDBAccordionItem :headerTitle="documentTypeDropdown.pdf" collapseId="flush-pdf" :class="[formDocumentType === 'flush-pdf' ? 'accordition-pdf-open' : '']">
          <MDBFileUpload @change="handleUpload" @remove="handleUpload" accept="application/pdf" :maxFilesQuantity="1" :maxFileSize="10"
            :defaultMsg="fileUploadMsg.defautlMessage" :maxSizeError="fileUploadMsg.maxSizeError" :previewMsg="fileUploadMsg.previewMsg"
            :removeBtn="fileUploadMsg.removeBtn"
          />
        </MDBAccordionItem>
        <MDBAccordionItem :headerTitle="documentTypeDropdown.link" collapseId="flush-url" :class="[formDocumentType === 'flush-url' ? 'accordition-url-open' : '']">
          <label for="add-document-url-input" class="form-label">{{ t('default.url') }}</label>
          <MDBInput id="add-document-url-input" type="url" :formOutline="false" inputGroup v-model="formUrl" aria-describedby="add-document-url-input-text"
            @keyup="validateUrl()" @blur="validateUrl()" :isValid="!errors.formUrl" :isValidated="isValidated.formUrl" :invalidFeedback="errors.formUrl"
          />
          <div class="col-auto">
            <span id="add-document-url-input-text" class="form-text"> {{ t('default.url_format') }} </span>
          </div>
        </MDBAccordionItem>
        <MDBAccordionItem :headerTitle="documentTypeDropdown.editor" collapseId="flush-html">
          <MDBWysiwyg :fixedOffsetTop="58" ref="refWysiwyg">
            <section v-html="formHtml"></section>
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
import { ref, toRefs, watch, inject } from "vue";
import { reactive } from "@vue/reactivity";
import { useI18n } from "vue-i18n";
import _ from "lodash";
import Validator from '@/models/utils/Validator'
import IntegerHelper from '@/models/utils/IntegerHelper'
import VersionHelper from '@/models/utils/VersionHelper'
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
  MDBModalFooter,
  MDBAlert
} from "mdb-vue-ui-kit";
import { MDBFileUpload } from "mdb-vue-file-upload";
import { MDBWysiwyg } from "mdb-vue-wysiwyg-editor";
import { makeFileFromString } from "@/models/services/ipfsService/IpfsService.js"
import { getCategories, getCategoriesInit, transform, getIndexInFiles } from "@/models/document"

export default {
  components: {
    MDBBtn
    , MDBInput //, MDBSelect
    , MDBAutocomplete, MDBSwitch
    , MDBModal, MDBModalHeader, MDBModalTitle, MDBModalBody, MDBModalFooter
    , MDBAccordion, MDBAccordionItem
    , MDBFileUpload, MDBWysiwyg
    , MDBAlert
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
    docs: {
      type: Object,
      required: true
    }
  },
  setup(props) {
    const config = inject('config')
    const { show, docs } = toRefs(props)
    const { t } = useI18n();
  
    const files = transform(docs.value)
    // console.log(files)

    const factoryAccount = computed(() => (config.near.contractName))

    const categoryOptions = getCategories(docs.value, t);
    const nameOptions = ref(files.map(item => { return { title: item.name, category: item.category, version: item.version }}))
    const nameItemTemplate = result => {
        return `
          <div class="autocomplete-custom-item-content">
            <div class="autocomplete-custom-item-title">${result.title}</div>
            <div class="autocomplete-custom-item-category">${result.category} | v${result.version}</div>
          </div>
        `;
    };
    const nameDisplayValueTemplate = value => value.title;

    // console.log(names)
    
    const active = ref(false)
    
    const openModal = () => { active.value = true }

    watch(show, openModal)

    const formName = ref("")
    const formNameId = IntegerHelper.getRandom(1000, 9999)
    let formNameOptions = ref(nameOptions)
    const formCategory = ref("")
    const formCategoryId = IntegerHelper.getRandom(1000, 9999)
    const formCategoryOptions = ref(categoryOptions)
    const formDescription = ref('')
    const formTagsNew = ref([])
    const formTags = ref([])
    const formFiles = ref([])
    const formUrl = ref('')
    const formHtml = ref('')
    const formVersionUpgrageMajor = ref(true)
    const formDocumentType = ref('flush-pdf');

    //const changeNames = () => { formNameOptions.value = getNames(docs.value, formCategory.value, t) }
    //watch(formCategory, changeNames)

    //const changeCategory = () => { formCategory = getNames(docs.value, formCategory.value, t) }
    //watch(formCategory, changeNames)

    const filterFormName = value => {
      return formNameOptions.value.filter(item => {
        return item.title.toLowerCase().startsWith(value.toLowerCase());
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

    const errors = reactive({
      formCategory: '',
      formName: '',
    });

    return {
      t, active, files, factoryAccount
      , formName, formNameOptions, formNameId, formDescription, formCategory, formCategoryId, formCategoryOptions, formTagsNew, formTags, formFiles, formUrl, formHtml, formVersionUpgrageMajor
      , formDocumentType, filterFormName, filterFormCategory
      , nameItemTemplate, nameDisplayValueTemplate
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
    ipfsService() {
      return this.$store.getters['ipfs/getService']
    },
    noResults() {
      return this.t('default.no_results')
    },
    documentTypeDropdown() {
      return {
        pdf: this.t('default.pdf'),
        link: this.t('default.link'),
        editor: this.t('default.document'),
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

    //nepouzito
    getCategories() {
      let categories = getCategoriesInit( this.t )
      this.docs.map.categories.forEach(item => {
        if (_.isEqual(categories[0], item) !== true) {
          categories.push(item)
        }
      })
      return categories
    },

    // nepouzito
    getNames() {
      let names = []
      if (this.formCategory.length > 0) {
        names = _.sortedUniq(this.docs.files.filter(item => _.isEqual(this.formCategory, item.category)).map(item => item.name).sort())
      } else {
        names = _.sortedUniq(this.docs.files.map(item => item.name).sort())
      }
      return names
    },
    
    getIndexOfFile() {
      return getIndexInFiles(this.files, this.formName, this.formCategory)
    },
    getVersionOfFile() {
      return (this.getIndexOfFile >= 0) ? this.files[this.getIndexOfFile].version : undefined
    },
    isNewFile() {
      return this.getIndexOfFile == -1
    },
    getNewVersion() {
      let version = '1.0'
      if (this.isNewFile === false) {
        if (this.formVersionUpgrageMajor === true) {
          version = VersionHelper.majorUp(this.getVersionOfFile)
        } else {
          version = VersionHelper.minorUp(this.getVersionOfFile)
        }
      }
      return version
    }
  },
  mounted() {
    //this.formCategoryOptions = this.getCategories
    //this.formNameOptions.value = this.getNames
  },
  methods: {
    handleNameChange(e) {
      this.formName = e.title
      this.formCategory = e.category
      this.validateCategory()
      this.validateName()
      
    },
    validateName(){
      const field = "formName"
      const requiredVal = Validator.requiredValidator(this.formName)
      const minLengthVal = Validator.minLength(this.formName, 3)
      const maxLengthVal = Validator.maxLength(this.formName, 80)
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
      const requiredVal = Validator.requiredValidator(this.formCategory)
      const minLengthVal = Validator.minLength(this.formCategory, 3)
      const maxLengthVal = Validator.maxLength(this.formCategory, 80)
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
    validateDescription(){
      const field = "formDescription"
      const minLengthVal = Validator.minLength(this.formDescription, 0)
      const maxLengthVal = Validator.maxLength(this.formDescription, 160)
      if (maxLengthVal.valid === false) {
        this.errors[field] = this.t('default.' + maxLengthVal.message, maxLengthVal.params)
      } else if (minLengthVal.valid === false) {
        this.errors[field] = this.t('default.' + minLengthVal.message, minLengthVal.params)
      } else {
        this.errors[field] = null
      }
      this.isValidated.formDescription = true
    },
    validateFileUpload(){
      const field = "formFiles"
      const requiredVal = Validator.requiredArrayValidator(this.formFiles)
      if (requiredVal.valid === false) {
        this.errors[field] = this.t('default.' + requiredVal.message, requiredVal.params)
      } else {
        this.errors[field] = null
      }
      this.isValidated.formFiles = true
    },
    validateUrl(){
      const field = "formUrl"
      const requiredVal = Validator.requiredValidator(this.formUrl)
      const urlVal = urlValidator(this.formUrl)
      if (requiredVal.valid === false) {
        this.errors[field] = this.t('default.' + requiredVal.message, requiredVal.params)
      } else if (urlVal.valid === false) {
        this.errors[field] = this.t('default.' + urlVal.message, urlVal.params)
      } else {
        this.errors[field] = null
      }
      this.isValidated.formUrl = true
    },
    validateHtml(){
      const field = "formHtml"
      const requiredVal = Validator.requiredValidator(this.formHtml)
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
      this.validateCategory()
      this.validateDescription()
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
    async vote() {
      this.validate()
      // console.log(this.$refs.refWysiwyg.getCode())
      if (isValid(this.errors) === true) {

        // IPFS
        let ipfs_cid = null
        try {
          ipfs_cid = await this.ipfsService.storeFiles(this.getIpfsData(), this.formName)
        } catch(e){
          this.$logger.error('D', 'app@components/dao/ModalAddDocument', 'StoreFile-ipfs', 'File saving to ipfs failed')
          this.$logger.error('B', 'app@components/dao/ModalAddDocument', 'StoreFile-ipfs', 'File saving to ipfs failed')
          this.$notify.danger(this.t('default.notify_save_file_ipfs_fail_title'), this.t('default.notify_ipfs_fail') + " " + this.t('default.notify_save_file_ipfs_fail_message'))
          this.$notify.flush()
          console.log(e);
          return
        }

        console.log(ipfs_cid)
        // BLOCKCHAIN
        if (ipfs_cid) {
          this.nearService.addDoc(
              this.contractId,
              this.formName, // name
              this.formDescription, // description
              ipfs_cid, // ipfs_cid
              this.getCategoryId(), // categoryId
              this.getCategory(), // category
              this.getExt(), // ext
              [], // tagsIds
              [], // tags
              this.getNewVersion, // version
              null, // description_vote
              0.5, 
              this.accountId
          ).then(r => {
              console.log(r)
              this.formName = ''
              this.formCategory = ''
              this.active = false
          }).catch((e) => {
              this.$logger.error('D', 'app@components/dao/ModalAddDocument', 'AddDocument-blockchain', `Failed to add document [${this.formName}] with IPFS cid [${this.ipfs_cid}]`)
              this.$logger.error('B', 'app@components/dao/ModalAddDocument', 'AddDocument-blockchain', `Failed to add document [${this.formName}] with IPFS cid [${this.ipfs_cid}]`)
              this.$notify.danger(this.t('default.notify_add_document_fail_title'),  this.t('default.notify_blockchain_fail') + " " +  this.t('default.notify_add_document_fail_message', {document: this.formName}))
              this.$notify.flush()
              console.log(e)
          })
        }
      }
    },
    close() {
      this.active = false
    },
    getExt() {
      return this.formDocumentType.replace('flush-', '')
    },
    getFullname() {
      return this.formName + '.' + this.getExt()
    },
    getIpfsData() {
      let ipfsData = null
      switch (this.formDocumentType) {
        case 'flush-pdf':
          ipfsData = this.formFiles
          break;
        case 'flush-url':
          ipfsData = makeFileFromString(this.formUrl, this.getFullname())
          break;
        case 'flush-html':
          ipfsData = makeFileFromString(this.formHtml, this.getFullname())
          break;
        default:
          break;
      }
      return ipfsData
    },
    getCategoryId() {
      let categoryId = _.indexOf(this.docs.map.categories, this.formCategory)
      if (categoryId == -1) categoryId = 0
      return categoryId
    },
    getCategory() {
      return (_.indexOf(this.docs.map.categories, this.formCategory) == -1) ? this.formCategory : null
    }
  }
};
</script>

<style>
.accordition-pdf-open {
  min-height: 280px;
}

.accordition-url-open {
  min-height: 160px;
}

.autocomplete-custom-item-content {
    display: flex;
    flex-direction: column;
}

.autocomplete-custom-item-title {
    font-weight: 500;
}

.autocomplete-custom-item-subtitle {
    font-size: 0.8rem;
}
</style>
