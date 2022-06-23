<template>
    <MDBModal
        id="modalAddLiguidity"
        tabindex="-1"
        labelledby="modalAddLiguidity"
        v-model="active"
        size="lg"
    >
        <MDBModalHeader>
            <MDBModalTitle id="modalAddLiguidity"> {{ t('default.remove_liquidity') }} </MDBModalTitle>
        </MDBModalHeader>
        <MDBModalBody class="text-start">
            <div class="d-flex justify-content-between">
                <label for="amount" class="form-label">{{ t('default.shares') }}</label>
                <div class="small">{{`${t('default.shares')}: ${n(maxShares)}`}}</div>
            </div>
            <MDBInput inputGroup id="amount" @input="changeAmount" @keyup="validateAmount" @blur="validateAmount"  :model-value="amountFormated" :isValid="!errors.amount" :isValidated="isValidated.amount" :invalidFeedback="errors.amount">
                <MDBBtn @click="sharesToMax" outline="primary" :ripple="{ color: 'dark' }">
                    {{t('default.max')}}
                </MDBBtn>
            </MDBInput>
        </MDBModalBody>
        <MDBModalFooter>
            <MDBBtn color="secondary" @click="close()">{{ t('default.close') }}</MDBBtn>
            <MDBBtn color="primary" @click="removeLiquidity">{{ t('default.remove_liquidity') }}</MDBBtn>
        </MDBModalFooter>
    </MDBModal>
</template>

<script>
import { ref, toRefs, watch } from "vue";
import Sale from "../../../components/dao/defi/Sale.vue"
import { reactive } from "@vue/reactivity";
import { useI18n } from "vue-i18n";
import Validator from '@/models/utils/Validator'
import Decimal from 'decimal.js'
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
    },
    sale: {
        type: Sale,
        required: true,
    },
    tokenDecimals:{
        type: Number,
        required: true,
    },
    maxShares:{
        type: Number,
        required: true
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
    removeLiquidity(){
        this.validate()
        if (Validator.isValid(this.errors) === true) {
            // const min_ft = new Decimal(this.sale.amounts[0] * this.amount / this.sale.total_shares).toFixed()
            // const min_near = new Decimal(this.sale.amounts[1] * this.amount / this.sale.total_shares).toFixed()
             const amount = new Decimal(this.amount).toFixed()
            this.nearService.executePrivilegedAction(
                this.contractId,
                'RefWithdrawLiquidity',
                { "pool_id": this.sale.id, "shares": amount.toString(), "min_ft": "0", "min_near": "0"}
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

    sharesToMax(){
        this.amountFormated = this.n(this.maxShares)
        this.amount = this.maxShares
        console.log(this.amount);
    },

    validate(){
        this.amount = +this.amountFormated.replace(/[^0-9]/g,'')
        this.validateAmount()
    },

    changeAmount(event){
        event.target.value = this.n(+event.target.value.replace(/[^0-9]/g,''))
        this.amount = +event.target.value.replace(/[^0-9]/g,'')
    },
    
    validateAmount(){
        console.log(this.amount);
        console.log(new Decimal(this.amount).toFixed().toString());
        const field = "amount"
        const requiredVal = Validator.requiredValidator(this.amount)
        const isNumberVal = Validator.isNumber(new Decimal(this.amount).toFixed())
        const minNumberVal = Validator.minNumber(this.amount, {min: 1})
        const maxNumberVal = Validator.maxNumber(this.amount, {max: this.maxShares})
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

    // watch:{
    //     amountFormated: (val) => {
    //         this.amount = val
    //     }
    // }
  }
};
</script>