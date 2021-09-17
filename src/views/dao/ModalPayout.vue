<template>
    <MDBModal
        id="modalPayout"
        tabindex="-1"
        labelledby="modalPayoutLabel"
        v-model="active"
    >
        <MDBModalHeader>
        <MDBModalTitle id="modalPayoutLabel"> {{ t('default.payout') }} </MDBModalTitle>
        </MDBModalHeader>
        <MDBModalBody class="text-start">
        <label for="account-id-input" class="form-label">{{ t('default.account_id') }}</label>
        <MDBInput id="account-id-input" inputGroup :formOutline="false" aria-describedby="account-addon" v-model="formAccount" data-mdb-showcounter="true" maxlength="100"
            @keyup="validateAccount()" @blur="validateAccount()" :isValid="!errors.formAccount" :isValidated="isValidated.formAccount" :invalidFeedback="errors.formAccount"
        >
            <span class="input-group-text" id="account-addon">.{{ factoryAccount.split('.').at(1) }}</span>
        </MDBInput>
        <br/>
        <label for="amount-input" class="form-label">{{ t('default.amount') }}</label>
        <MDBInput class="text-left" id="amount-input" min="0.00" inputGroup :formOutline="false" aria-describedby="amount-addon" type="number" v-model.number="formAmount"
            @keyup="validateAmount()" @blur="validateAmount()" :isValid="!errors.formAmount" :isValidated="isValidated.formAmount" :invalidFeedback="errors.formAmount"
        >
            <span class="input-group-text" id="amount-addon">Ⓝ</span>
        </MDBInput>
        <br/>
        <label for="note-input" class="form-label">{{ t('default.note') }}</label>
        <MDBInput class="text-left" id="note-input" min="0.00" inputGroup :formOutline="false" aria-describedby="note-addon" v-model.number="formNote"
            @keyup="validateNote()" @blur="validateNote()" :isValid="!errors.formNote" :isValidated="isValidated.formNote" :invalidFeedback="errors.formNote"
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
import {requiredValidator, nearRootAccountValidator, isValid, isNumber, minNumber, maxNumber, maxLength} from '@/utils/validators'
import {
  MDBBtn,
  MDBInput,
  MDBModal,
  MDBModalHeader,
  MDBModalTitle,
  MDBModalBody,
  MDBModalFooter
} from "mdb-vue-ui-kit";
import { yoctoNear } from "@/services/nearService/constants"
import Decimal from 'decimal.js';

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

    const formAccount = ref('')
    const formAmount = ref(0)
    const formNote = ref('')

    const isValidated = ref({
        formAccount: false,
        formAmount: false,
        formNote: false,
    })

    const errors = reactive({});

    return {
      t, active
      , formAccount, formAmount, formNote
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
    validateAccount(){
      const field = "formAccount"
      const requiredVal = requiredValidator(this.formAccount)
      const rootAccountVal = nearRootAccountValidator(this.formAccount)
      if (requiredVal.valid === false) {
        this.errors[field] = this.t('default.' + requiredVal.message, requiredVal.params)
      } else if (rootAccountVal.valid === false) {
        this.errors[field] = this.t('default.' + rootAccountVal.message, rootAccountVal.params)
      } else {
        this.errors[field] = null
      }
      this.isValidated.formAccount = true
    },
    validateAmount(){
      const field = "formAmount"
      const requiredVal = requiredValidator(this.formAmount)
      const isNumberVal = isNumber(this.formAmount)
      const minNumberVal = minNumber(this.formAmount, 0.0)
      const maxNumberVal = maxNumber(this.formAmount, 1000000.0)
      if (requiredVal.valid === false) {
        this.errors[field] = this.t('default.' + requiredVal.message, requiredVal.params)
      } else if (isNumberVal.valid === false) {
        this.errors[field] = this.t('default.' + isNumberVal.message, isNumberVal.params)
      } else if (minNumberVal.valid === false) {
        this.errors[field] = this.t('default.' + minNumberVal.message, minNumberVal.params)
      } else if (maxNumberVal.valid === false) {
        this.errors[field] = this.t('default.' + maxNumberVal.message, maxNumberVal.params)
      } else {
        this.errors[field] = null
      }
      this.isValidated.formAmount = true
    },
    validateNote(){
      const field = "formNote"
      const maxLengthVal = maxLength(this.formNote, 100)
      if (maxLengthVal.valid === false) {
        this.errors[field] = this.t('default.' + maxLengthVal.message, maxLengthVal.params)
      } else {
        this.errors[field] = null
      }
      this.isValidated.formNote = true
    },
    validate(){
      this.validateAccount()
      this.validateAmount()
      this.validateNote()
    },
    vote() {
      this.validate()
      if (isValid(this.errors) === true) {
          console.log(this.formAmount)
          console.log(yoctoNear)
        this.nearService.addProposal(
            this.contractId
            , this.formNote
            , [this.t('default.payout')]
            , {
                'Pay': {
                    amount_near: Decimal.set({ toExpPos: 30 }).mul(this.formAmount, yoctoNear).toFixed(),
                    account_id: (this.formAccount + '.' + this.factoryAccount.split('.').at(1))
                }
            }
            , 1
            , this.accountId
        ).then(r => {
            console.log(r)
            this.formAccount = ''
            this.formAmount = 0
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