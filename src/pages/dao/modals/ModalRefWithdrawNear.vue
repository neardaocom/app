<template>
    <MDBModal
        id="modalAddLiguidity"
        tabindex="-1"
        labelledby="modalAddLiguidity"
        v-model="active"
        size="lg"
    >
        <MDBModalHeader>
            <MDBModalTitle id="modalAddLiguidity"> {{ `${t('default.withdraw')} ${tokenSymbol}` }} </MDBModalTitle>
        </MDBModalHeader>
        <MDBModalBody class="text-start">
          <div class="d-flex justify-content-between">
              <label for="amount" class="form-label">{{`${t('default.amount')} ${tokenSymbol}`}}</label>
              <div class="small">{{`${t('default.balance')}: ${n(balance)}`}}</div>
          </div>
          <MDBInput inputGroup id="amount" @input="changeAmount" @keyup="validateAmount" @blur="validateAmount"  :model-value="amountFormated" :isValid="!errors.amount" :isValidated="isValidated.amount" :invalidFeedback="errors.amount">
            <MDBBtn @click="nearToMax" outline="primary" :ripple="{ color: 'dark' }">
              {{t('default.max')}}
            </MDBBtn>
          </MDBInput>
            
        </MDBModalBody>
        <MDBModalFooter>
            <MDBBtn color="secondary" @click="close()">{{ t('default.close') }}</MDBBtn>
            <MDBBtn color="primary" @click="withdrawNear">{{ t('default.withdraw') }}</MDBBtn>
        </MDBModalFooter>
    </MDBModal>
</template>

<script>
import { ref, toRefs, watch } from "vue";
import { reactive } from "@vue/reactivity";
import { useI18n } from "vue-i18n";
import { requiredValidator, isValid, isNumber, minNumber, maxNumber } from '@/utils/validators'
import {
  MDBBtn,
  MDBInput,
  MDBModal,
  MDBModalHeader,
  MDBModalTitle,
  MDBModalBody,
  MDBModalFooter
} from "mdb-vue-ui-kit";
import Decimal from 'decimal.js'

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
    },
    balance: {
        type: Number,
        required: true,
    },
    tokenDecimals:{
      type: Number,
      required: true,
    },
    tokenSymbol:{
      type: String,
      required: true,
    },
    tokenId:{
      type: String,
      required: true,
    }
  },
  setup(props) {
    const { t, n } = useI18n();

    const { show } = toRefs(props)

    const active = ref(false)
    
    const openModal = () => { active.value = true }

    watch(show, openModal)

    const amount = ref(0) 
    const amountFormated = ref(n(0))

    const isValidated = ref({
        amount: false,
    })

    const errors = reactive({});

    return {
      t, n, active, amountFormated, isValidated, errors, amount
    };
  },

  computed: {
    nearService() {
      return this.$store.getters['near/getService']
    },
  },
  methods: {
    withdrawNear(){
        this.validate()
        if (isValid(this.errors) === true) {
            const amount = new Decimal(this.amount).mul(10 ** this.tokenDecimals).toFixed();
            this.nearService.executePrivilegedAction(
                this.contractId,
                'RefWithdrawDeposit',
                { "token_id": this.tokenId, "amount": amount.toString() }
            ).then(r => {
                console.log(r)
                this.active = false
            }).catch((e) => {
                this.$logger.error('D', 'app@components/dao/ModalUgprade', 'UpgradeDao-blockchain', `Failed to upgrade DAO [${this.contractId}]`)
                this.$logger.error('B', 'app@components/dao/ModalUgprade', 'UpgradeDao-blockchain', `Failed to upgrade DAO [${this.contractId}]`)
                this.$notify.danger(this.t('default.notify_upgrade_dao_fail_title'),  this.t('default.notify_blockchain_fail') + " " +  this.t('default.notify_upgrade_dao_fail_message'))
                this.$notify.flush()
                console.log(e)
            })
        }
    },

    nearToMax(){
      this.amountFormated = this.n(this.balance)
      this.amount = this.balance
    },

    validate(){
      this.validateAmount()

    },

    changeAmount(event){
        event.target.value = this.n(+event.target.value.replace(/[^0-9]/g,''))
        this.amount = +event.target.value.replace(/[^0-9]/g,'')
    },
    
    validateAmount(){
        const field = "amount"
        const requiredVal = requiredValidator(this.amount)
        const isNumberVal = isNumber(this.amount)
        const minNumberVal = minNumber(this.amount, {min: 1})
        const maxNumberVal = maxNumber(this.amount, {max: new Decimal(this.balance).toFixed(2)})
        if (isNumberVal.valid === false) {
            this.errors[field] = this.t('default.' + isNumberVal.message, isNumberVal.params)
        }else if (requiredVal.valid === false) {
            this.errors[field] = this.t('default.' + requiredVal.message, requiredVal.params)
        }else if (minNumberVal.valid === false) {
            this.errors[field] = this.t('default.' + minNumberVal.message, minNumberVal.params)
        } else if (maxNumberVal.valid === false) {
            this.errors[field] = this.t('default.' + maxNumberVal.message, maxNumberVal.params)
        } else {
            this.errors[field] = null
        }
        this.isValidated.amount = true
    },
    
    close() {
      this.active = false
    },
  }
};
</script>