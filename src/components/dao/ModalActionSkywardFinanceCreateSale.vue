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
          <!-- title -->
          <label for="title-id-input" class="form-label">{{ t('default.title') }}</label>
          <MDBInput
            id="title-id-input"
            inputGroup
            :formOutline="false"
            aria-describedby="title-addon"
            v-model="formTitle"
            @keyup="validateTitle()"
            @blur="validateTitle()"
            :isValid="!errors.formTitle"
            :isValidated="isValidated.formTitle"
            :invalidFeedback="errors.formTitle"
          >
          </MDBInput>
          <br/>
          <!-- formOutTokenId -->
          <label for="title-id-input" class="form-label">{{ t('default.token_sale_token_id') }}</label>
          <MDBInput inputGroup
            v-model="formOutTokenId"
            :isValid="!errors.formOutTokenId"
            :isValidated="isValidated.formOutTokenId"
            :invalidFeedback="errors.formOutTokenId"
            @keyup="validateOutTokenId()"
            @blur="validateOutTokenIdExists()"
            wrapperClass="mb-1"
          >
              <span class="input-group-text">.{{ accountPostfix }}</span>
          </MDBInput>
          <br/>
          <!-- formAmont -->
          <label for="amount-input" class="form-label">{{ t('default.amount') }}</label>
          <MDBInput class="text-left" id="amount-input" min="0.00" inputGroup :formOutline="false" aria-describedby="amount-addon" type="number" v-model.number="formAmount"
              @keyup="validateAmount()" @blur="validateAmount()" :isValid="!errors.formAmount" :isValidated="isValidated.formAmount" :invalidFeedback="errors.formAmount"
          >
              <span class="input-group-text" id="amount-addon">{{ tokenName }}</span>
          </MDBInput>
          <br/>
          <!-- formFrom -->
          <label for="from-input" class="form-label">{{ t('default.token_sale_start_at') }}</label>
          <div class="row">
            <div class="col-6">
              <MDBDatepicker
                v-model="formFromDate"
                :format="t('default._datepicker_format')"
                @close="validateFromDate()"
                @blur="validateFromDate()"
              />
              <FromErrorMessage class="mt-3" :show="errors.formFromDate !== null" :message="errors.formFromDate"/>
            </div>
            <div class="col-6">
              <MDBTimepicker
                v-model.trim="formFromTime"
                :hoursFormat="24"
                @close="validateFromTime()"
                @blur="validateFromTime()"
              />
              <FromErrorMessage  class="mt-3" :show="errors.formFromTime !== null" :message="errors.formFromTime"/>
            </div>
          </div>
          <br/>
          <!-- formDurationDays -->
          <div class="row mb-4">
              <MDBRange wrapperClass="col-md-6 col-9" :label="t('default.dao_vote_duration_days')" v-model="formDurationDays" :min="0" :max="31" />
              <label class="form-label col-md-6 col-3">{{ formDurationDays }}d</label>
          </div>
          <!-- formDurationHours -->
          <div class="row mb-4">
              <MDBRange wrapperClass="col-md-6 col-9" :label="t('default.dao_vote_duration_hours')" v-model="formDurationHours" :min="0" :max="23" />
              <label class="form-label col-md-6 col-3">{{ formDurationHours }}h</label>
          </div>
        </MDBModalBody>
        <MDBModalFooter>
          <MDBBtn color="secondary" @click="close()">{{ t('default.close') }}</MDBBtn>
          <MDBBtn color="primary" @click="vote()">{{ t('default.create') }}</MDBBtn>
        </MDBModalFooter>
    </MDBModal>
</template>

<script>
import { ref, toRefs, watch } from "vue";
import { reactive } from "@vue/reactivity";
import { useI18n } from "vue-i18n";
import { requiredValidator, isValid, minLength, nearRootAccountValidator, maxLength, isNumber, minNumber, maxNumber, minDate, maxDate } from '@/utils/validators'
import { toNanoseconds, toNanosecond } from '@/utils/date'
import moment from 'moment'
import last from "lodash/last"
import FromErrorMessage from '@/components/FormErrorMessage'
import {
  MDBBtn,
  MDBInput,
  MDBModal,
  MDBModalHeader,
  MDBModalTitle,
  MDBModalBody,
  MDBModalFooter,
  MDBDatepicker,
  MDBTimepicker,
  MDBRange,
} from "mdb-vue-ui-kit";

export default {
  components: {
    MDBBtn
    , MDBInput
    , MDBModal, MDBModalHeader, MDBModalTitle, MDBModalBody, MDBModalFooter
    , MDBDatepicker, MDBTimepicker,
    MDBRange,
    FromErrorMessage,
  },
  props: {
    show: {
      type: Number,
      required: true,
    },
    contractId: {
      type: String,
      required: true,
    },
    tokenName: {
      type: String,
      required: true
    },
  },
  setup(props) {
    const { t, d } = useI18n();

    const { show } = toRefs(props)

    const active = ref(false)
    
    const openModal = () => { active.value = true }

    watch(show, openModal)

    const formTitle = ref('')
    const formUrl = ref('')
    const formAmount = ref(10_000)
    const formOutTokenId = ref('wrap')
    const formFromDate = ref(d(moment().add(1, 'M').toDate()))
    const formFromTime = ref('12:00')
    const formDurationHours = ref(0)
    const formDurationDays = ref(7)

    const isValidated = ref({
        formTitle: false,
        formUrl: false,
        formAmount: false,
        formOutTokenId: false,
        formFromDate: false,
        formFromTime: false,
        formDurationHours: false,
        formDurationDays: false,
    })

    const errors = reactive({});

    return {
      t, d, active
      , formTitle, formUrl, formAmount, formOutTokenId, formFromDate, formFromTime, formDurationHours, formDurationDays
      , isValidated, errors
    };
  },
  computed: {
    minDate() {
      return moment().startOf('day').add(1, 'M').toDate()
    },
    maxDate() {
      return moment().startOf('day').add(12, 'M').toDate()
    },
    factoryAccount() {
      return this.$store.getters['near/getFactoryAccount']
    },
    accountId() {
      return this.$store.getters['near/getAccountId']
    },
    nearService() {
      return this.$store.getters['near/getService']
    },
    accountPostfix() {
      return last(this.factoryAccount.split('.'))
    },
  },
  methods: {
    validateTitle(){
      const field = "formTitle"
      const requiredVal = requiredValidator(this.formTitle)
      const minLengthVal = minLength(this.formTitle, 5)
      const maxLengthVal = maxLength(this.formTitle, 40)
      if (requiredVal.valid === false) {
        this.errors[field] = this.t('default.' + requiredVal.message, requiredVal.params)
      } else if (minLengthVal.valid === false) {
        this.errors[field] = this.t('default.' + minLengthVal.message, minLengthVal.params)
      } else if (maxLengthVal.valid === false) {
        this.errors[field] = this.t('default.' + maxLengthVal.message, maxLengthVal.params)
      } else {
        this.errors[field] = null
      }
      this.isValidated.formTitle = true
    },
    validateOutTokenId(){
        const field = "formOutTokenId"
        const required = requiredValidator(this.formOutTokenId)
        const rootAccount = nearRootAccountValidator(this.formOutTokenId)
        if (required.valid === false) {
            this.errors[field] = this.t('default.' + required.message, required.params)
        } else if (rootAccount.valid === false) {
            this.errors[field] = this.t('default.' + rootAccount.message, rootAccount.params)
        } else {
            this.errors[field] = null
        }
        this.isValidated.formOutTokenId = true
    },

    async validateOutTokenIdExists(){
        const field = "formOutTokenId"
        const accountId = this.formOutTokenId.trim() + '.' + this.accountPostfix
        this.errors[field] = this.t('default.validating')
        this.nearService.getAccountState(accountId)
            .then(() => {
                this.errors[field] = null
            })
            .catch(() => {
                this.errors[field] = this.t('default.validator_near_account_not_found')
            })
        this.isValidated.formOutTokenId = true
    },
    validateAmount() {
      const field = "formAmount"
      const requiredVal = requiredValidator(this.formAmount)
      const isNumberVal = isNumber(this.formAmount)
      const minNumberVal = minNumber(this.formAmount, 1.0)
      const maxNumberVal = maxNumber(this.formAmount, 1000000000.0)
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
    validateFromDate() {
      const field = "formFromDate"
      const fromDate = moment(this.formFromDate, this.t('default._datepicker_format')).toDate()
      const requiredVal = requiredValidator(this.formFromDate)
      const minDateVal = minDate(fromDate, { min: this.minDate }, this.d)
      const maxDateVal = maxDate(fromDate, { max: this.maxDate }, this.d)
      if (requiredVal.valid === false) {
        this.errors[field] = this.t('default.' + requiredVal.message, requiredVal.params)
      } else if (minDateVal.valid === false) {
        this.errors[field] = this.t('default.' + minDateVal.message, minDateVal.params)
      } else if (maxDateVal.valid === false) {
        this.errors[field] = this.t('default.' + maxDateVal.message, maxDateVal.params)
      } else {
        this.errors[field] = null
      }
      this.isValidated.formFromDate = true
    },
    validateFromTime() {
      const field = "formFromTime"
      const requiredVal = requiredValidator(this.formFromTime)
      if (requiredVal.valid === false) {
        this.errors[field] = this.t('default.' + requiredVal.message, requiredVal.params)
      } else {
        this.errors[field] = null
      }
      this.isValidated.formFromTime = true
    },
    validate(){
      this.validateTitle()
      this.validateOutTokenId()
      this.validateAmount()
      this.validateFromDate()
      this.validateFromTime()
    },
    async vote() {
      this.validate()
      if (isValid(this.errors) === true) {
        // Blockchain
        this.nearService.executePrivilegedAction(
            this.contractId,
            'SkyCreateSale',
            {
              title: this.formTitle,
              url: this.formUrl,
              amount_ft: this.formAmount.toString(),
              out_token_id: this.formOutTokenId + '.' + this.accountPostfix,
              time_from: toNanosecond(moment(`${this.formFromDate} ${this.formFromTime}`, this.t('default._datepicker_format') + ' hh:mm').toDate()).toString(),
              duration: toNanoseconds(this.formDurationDays, this.formDurationHours, 0, 0).toString()
            },
            0.0
        ).then(r => {
            console.log(r)
            this.formTitle = ''
            this.formDescription = ''
            this.active = false
        }).catch((e) => {
            this.$logger.error('D', 'app@components/dao/ModalActionSkywardFinanceCreateSale', 'AddCreateSale-blockchain', `Failed to create sale [${this.formTitle}]`)
            this.$logger.error('B', 'app@components/dao/ModalActionSkywardFinanceCreateSale', 'AddCreateSale-blockchain', `Failed to create sale [${this.formTitle}]`)
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