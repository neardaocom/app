<template>
  <MDBModal
    id="modalremoveDocument"
    tabindex="-1"
    labelledby="modalremoveDocumentLabel"
    v-model="active"
  >
    <MDBModalHeader>
      <MDBModalTitle id="modalremoveDocumentLabel"> {{ t('default.remove_document') }} </MDBModalTitle>
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
          :close="validateName()"
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
          :close="validateCategory()"
          @keyup="validateCategory()" @blur="validateCategory()" :isValid="!errors.formCategory" :isValidated="isValidated.formCategory" :invalidFeedback="errors.formCategory"
        />
      </div>
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
import {
  MDBBtn,
  MDBAutocomplete,
  MDBModal,
  MDBModalHeader,
  MDBModalTitle,
  MDBModalBody,
  MDBModalFooter
} from "mdb-vue-ui-kit";

export default {
  components: {
    MDBBtn
    , MDBAutocomplete
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
    },
    groups: {
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
    const formNameOptions = ref([ t('default.founding_document'),  ])
    const formCategory = ref("")
    const formCategoryId = getRandom(1000, 9999)
    const formCategoryOptions = ref([ t('default.fundamental') ])

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
        formCategory: false,
    })

    const errors = reactive({});

    return {
      t, active
      , formName, formNameOptions, formNameId, formCategory, formCategoryId
      , filterFormName, filterFormCategory
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
  },
  mounted() {
    // this.formNameOptions.concat([]) // TODO: remove document names in dao
    // this.formCategoryOptions.concat([]) // TODO: remove document names in dao
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
    validate() {
      this.validateName()
      this.validateCategory()
    },
    vote() {
      this.validate()
      // console.log(this.$refs.refWysiwyg.getCode())
      if (isValid(this.errors) === true) {

        // IPFS
        const ipfs_hash = null // TODO: IPFS service

        // BLOCKCHAIN
        this.nearService.invalideDoc(
          this.contractId,
          ipfs_hash,
          null,
          1,
          this.accountId
        ).then(r => {
            console.log(r)
            this.formName = ''
            this.formCategory = ''
            this.active = false
        }).catch((e) => {
            this.$logger.error('D', 'app@components/dao/ModalRemoveDocument', 'InvalideDocument-blockchain', `Failed to remove document [${this.formName}]`)
            this.$logger.error('B', 'app@components/dao/ModalRemoveDocument', 'InvalideDocument-blockchain', `Failed to remove document [${this.formName}]`)
            this.$notify.danger(this.t('default.notify_remove_document_fail_title'), this.t('default.notify_blockchain_fail') + " " + this.t('default.notify_remove_document_fail_message', {document: this.formName}))
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