<template>
    <MDBModal
        id="modalAddLiguidity"
        tabindex="-1"
        labelledby="modalAddLiguidity"
        v-model="active"
        size="lg"
    >
        <MDBModalHeader>
            <MDBModalTitle id="modalAddLiguidity"> {{ t('default.add_liquidity') }} </MDBModalTitle>
        </MDBModalHeader>
        <MDBModalBody class="text-start">
            <label for="amount1" class="form-label">{{ `${t('default.amount')} ${sale.token_account_ids[0]}` }}</label>
            <MDBInput id="amount1" @input="changeAmount1" @keyup="validateAmount1" @blur="validateAmount1"  :model-value="amountFormated1" :isValid="!errors.amount1" :isValidated="isValidated.amount1" :invalidFeedback="errors.amount1"/>
            <br/>
            <label for="amount2" class="form-label">{{ `${t('default.amount')} ${sale.token_account_ids[1]}` }}</label>
            <MDBInput id="amount2" @input="changeAmount2" @keyup="validateAmount2" @blur="validateAmount2"  :model-value="amountFormated2" :isValid="!errors.amount2" :isValidated="isValidated.amount2" :invalidFeedback="errors.amount2"/>

        </MDBModalBody>
        <MDBModalFooter>
            <MDBBtn color="secondary" @click="close()">{{ t('default.close') }}</MDBBtn>
            <MDBBtn color="primary" @click="addLiquidity">{{ t('default.add_liquidity') }}</MDBBtn>
        </MDBModalFooter>
    </MDBModal>
</template>

<script>
import { ref, toRefs, watch } from "vue";
import Sale from "@/components/dao/Sale.vue"
import { reactive } from "@vue/reactivity";
import { useI18n } from "vue-i18n";
import { requiredValidator, isValid, isNumber, minNumber } from '@/utils/validators'
import { yoctoNear } from "@/services/nearService/constants";
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
    }
  },
  setup(props) {
    const { t, n } = useI18n();

    const { show } = toRefs(props)

    const active = ref(false)
    
    const openModal = () => { active.value = true }

    watch(show, openModal)

    const amount1 = ref(0)
    const amount2 = ref(0) 
    const amountFormated1 = ref(n(0))
    const amountFormated2 = ref(n(0)) 

    const isValidated = ref({
        amount1: false,
        amount2: false,
    })

    const errors = reactive({});

    return {
      t, n, active, amountFormated1, amountFormated2, isValidated, errors, amount1, amount2
    };
  },

  computed: {
    nearService() {
      return this.$store.getters['near/getService']
    },
  },
  methods: {
    addLiquidity(){
        this.validate()
        if (isValid(this.errors) === true) {
            const amount2 = new Decimal(this.amount2).mul(yoctoNear).toFixed();
            const amount1 = new Decimal(this.amount1).mul(10 ** this.tokenDecimals).toFixed();

            console.log(amount1.toString());
            this.nearService.executePrivilegedAction(
                this.contractId,
                'RefAddLiquidity',
                { "pool_id": this.sale.id, "amount_near": amount2.toString(), "amount_ft": amount1.toString() }
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

    validate(){
      this.validateAmount1()
      this.validateAmount2()

    },

    changeAmount1(event){
        this.changeAmount(event, true)
    },

    changeAmount2(event){
        this.changeAmount(event, false)
    },

    changeAmount(event, field){
        event.target.value = this.n(+event.target.value.replace(/[^0-9]/g,''))
        if(field){
            this.amount1 = +event.target.value.replace(/[^0-9]/g,'')
        }else{
            this.amount2 = +event.target.value.replace(/[^0-9]/g,'')
        }
    },

    validateAmount1(){
        this.validateAmount("amount1", this.amount1)
    },

    
    validateAmount2(){
        this.validateAmount("amount2", this.amount2)
    },
    
    validateAmount(fieldName, amount){
        const field = fieldName
        const requiredVal = requiredValidator(amount)
        const isNumberVal = isNumber(amount)
        const minNumberVal = minNumber(amount, {min: 1})
        //const maxNumberVal = maxNumber(amount, {max: 100000000000000})
        if (isNumberVal.valid === false) {
            this.errors[field] = this.t('default.' + isNumberVal.message, isNumberVal.params)
        }else if (requiredVal.valid === false) {
            this.errors[field] = this.t('default.' + requiredVal.message, requiredVal.params)
        }else if (minNumberVal.valid === false) {
            this.errors[field] = this.t('default.' + minNumberVal.message, minNumberVal.params)
        /*} else if (maxNumberVal.valid === false) {
            this.errors[field] = this.t('default.' + maxNumberVal.message, maxNumberVal.params)*/
        } else {
            this.errors[field] = null
        }
        this.isValidated[fieldName] = true
    },
    
    close() {
      this.active = false
    },
  }
};
</script>