<template>
  <MDBModal
    id="modalAddCouncil"
    tabindex="-1"
    labelledby="modalAddCouncilLabel"
    v-model="active"
    size="lg"
  >
    <MDBModalHeader>
      <MDBModalTitle id="modalAddCouncilLabel"> {{ t('default.add_council') }} </MDBModalTitle>
    </MDBModalHeader>
    <MDBModalBody class="text-start">
      <label for="account-id-input" class="form-label">{{ t('default.account_id') }}</label>
      <MDBInput id="account-id-input" inputGroup :formOutline="false" aria-describedby="account-addon" v-model="formAccount" data-mdb-showcounter="true" maxlength="100"
          @keyup="validateAccount()" @blur="validateAccountExists()" :isValid="!errors.formAccount" :isValidated="isValidated.formAccount" :invalidFeedback="errors.formAccount"
      >
          <span class="input-group-text" id="account-addon">.{{ getAccountPostfix() }}</span>
      </MDBInput>
      <br/>
      <label for="description-input" class="form-label">{{ t('default.description') }}</label>
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
import { requiredValidator, nearAccountValidator, isValid } from '@/utils/validators'
import { getAccountIdPostfix } from "@/services/nearService/utils"
import { getRandom } from '@/utils/integer'
import { makeFileFromString } from "@/services/ipfsService/IpfsService"
import {
  MDBBtn,
  MDBInput,
  MDBModal,
  MDBModalHeader,
  MDBModalTitle,
  MDBModalBody,
  MDBModalFooter
} from "mdb-vue-ui-kit";
import { MDBWysiwyg } from "mdb-vue-wysiwyg-editor";

export default {
  components: {
    MDBBtn
    , MDBInput
    , MDBModal, MDBModalHeader, MDBModalTitle, MDBModalBody, MDBModalFooter
    , MDBWysiwyg
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
    groups: {
      type: Object,
      required: true
    },
    tokenHolders: {
      type: Object,
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
    const formGroup = ref('Council')
    const formDescription = ref('')

    const isValidated = ref({
        formAccount: false,
        formGroup: false,
        formDescription: false,
    })

    const errors = reactive({});

    return {
      t, active
      , formAccount, formGroup, formDescription
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
    getAccountPostfix() {
      return getAccountIdPostfix(this.factoryAccount)
    },
    validateAccount(){
      const field = "formAccount"
      const requiredVal = requiredValidator(this.formAccount)
      const nearAccountVal = nearAccountValidator(this.formAccount)
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
    validateGroup(){
      const field = "formGroup"
      const requiredVal = requiredValidator(this.formGroup)
      if (requiredVal.valid === false) {
        this.errors[field] = this.t('default.' + requiredVal.message, requiredVal.params)
      } else {
        this.errors[field] = null
      }
      this.isValidated.formGroup = true
    },
    validateDescription(){
      const field = "formDescription"
      this.formDescription = ref(this.$refs.refWysiwyg.getCode())
      this.errors[field] = null
      this.isValidated.formDescription = true
    },
    validate(){
      this.validateAccount()
      this.validateGroup()
      this.validateDescription()
    },
    async vote() {
      this.validate()
      if (isValid(this.errors) === true) {
        //console.log(this.formGroup)
        //console.log(this.formAccount)
        // IPFS
        let ipfs_cid = null
        try {
          const name = this.accountId + '-addCouncil-' + getRandom(1, 999)
          ipfs_cid = await this.ipfsService.storeFiles(makeFileFromString(this.formDescription, name), name)
        } catch(e){
          console.log(e);
        }

        // BLOCKCHAIN
        this.nearService.addProposal(
            this.contractId
            , ipfs_cid
            , [this.t('default.add_member')]
            , {
                'AddMember': {
                    group: this.formGroup,
                    account_id: (this.formAccount + '.' + this.getAccountPostfix())
                }
            }
            , 0.5
            , this.accountId
        ).then(r => {
            console.log(r)
            this.formAccount = ''
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