<template>
    <MDBModal
        id="modalPayout"
        tabindex="-1"
        labelledby="modalPayoutLabel"
        v-model="active"
        size="lg"
    >
        <MDBModalHeader>
          <MDBModalTitle id="modalPayoutLabel"> {{ t('default.payout') }} </MDBModalTitle>
        </MDBModalHeader>
        <MDBModalBody class="text-start">
          <label for="account-id-input" class="form-label">{{ t('default.account_id') }}</label>
          <MDBInput id="account-id-input" inputGroup :formOutline="false" aria-describedby="account-addon" v-model="formAccount" data-mdb-showcounter="true" maxlength="100"
              @keyup="validateAccount()" @blur="validateAccountExists()" :isValid="!errors.formAccount" :isValidated="isValidated.formAccount" :invalidFeedback="errors.formAccount"
          >
              <span class="input-group-text" id="account-addon">.{{ getAccountPostfix() }}</span>
          </MDBInput>
          <br/>
          <label for="amount-input" class="form-label">{{ t('default.amount') }}</label>
          <MDBInput class="text-left" id="amount-input" min="0.00" inputGroup :formOutline="false" aria-describedby="amount-addon" type="number" v-model.number="formAmount"
              @keyup="validateAmount()" @blur="validateAmount()" :isValid="!errors.formAmount" :isValidated="isValidated.formAmount" :invalidFeedback="errors.formAmount"
          >
              <span class="input-group-text" id="amount-addon">{{ amountPostfix }}</span>
          </MDBInput>
          <div class="text-center mt-2">
            <MDBBtnGroup>
              <MDBRadio :btnCheck="true" :wrap="false" labelClass="btn btn-secondary" label="NEAR" name="options" value="near"
                v-model="formAsset" />
              <MDBRadio :btnCheck="true" :wrap="false" labelClass="btn btn-secondary" :label="tokenName" name="options" value="token"
                v-model="formAsset" />
            </MDBBtnGroup>
          </div>
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
import Validator from '@/models/utils/Validator'
import IntegerHelper from '@/models/utils/IntegerHelper'
import { makeFileFromString } from "@/services/ipfsService/IpfsService.js"
import { MDBWysiwyg } from "mdb-vue-wysiwyg-editor";
import {
  MDBBtn,
  MDBInput,
  MDBModal,
  MDBModalHeader,
  MDBModalTitle,
  MDBModalBody,
  MDBModalFooter,
  MDBRadio,
  MDBBtnGroup,
} from "mdb-vue-ui-kit";
import { yoctoNear } from "@/services/nearService/constants"
import Decimal from 'decimal.js';
import _ from "lodash"

export default {
  components: {
    MDBBtn
    , MDBInput
    , MDBModal, MDBModalHeader, MDBModalTitle, MDBModalBody, MDBModalFooter
    , MDBRadio, MDBBtnGroup
    , MDBWysiwyg,
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
    tokenName: {
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
    const formAsset = ref('near')
    const formDescription = ref('')

    const isValidated = ref({
        formAccount: false,
        formAmount: false,
        formDescription: false,
    })

    const errors = reactive({});

    return {
      t, active
      , formAccount, formAmount, formAsset, formDescription
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
    amountPostfix() {
      let postfix = 'Ⓝ'
      if (this.formAsset == 'token') {
        postfix = this.tokenName
      }
      return postfix
    }
  },
  methods: {
    getAccountPostfix() {
      return _.last(this.factoryAccount.split('.'))
    },
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
    validateAccountExists() {
      const field = "formAccount"
      const accountId = this.formAccount.trim() + '.' + this.getAccountPostfix()
      this.errors[field] = this.t('default.validating')
      this.nearService.getAccountState(accountId)
          .then(() => {
              this.errors[field] = null
          })
          .catch(() => {
              this.errors[field] = this.t('default.validator_near_account_not_found')
          })
      this.isValidated.formAccount = true
    },
    validateAmount(){
      const field = "formAmount"
      const requiredVal = Validator.requiredValidator(this.formAmount)
      const isNumberVal = Validator.isNumber(this.formAmount)
      const minNumberVal = Validator.minNumber(this.formAmount, 0.0)
      const maxNumberVal = Validator.maxNumber(this.formAmount, 1000000.0)
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
    validateDescription(){
      const field = "formDescription"
      this.formDescription = ref(this.$refs.refWysiwyg.getCode())
      const requiredVal = Validator.requiredValidator(this.formDescription)
      if (requiredVal.valid === false) {
        this.errors[field] = this.t('default.' + requiredVal.message, requiredVal.params)
      } else {
        this.errors[field] = null
      }
      this.isValidated.formDescription = true
    },
    validate(){
      this.validateAccount()
      this.validateAmount()
      this.validateDescription()
    },
    async vote() {
      this.validate()
      if (isValid(this.errors) === true) {
        // IPFS
        let ipfs_cid = null
        try {
          const name = this.accountId + '-payout-' + this.formTitle + '-' + IntegerHelper.getRandom(1, 999)
          ipfs_cid = await this.ipfsService.storeFiles(makeFileFromString(this.formDescription, name), name)
        } catch(e){
          this.$logger.error('D', 'app@components/dao/ModalPayout', 'StoreFile-ipfs', 'File saving to ipfs failed')
          this.$logger.error('B', 'app@components/dao/ModalPayout', 'StoreFile-ipfs', 'File saving to ipfs failed')
          this.$notify.danger(this.t('default.notify_save_file_ipfs_fail_title'), this.t('default.notify_ipfs_fail') + " " + this.t('default.notify_save_file_ipfs_fail_message'))
          this.$notify.flush()
          console.log(e);
          return
        }
        // Blockchain
        switch (this.formAsset) {
          case 'near':
            this.nearService.addProposal(
                this.contractId
                , ipfs_cid
                , [this.t('default.payout')]
                , {
                    'SendNear': {
                        amount_near: Decimal.set({ toExpPos: 30 }).mul(this.formAmount, yoctoNear).toFixed(),
                        account_id: (this.formAccount + '.' +  this.getAccountPostfix())
                    }
                }
                , 0.5
                , this.accountId
            ).then(r => {
                console.log(r)
                this.formAccount = ''
                this.formAmount = 0
                this.formDescription = ''
                this.active = false
            }).catch((e) => {
            const account =  this.formAccount + '.' + this.factoryAccount.split('.')[1]
            this.$logger.error('D', 'app@components/dao/ModalPayout', 'AddProposal-blockchain', `Payout to [${account}] failed`)
            this.$logger.error('B', 'app@components/dao/ModalPayout', 'AddProposal-blockchain', `Payout to [${account}] failed`)
            this.$notify.danger(this.t('default.notify_payout_fail_title'), this.t('default.notify_blockchain_fail') + " " + this.t('default.notify_payout_fail_message', {account : account}))
            this.$notify.flush()
            console.log(e)
            })
            break;
          case 'token':
            this.nearService.distributeFt(
                this.contractId
                , this.formAmount
                , 'Community'
                , [(this.formAccount + '.' +  this.getAccountPostfix())]
                , ipfs_cid
                , 0.5
            ).then(r => {
                console.log(r)
                this.formAccount = ''
                this.formAmount = 0
                this.formDescription = ''
                this.active = false
            }).catch((e) => {
                const account =  this.formAccount + '.' + this.factoryAccount.split('.')[1]
                this.$logger.error('D', 'app@components/dao/ModalPayout', 'AddProposal-blockchain', `Payout to [${account}] failed`)
                this.$logger.error('B', 'app@components/dao/ModalPayout', 'AddProposal-blockchain', `Payout to [${account}] failed`)
                this.$notify.danger(this.t('default.notify_payout_fail_title'), this.t('default.notify_blockchain_fail') + " " + this.t('default.notify_payout_fail_message', {account : account}))
                this.$notify.flush()
                console.log(e)
            })
            break;
          default:
            throw new Error('Unsupported asset: ' + this.formAsset)
        }
      }
    },
    close() {
      this.active = false
    },
  }
};
</script>