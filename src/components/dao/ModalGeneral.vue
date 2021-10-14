<template>
    <MDBModal
        id="modalGeneral"
        tabindex="-1"
        labelledby="modalGeneralLabel"
        v-model="active"
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
        <MDBInput class="text-left" id="description-id-input" inputGroup aria-describedby="description-addon" v-model="formDescription"
         @keyup="validateDescription()" @blur="validateDescription()" :isValid="!errors.formDescription" :isValidated="isValidated.formDescription" :invalidFeedback="errors.formDescription"
         >
        </MDBInput>
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
import {requiredValidator, isValid, minLength, maxLength} from '@/utils/validators'
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
      const requiredVal = requiredValidator(this.formDescription)
      const maxLengthVal = maxLength(this.formDescription, 300)
      const minLengthVal = minLength(this.formDescription, 10)
      if (requiredVal.valid === false) {
        this.errors[field] = this.t('default.' + requiredVal.message, requiredVal.params)
      } else if (maxLengthVal.valid === false) {
        this.errors[field] = this.t('default.' + maxLengthVal.message, maxLengthVal.params)
      } else if (minLengthVal.valid === false) {
        this.errors[field] = this.t('default.' + minLengthVal.message, minLengthVal.params)
      } else {
        this.errors[field] = null
      }
      this.isValidated.formDescription = true
    },
    validate(){
      this.validateTitle()
      this.validateDescription()
    },
    vote() {
      this.validate()
      if (isValid(this.errors) === true) {
        this.nearService.addProposal(
            this.contractId
            , this.formDescription
            , [this.t('default.general_proposal')]
            , {
                'GeneralProposal': {
                    title: this.formTitle,
                }
            }
            , 1
            , this.accountId
        ).then(r => {
            console.log(r)
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