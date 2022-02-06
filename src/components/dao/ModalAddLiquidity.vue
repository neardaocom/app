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
            <div class="d-flex justify-content-between">
                <label for="amount1" class="form-label">{{ `${t('default.amount')} ${tokensNames[0]}` }}</label>
                <div class="small">{{`${t('default.balance')}: ${maxTokenStr}`}}</div>
            </div>
            <MDBInput inputGroup @input="changeAmount($event, 1)" id="amount1" @keyup="validateAmount('amount1', amount1)" @blur="validateAmount('amount1', amount1)"  v-model="amountFormated1" :isValid="!errors.amount1" :isValidated="isValidated.amount1" :invalidFeedback="errors.amount1">
                <MDBBtn @click="tokenToMax" outline="primary" :ripple="{ color: 'dark' }">
                    {{t('default.max')}}
                </MDBBtn>
            </MDBInput>
            <br/>
            <div class="d-flex justify-content-between">
                <label for="amount2" class="form-label">{{ `${t('default.amount')} ${tokensNames[1]}` }}</label>
                <div class="small">{{`${t('default.balance')}: ${nearServiceStr}`}}</div>
            </div>
            <MDBInput inputGroup @input="changeAmount($event, 2)" id="amount2" @keyup="validateAmount('amount2', amount2)" @blur="validateAmount('amount2', amount2)"  v-model="amountFormated2" :isValid="!errors.amount2" :isValidated="isValidated.amount2" :invalidFeedback="errors.amount2">
                <MDBBtn @click="nearToMax" outline="primary" :ripple="{ color: 'dark' }">
                    {{t('default.max')}}
                </MDBBtn>
            </MDBInput>

        </MDBModalBody>
        <MDBModalFooter>
            <MDBBtn color="secondary" @click="close()">{{ t('default.close') }}</MDBBtn>
            <MDBBtn color="primary" @click="addLiquidity">{{ t('default.add_liquidity') }}</MDBBtn>
        </MDBModalFooter>
    </MDBModal>
</template>

<script>
import { ref, toRefs, watch, computed, inject } from "vue";
import Sale from "@/components/dao/Sale.vue"
import { reactive } from "@vue/reactivity";
import { useI18n } from "vue-i18n";
import { useStore } from 'vuex'
import { requiredValidator, isValid, isNumber, minNumber, maxNumber } from '@/utils/validators'
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
    },
    tokensNames:{
        type: Array,
        required: true,

    },
    maxNear:{
        type: Object,
        required: true,
    },
    maxToken:{
        type: Object,
        required: true,
    },
    
  },
  setup(props) {
    const { show, maxToken, maxNear, tokenDecimals, contractId, sale } = toRefs(props)
    const logger = inject('logger')
    const notify = inject('notify')
    const { t, n } = useI18n();
    const store = useStore()
    const nearService = computed(() => store.getters['near/getService'])

    // modal
    const active = ref(false)

    const openModal = () => { active.value = true }
    const close = () => { this.active = false}
    watch(show, openModal)

    // inputs
    const amount1 = ref(0)
    const amount2 = ref(0)
    const amountFormated1 = ref(n(0))
    const amountFormated2 = ref(n(0)) 

    const maxTokenStr = computed(() => maxToken.value.toFixed().toLocaleString() )
    const nearServiceStr = computed(() => maxNear.value.toFixed().toLocaleString('cs-CZ') )
    console.log(nearServiceStr.value);

    const tokenToMax = () => { amountFormated1.value = maxToken.value.toFixed().toLocaleString() }
    const nearToMax = () => { amountFormated2.value = maxNear.value.toFixed().toLocaleString() }
    
    // validate inputs
    watch(amountFormated1, () => {
        amount1.value = +amountFormated1.value.replace(/[^0-9]/g,'')
        validateAmount("amount1", amount1.value)
    })

    watch(amountFormated2, () => {
        amount2.value = +amountFormated2.value.replace(/[^0-9]/g,'')
        validateAmount("amount2", amount2.value)
    })

    const changeAmount = (event, inputNumber) =>{
        const amount = event.target.value.replace(/[^0-9]/g,'')
        console.log(new Decimal(amount).toNumber());
        console.log(new Decimal(amount).toFixed());
        event.target.value = BigInt(amount).toLocaleString()
        if(inputNumber === 1){
            amountFormated1.value = amount
        }else{
            amountFormated2.value = amount
        }
        
    }

    const isValidated = ref({
        amount1: false,
        amount2: false,
    })

    const validate = () => {
        validateAmount("amount1", amount1.value)
        validateAmount("amount2", amount2.value)
    }

    const errors = reactive({});

    const validateAmount = (fieldName, amount) => {
        const field = fieldName
        const requiredVal = requiredValidator(amount)
        const isNumberVal = isNumber(amount)
        const minNumberVal = minNumber(amount, {min: 1})
        let maxNumberVal
        if(fieldName === "amount1" ){
            maxNumberVal = maxNumber(amount, {max: maxToken.value})
        }else{
            maxNumberVal = maxNumber(amount, {max: maxNear.value})
        }
        if (isNumberVal.valid === false) {
            errors[field] = t('default.' + isNumberVal.message, isNumberVal.params)
        }else if (requiredVal.valid === false) {
            errors[field] = t('default.' + requiredVal.message, requiredVal.params)
        }else if (minNumberVal.valid === false) {
            errors[field] = t('default.' + minNumberVal.message, minNumberVal.params)
        } else if (maxNumberVal.valid === false) {
            errors[field] = t('default.' + maxNumberVal.message, maxNumberVal.params)
        } else {
            errors[field] = null
        }
        isValidated.value[fieldName] = true
    }

    // liguidity
    const addLiquidity = () => {
        validate()
        if (isValid(errors) === true) {
            const amount_2 = new Decimal(amount2.value).mul(yoctoNear).toFixed();
            const amount_1 = new Decimal(amount1.value).mul(10 ** tokenDecimals.value).toFixed();

            nearService.value.executePrivilegedAction(
                contractId.value,
                'RefAddLiquidity',
                { "pool_id": sale.value.id, "amount_near": amount_2.toString(), "amount_ft": amount_1.toString() }
            ).then(() => {
                active.value = false
            }).catch((e) => {
                logger.error('D', 'app@components/dao/ModalUgprade', 'UpgradeDao-blockchain', `Failed to upgrade DAO [${contractId.value}]`)
                logger.error('B', 'app@components/dao/ModalUgprade', 'UpgradeDao-blockchain', `Failed to upgrade DAO [${contractId.value}]`)
                notify.danger(t('default.notify_upgrade_dao_fail_title'),  t('default.notify_blockchain_fail') + " " +  t('default.notify_upgrade_dao_fail_message'))
                notify.flush()
                console.log(e)
            })
        }
    }


    return {
      t, n, active, close, 
      amountFormated1, amountFormated2,
       tokenToMax, nearToMax, maxTokenStr,
       nearServiceStr,
       isValidated, errors, 
       amount1, amount2, 
       validateAmount, validate, 
       changeAmount, 
       addLiquidity, nearService
    };
  },
};
</script>