<template>
    <MDBModal
        id="modalUpgrade"
        tabindex="-1"
        labelledby="modalUpgradeLabel"
        v-model="active"
        size="lg"
    >
        <MDBModalHeader>
            <MDBModalTitle id="modalUpgradeLabel"> {{ t('default.add_to_reffinance') }} </MDBModalTitle>
        </MDBModalHeader>
        <MDBModalBody class="text-start">
          <MDBListGroup>
            <MDBListGroupItem :color="registered ? 'success' :  'dark'" >
              <div class="d-flex w-100 justify-content-between">
                <h5 class="mb-1">{{t('default.register_token')}}</h5>
                  {{registered ? t('default.done') : t('default.click_to_register_token')  }}
              </div>
              <p class="mb-1">
                {{t('default.register_text')}}
              </p>
              <div class="d-flex w-100 flex-row-reverse">
                <MDBBtn v-if="!registered" @click="registerToken" color="primary" >
                  {{t('default.register_token')}} <MDBIcon icon></MDBIcon>
                </MDBBtn>
              </div>
            </MDBListGroupItem>
            <MDBListGroupItem :disabled="!registered" :color="registered ? 'dark' :  'light'">
              <div class="d-flex w-100 justify-content-between">
                <h5 class="mb-1">{{t('default.create_pool')}}</h5>
                  {{registered ? t('default.click_to_create_pool') : t('default.first_register_token')  }}
                  
              </div>
              <p class="mb-1">
                {{registered ? t('default.create_pool_text') : ''}}
              </p>
              <div class="d-flex w-100 justify-content-between align-items-end">
                <div v-if="registered">
                  <label for="fee" class="form-label">{{ t('default.total_fee') }}</label>
                  <MDBInput inputGroup :formOutline="false" id="fee" @input="changeFee" @keyup="validateFee" @blur="validateFee"  v-model="fee" :isValid="!errors.fee" :isValidated="isValidated.fee" :invalidFeedback="errors.fee">
                    <span :outline="false" class="input-group-text">%</span>
                  </MDBInput>
                </div>
                <MDBBtn v-if="registered" @click="addPool" color="primary" >
                  {{t('default.create_pool')}} <MDBIcon icon="arrow-circle-up"></MDBIcon>
                </MDBBtn>
              </div>
            </MDBListGroupItem>
          </MDBListGroup>
        </MDBModalBody>
        <MDBModalFooter>
            <MDBBtn color="secondary" @click="close()">{{ t('default.close') }}</MDBBtn>
        </MDBModalFooter>
    </MDBModal>
</template>

<script>
import { reactive, ref, toRefs, watch } from "vue";
import { RefFinanceService } from '@/services/refFinanceService'
import { useI18n } from "vue-i18n";
import { requiredValidator, isValid, isNumber, minNumber, maxNumber } from '@/utils/validators'
import {
  MDBBtn,
  MDBIcon,
  MDBModal,
  MDBModalHeader,
  MDBModalTitle,
  MDBModalBody,
  MDBModalFooter,
  MDBListGroup,
  MDBListGroupItem,
  MDBInput
} from "mdb-vue-ui-kit";

export default {
  components: {
    MDBBtn, MDBIcon, MDBModal, MDBModalHeader, MDBModalTitle, MDBModalBody, MDBModalFooter, MDBListGroup, MDBListGroupItem, MDBInput
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

    const registered = ref(false)

    const fee = ref(0.25)

    const isValidated = ref({
        fee: false,
    })

    const errors = reactive({});

    return {
      t, active, registered, fee, isValidated, errors
    };
  },
  async mounted() {
    this.nearService.getNear().account(this.contractId).then( account => {
      const refFinance = new RefFinanceService(account, process.env.VUE_APP_REF_FINANCE_CONTRACT)
      refFinance.contract.get_user_whitelisted_tokens({"account_id": this.contractId}).then( tokens => {
        if(tokens.includes(this.contractId)){
          this.registered = true
        }
      })
    })
    if(localStorage.token_registered === 'true'){
      this.active = true
    } 
    localStorage.token_registered = 'false'
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
    registerToken(){
      localStorage.token_registered = 'true'
      this.nearService.executePrivilegedAction(
          this.contractId,
          'RefRegisterTokens',
          null
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
    },

    addPool(){
      if (isValid(this.errors) === true) {
        this.nearService.executePrivilegedAction(
            this.contractId,
            'RefAddPool',
            {"fee": this.fee * 100}
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
    
    close() {
      this.active = false
    },

    validateFee(){
        const field = "fee"
        const requiredVal = requiredValidator(this.fee)
        const isNumberVal = isNumber(this.fee)
        const minNumberVal = minNumber(this.fee, {min: 0.01})
        const maxNumberVal = maxNumber(this.fee, {max: 19})
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
        this.isValidated.fee = true
    },

  }
};
</script>