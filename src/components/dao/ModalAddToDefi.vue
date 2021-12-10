<template>
    <MDBModal
        id="modalAddToDefi"
        tabindex="-1"
        labelledby="modalAddToDefiLabel"
        v-model="active"
        size="lg"
    >
        <MDBModalHeader>
            <MDBModalTitle id="modalAddToDefiLabel"> {{ t('default.default.add_to_defi') }} </MDBModalTitle>
        </MDBModalHeader>
        <MDBModalBody class="text-start">
            <label for="defi-id-input" class="form-label">{{ t('default.defi') }}</label>
            <MDBInput id="defi-id-input" inputGroup :formOutline="false" v-model="formDefi"
            @keyup="validateDefi()" @blur="validateDefi()" :isValid="!errors.formDefi" :isValidated="isValidated.formDefi" :invalidFeedback="errors.formDefi"/>

            <label for="defi-id-input" class="form-label">{{ t('default.defi') }}</label>
            <MDBInput id="defi-id-input" inputGroup :formOutline="false" v-model="formDefi"
            @keyup="validateDefi()" @blur="validateDefi()" :isValid="!errors.formDefi" :isValidated="isValidated.formDefi" :invalidFeedback="errors.formDefi"/>

            <label for="defi-id-input" class="form-label">{{ t('default.defi') }}</label>
            <MDBInput id="defi-id-input" inputGroup :formOutline="false" v-model="formDefi"
            @keyup="validateDefi()" @blur="validateDefi()" :isValid="!errors.formDefi" :isValidated="isValidated.formDefi" :invalidFeedback="errors.formDefi"/>

            <label for="defi-id-input" class="form-label">{{ t('default.defi') }}</label>
            <MDBInput id="defi-id-input" inputGroup :formOutline="false" v-model="formDefi"
            @keyup="validateDefi()" @blur="validateDefi()" :isValid="!errors.formDefi" :isValidated="isValidated.formDefi" :invalidFeedback="errors.formDefi"/>

            <label for="defi-id-input" class="form-label">{{ t('default.defi') }}</label>
            <MDBInput id="defi-id-input" inputGroup :formOutline="false" v-model="formDefi"
            @keyup="validateDefi()" @blur="validateDefi()" :isValid="!errors.formDefi" :isValidated="isValidated.formDefi" :invalidFeedback="errors.formDefi"/>

            <label for="defi-id-input" class="form-label">{{ t('default.defi') }}</label>
            <MDBInput id="defi-id-input" inputGroup :formOutline="false" v-model="formDefi"
            @keyup="validateDefi()" @blur="validateDefi()" :isValid="!errors.formDefi" :isValidated="isValidated.formDefi" :invalidFeedback="errors.formDefi"/>

            <label for="defi-id-input" class="form-label">{{ t('default.defi') }}</label>
            <MDBInput id="defi-id-input" inputGroup :formOutline="false" v-model="formDefi"
            @keyup="validateDefi()" @blur="validateDefi()" :isValid="!errors.formDefi" :isValidated="isValidated.formDefi" :invalidFeedback="errors.formDefi"/>
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
import { isValid } from '@/utils/validators'
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
    ipfsService() {
      return this.$store.getters['ipfs/getService']
    },
  },
  methods: {
    
    validate(){
    },
    async vote() {
      this.validate()
      if (isValid(this.errors) === true) {
        // Blockchain
        this.nearService.addProposal(
            this.contractId
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