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
          :class="[isValidated.formName && errors.formName && errors.formName.length > 0 ? 'is-invalid' : '']"
          :id="'add-document-name-input-' + formNameId"
          :no-results-text="noResults"
          v-model="formName"
          :filter="filterFormName"
          maxlength="100"
          @change="validateName()"
          @keyup.enter="validateName()" @blur="validateName()" :isValid="!errors.formName" :isValidated="isValidated.formName" :invalidFeedback="errors.formName"
        />
      </div>
      <div class="form-outline mb-4">
        <label :for="'add-document-category-input-' + formCategoryId" class="form-label">{{ t('default.category') }}</label>
        <MDBAutocomplete
          :class="[isValidated.formCategory && errors.formCategory && errors.formCategory.length > 0 ? 'is-invalid' : '']"
          :id="'add-document-category-input-' + formCategoryId"
          :no-results-text="noResults"
          v-model="formCategory"
          :filter="filterFormCategory"
          maxlength="100"
          @change="validateCategory()"
          @blur="validateCategory()"
          @keyup.enter="validateCategory()"
          :isValid="!errors.formCategory" :isValidated="isValidated.formCategory" :invalidFeedback="errors.formCategory"
        />
      </div>
      <MDBSwitch v-if="true === false" wrapperClass="mb-2" :label="t('default.version_upgrade_major')" v-model="formVersionUpgrageMajor"/>
      <!-- <br/> -->
      <label for="add-document-input" class="form-label mt-2">{{ t('default.document') }}</label>

      <p class="note note-danger" v-if="formDocumentType == 'flush-pdf' && errors.formFiles != null"  color="danger" static>{{ errors.formFiles }}</p>
      <p class="note note-danger" v-if="formDocumentType == 'flush-url' && errors.formUrl != null"  color="danger" static>{{ errors.formUrl }}</p>
      <p class="note note-danger" v-if="formDocumentType == 'flush-html' && errors.formHtml != null"  color="danger" static>{{ errors.formHtml }}</p>

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
import _ from "lodash";
import { requiredValidator, requiredArrayValidator, isValid, minLength, maxLength, urlValidator } from '@/utils/validators'
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
import { makeFileFromString } from "@/services/ipfsService/IpfsService"
import { getCategories, getNames } from "@/models/document"

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
    },
    docs: {
      type: Object,
      required: true
    }
  },
  setup(props) {
    const { show, docs } = toRefs(props)
    const { t } = useI18n();

    const categoryOptions = getCategories(docs.value, t);
    const nameOptions = getNames(docs.value, '', t);
    // console.log(names)


    const active = ref(false)
    
    const openModal = () => { active.value = true }

    watch(show, openModal)

    const formName = ref("")
    const formNameId = getRandom(1000, 9999)
    let formNameOptions = ref(nameOptions)
    const formCategory = ref("")
    const formCategoryId = getRandom(1000, 9999)
    const formCategoryOptions = ref(categoryOptions)
    const formDescription = ref('')
    const formTagsNew = ref([])
    const formTags = ref([])
    const formFiles = ref([])
    const formUrl = ref('')
    const formHtml = ref('')
    const formVersionUpgrageMajor = ref(false)
    const formDocumentType = ref('flush-pdf');

    const changeNames = () => { formNameOptions.value = getNames(docs.value, formCategory.value, t) }
    watch(formCategory, changeNames)

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

    const errors = reactive({
      formCategory: '',
      formName: '',
    });

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
    getCategories() {
      let categories = [ this.t('default.fundamental')]
      this.docs.map.categories.forEach(item => {
        if (_.isEqual(categories[0], item) !== true) {
          categories.push(item)
        }
      })
      return categories
    },
    getNames() {
      let names = []
      if (this.formCategory.length > 0) {
        names = _.sortedUniq(this.docs.files.filter(item => _.isEqual(this.formCategory, item.category)).map(item => item.name).sort())
      } else {
        names = _.sortedUniq(this.docs.files.map(item => item.name).sort())
      }
      return names
    }
  },
  mounted() {
    //this.formCategoryOptions = this.getCategories
    //this.formNameOptions.value = this.getNames
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
      const requiredVal = requiredValidator(this.formUrl)
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
      const requiredVal = requiredValidator(this.formHtml)
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
        let ipfs_hash = null
        try {
          ipfs_hash = await this.ipfsService.storeFiles(this.getIpfsData(), this.formName)
        } catch(e){
          console.log(e);
        }

        // BLOCKCHAIN
        if (ipfs_hash) {
          this.nearService.addDoc(
              this.contractId,
              this.formName, // name
              this.formDescription, // description
              ipfs_hash, // ipfs_hash
              0, // categoryId
              this.formCategory, // category
              this.getExt(), // ext
              [], // tagsIds
              [], // tags
              '1.0', // version
              1,
              this.accountId
          ).then(r => {
              console.log(r)
              this.formName = ''
              this.formCategory = ''
              this.active = false
          }).catch((e) => {
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

</style>
