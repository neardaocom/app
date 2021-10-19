<template>
    <Header></Header>
    <main>
        <section class="bg-white shadow-2 mb-3">
            <div class="container">
                <MDBStepper vertical class="text-start pb-4">
                    <MDBStepperStep active>
                        <MDBStepperHead icon="1">
                            {{ t('default.basic_information') }}
                        </MDBStepperHead>
                        <MDBStepperContent>
                            <div class="row" >
                                <!-- Name -->
                                <div class="col-12 col-md-6">
                                    <label for="dao-name" class="form-label">{{ t('default.dao_name') }}</label>
                                    <MDBInput  wrapperClass="mb-4" id="dao-name" @keyup="validateName" @blur="validateName" v-model="name" :isValid="!errors.name" :isValidated="isValidated.name" :invalidFeedback="errors.name"/>
                                </div>

                                <!-- Account --> 
                                <div class="col-12 col-md-6">
                                    <label for="dao-account" class="form-label">{{ t('default.account') }}</label>
                                    <MDBInput wrapperClass="mb-4" id="dao-account" @keyup="validateAccount" @blur="validateAccount" v-model="account" :isValid="!errors.account" :isValidated="isValidated.account" :invalidFeedback="errors.account" inputGroup :formOutline="false" aria-describedby="dao-account" :data-mdb-showcounter="true">
                                        <span class="input-group-text" id="dao-account">.{{ factoryAccount }}</span>
                                    </MDBInput>
                                </div>

                                <!-- Slogan -->
                                <div class="col-12 col-md-8">
                                    <label for="dao-slogan" class="form-label">{{ t('default.slogan') }}</label>
                                    <MDBInput wrapperClass="mb-4" id="dao-slogan" @keyup="validateSlogan" @blur="validateSlogan" v-model="slogan" :isValid="!errors.slogan" :isValidated="isValidated.slogan" :invalidFeedback="errors.slogan"/>
                                </div>

                                <!-- Type -->
                                <div class="col-12 col-md-6">
                                    <label for="dao-type" class="form-label">{{ t('default.type') }}</label>
                                    <MDBSelect filter ref="refDaoType" :preselect="false" v-model:selected="type" v-model:options="typeOptions" :no-results-text="noResults" wrapperClass="mb-4" id="dao-type" @keyup="validateType" @blur="validateType" :isValid="!errors.type" :isValidated="isValidated.type" :invalidFeedback="errors.type"/>
                                </div>

                                <!-- Location -->
                                <div class="col-12 col-md-6 mb-4">
                                    <label for="dao-location" class="form-label">{{ t('default.location') }}</label>
                                    <MDBSelect filter v-model:selected="location" v-model:options="locationOptions" :no-results-text="noResults" wrapperClass="mb-4" id="dao-location" @keyup="validateLocation" @blur="validateLocation" :isValid="!errors.location" :isValidated="isValidated.location" :invalidFeedback="errors.location"/>
                                </div>

                                <!-- Description -->
                                <div class="col-12 mb-4">
                                    <label for="dao-description" class="form-label">{{ t('default.dao_description') }}</label>
                                    <MDBWysiwyg :fixedOffsetTop="58" ref="refWysiwyg">
                                        <p v-html="description"></p>
                                    </MDBWysiwyg>
                                    <div v-if="errors.description" style="width: auto; margin-top: .25rem; font-size: .875rem; color: #f93154; margin-top: -1.0rem;">{{ errors.description }}</div>
                                </div>

                                <!-- Councils -->
                                <div class="col-12">
                                    <label for="dao-council" class="form-label">{{ t('default.dao_council') }}</label>
                                    <MDBInput id="dao-council" @keyup="validateCouncil" @blur="validateCouncil" v-model="councilString" :isValid="!errors.council" :isValidated="isValidated.council" :invalidFeedback="errors.council"  rows="2" wrapperClass="mb-5" />
                                </div>
                            </div>
                        
                        </MDBStepperContent>
                    </MDBStepperStep>
                    <MDBStepperStep>
                        <MDBStepperHead icon="2">
                            {{ t('default.tokens') }}
                        </MDBStepperHead>
                        <MDBStepperContent>
                            
                             <div class = "row">
                                <!-- ftName -->
                                <div class="col-md-6">
                                    <label for="dao-ft-name" class="form-label">{{ t('default.dao_ft_name') }}</label>
                                    <MDBInput wrapperClass="mb-4"  id="dao-ft-name" @keyup="validateFtName" @blur="validateFtName" v-model="ftName" :isValid="!errors.ftName" :isValidated="isValidated.ftName" :invalidFeedback="errors.ftName"/>
                                </div>

                                <!-- ftAmount -->
                                <div class="col-md-6">
                                    <label for="dao-ft-amount" class="form-label">{{ t('default.amount') }}</label>
                                    <MDBInput wrapperClass="mb-4" id="dao-ft-amount" @keyup="validateFtAmount" @blur="validateFtAmount"  v-model.number="ftAmount" v-mask="'### ### ###'" :isValid="!errors.ftAmount" :isValidated="isValidated.ftAmount" :invalidFeedback="errors.ftAmount" type="number"/>
                                </div>
                             </div>

                            <!-- ftInitDistribution -->
                            <div class = "row">
                                <div class="col-md-6">
                                    <label for="dao-ft-init-distribution" class="form-label">{{ t('default.dao_ft_init_distribution') }}</label>
                                    <MDBInput wrapperClass="mb-4" id="dao-ft-init-distribution" @keyup="validateFtInitDistribution" @blur="validateFtInitDistribution"  v-model.number="ftInitDistribution" :isValid="!errors.ftInitDistribution" :isValidated="isValidated.ftInitDistribution" :invalidFeedback="errors.ftInitDistribution" type="number"/>
                                </div>
                            </div>

                            <!-- error message for shares -->
                            <div ref="refFtShares" class="col text-danger invisible" >{{t('default.validator_shares_sum')}}</div>

                            <!-- ftInsiderShare -->
                            <div class="row mb-4">
                                <MDBRange wrapperClass="col-md-6 col-9" :label="t('default.dao_ft_insider_share')" v-model="ftInsiderShare" disabled :min="0" :max="100" />
                                <label class="form-label col-md-6 col-3">{{ ftInsiderShare }}%</label>
                            </div>

                            <!-- ftFundationShare -->
                            <MDBSwitch :label="t('default.add_ft_fundation_share')" v-model="addFtFundationShare"/>
                            <div  ref="refFtFundationShare" class="row mb-1 invisible">
                                <MDBRange wrapperClass="col-md-6 col-9" v-model="ftFundationShare" :min="0" :max="100" /> <!-- not @onChange, but watcher is set to ftFundationShare -->
                                <label class="form-label col-md-6 col-3">{{ ftFundationShare }}%</label>
                            </div>

                            <!-- ftCommunityShare -->
                            <MDBSwitch :label="t('default.add_ft_community_share')" v-model="addFtCommunityShare"/>
                            <div  ref="refFtCommunityShare" class="row mb-1 invisible">
                                <MDBRange wrapperClass="col-md-6 col-9"  v-model="ftCommunityShare" :min="0" :max="100" /> <!-- not @onChange, but watcher is set to ftCommunityShare -->
                                <label class="form-label col-md-6 col-3">{{ ftCommunityShare }}%</label>
                            </div>

                            <!-- ftPublicShare -->
                            <MDBSwitch :label="t('default.add_ft_public_share')" v-model="addFtPublicShare"/>
                            <div  ref="refFtPublicShare" class="row mb-1 invisible">
                                <MDBRange wrapperClass="col-md-6 col-9" v-model="ftPublicShare" :min="0" :max="100" /> <!-- not @onChange, but watcher is set to ftPublicShare -->
                                <label class="form-label col-md-6 col-3">{{ ftPublicShare }}%</label> 
                            </div>

                        </MDBStepperContent>
                    </MDBStepperStep>
                    <MDBStepperStep>
                        <MDBStepperHead icon="3">
                            {{ t('default.voting') }}
                        </MDBStepperHead>
                            <MDBStepperContent>

                                <!-- voteQuorum -->
                                <div class="row mb-4">
                                    <MDBRange wrapperClass="col-md-6 col-9" :label="t('default.dao_vote_quorum')" v-model="voteQuorum" :min="1" :max="100" />
                                    <label class="form-label col-md-6 col-3">{{ voteQuorum }}%</label>
                                </div>

                                <!-- voteApproveThreshold -->
                                <div class="row mb-4">
                                    <MDBRange wrapperClass="col-md-6 col-9" :label="t('default.dao_vote_approve_threshold')" v-model="voteApproveThreshold" :min="1" :max="100" />
                                    <label class="form-label col-md-6 col-3">{{ voteApproveThreshold }}%</label>
                                </div>

                                <!-- voteDurationDays -->
                                <div class="row mb-4">
                                    <MDBRange wrapperClass="col-md-6 col-9" :label="t('default.dao_vote_duration_days')" v-model="voteDurationDays" :min="0" :max="31" />
                                    <label class="form-label col-md-6 col-3">{{ voteDurationDays }} </label>
                                </div>

                                <!-- voteDurationHours -->
                                <div class="row mb-4">
                                    <MDBRange wrapperClass="col-md-6 col-9" :label="t('default.dao_vote_duration_hours')" v-model="voteDurationHours" :min="0" :max="23" />
                                    <label class="form-label col-md-6 col-3">{{ voteDurationHours }}h</label>
                                </div>


                                <!-- voteSpamThreshold -->
                                <!-- <div class="row mb-4"> -->
                                <!--     <MDBRange wrapperClass="col-md-6 col-9" :label="t('default.dao_vote_spam_threshold')" v-model="voteSpamThreshold" :min="1" :max="100" /> -->
                                <!--     <label class="form-label col-md-6 col-3">{{ voteSpamThreshold }}%</label> -->
                                <!-- </div> -->

                                <!-- voteOnlyOnce-->
                                <MDBSwitch wrapperClass="mb-2" :label="t('default.dao_vote_only_once')" v-model="voteOnlyOnce"/>

                                <MDBBtn class="mt-3 mb-2" @click="createDao()" color="primary">{{ t('default.create_dao') }}</MDBBtn>
                            </MDBStepperContent>
                        </MDBStepperStep>
                </MDBStepper>
            </div>
        </section>
    </main>
    <MDBAlert v-model="fieldErrorAlert" width="250px" position="top-center" autohide appendToBody color="danger"> {{t('default.invalid_field_form')}} </MDBAlert>
    <MDBAlert v-model="createDaoErrorAlert" width="250px" position="top-center" autohide appendToBody color="danger"> {{t('default.invalid_field_form')}} </MDBAlert>
  <Footer></Footer>
</template>

<script>
import Header from '@/components/layout/Header.vue'
import Footer from '@/components/layout/Footer.vue'
import { useI18n } from 'vue-i18n'
import { ref } from 'vue'
import { mask } from 'vue-the-mask'
import { reactive } from "@vue/reactivity"
import {
    requiredValidator, nearRootAccountValidator, minLength, maxLength, councilAccountValidator,
    isAlphanumericUpperecase, isNumber, minNumber, maxNumber, sharesValidator, isValid
} from '@/utils/validators'
import { locationList } from '@/composables/location.js'
import { compareByText } from '@/utils/object.js'
import {
    MDBInput, MDBSelect,
    MDBSwitch, MDBBtn,
    MDBStepper, MDBStepperStep, MDBStepperHead, MDBStepperContent,
    MDBRange, MDBAlert
} from 'mdb-vue-ui-kit';
import { MDBWysiwyg } from "mdb-vue-wysiwyg-editor";

export default({
    components: {
        Header, Footer,
        MDBInput, MDBSelect,
        MDBSwitch, MDBBtn,
        MDBStepper, MDBStepperStep, MDBStepperHead, MDBStepperContent,
        MDBRange, MDBAlert, MDBWysiwyg
    },
    directives: {
        mask
    },
    setup() {
        const { t } = useI18n();
        const exampleModal = ref(false)

        const contract = ref(undefined)
        // form feilds
        // basic
        const account = ref('');  // TODO: podilni.near, not dot
        const name = ref('') // nazev dao 3 .. 64,  TODO: unique dao name   ??? also root ???
        const type = ref('corporation')
        const typeOptions = ref([])
        const slogan = ref('') // nazev dao 3 .. 64,  TODO: unique dao name   ??? also root ???
        const description = ref('') // textare max 3000
        const location = ref('')
        const council = [] // at least 1 root account something.near
        const councilString = ref('')
        // tokens
        const ftName = ref('')   // governance token 
        const ftAmount = ref(1_000_000) 
        const ftInitDistribution = ref(10_000) // 0 ... ftAmount
        const ftInsiderShare = ref(100) // 0 ... 100 all shareing 
        const ftFundationShare = ref(0) // 0 ... 100 all shareing 
        const ftCommunityShare = ref(0) // 0 ... 100 all shareing 
        const ftPublicShare = ref(0) // 0 ... 100 all shareing
        // voting 
        const voteSpamThreshold = ref(80) // 0 .. 100 
        const voteDurationDays = ref(0)
        const voteDurationHours = ref(1)
        const voteQuorum = ref(20) // 10 ... 100
        const voteApproveThreshold = ref(51) // 0 .. 100
        const voteOnlyOnce = ref(true)

        const addFtFundationShare = ref(false)
        const addFtCommunityShare = ref(false)
        const addFtPublicShare = ref(false)

        const isValidated = ref({
            account: false,
            name: false,
            type: false,
            slogan: false,
            description: false,
            location: false,
            council: false,
            ftName: false,
            ftAmount: false,
            ftInitDistribution: false,
            ftShares: false,
            voteSpamThreshold: false,
            voteDurationDays: false,
            voteDurationHours: false,
            voteQuorum: false,
            voteApproveThreshold: false,
            voteOnlyOnce: false
        })

        const errors = reactive({})
        const fieldErrorAlert = ref(false);
        const createDaoErrorAlert = ref(false);
        
        return{
           t, exampleModal, account, name, slogan, type, typeOptions,
           description, location, ftName, ftAmount, ftInitDistribution, 
           ftInsiderShare, ftFundationShare, ftCommunityShare,ftPublicShare, 
           voteSpamThreshold, voteDurationDays, voteDurationHours, voteQuorum, 
           voteApproveThreshold, voteOnlyOnce, council, councilString, addFtFundationShare,
           addFtCommunityShare, addFtPublicShare, isValidated, errors, fieldErrorAlert,
           createDaoErrorAlert, contract
        }
    },

    watch: {
        addFtFundationShare(newValue) {
            this.$refs.refFtFundationShare.classList.toggle('invisible')
            if (newValue === false ){
                this.ftFundationShare = 0
            }
            this.validateFtShares()
        },
        addFtCommunityShare(newValue) {
            this.$refs.refFtCommunityShare.classList.toggle('invisible')
            if (newValue === false ){
                this.ftCommunityShare = 0
            }
            this.validateFtShares()
        },
        addFtPublicShare(newValue) {
            this.$refs.refFtPublicShare.classList.toggle('invisible')
            if (newValue === false ){
                this.ftPublicShare = 0
            }
            this.validateFtShares()
        },

        ftFundationShare(){
            this.validateFtShares()
        },
        ftCommunityShare(){
            this.validateFtShares()
        },
        ftPublicShare(){
            this.validateFtShares()
        }
    },
    
    methods:{
        validateAccount(){
            const field = "account"
            const required = requiredValidator(this.account)
            const rootAccount = nearRootAccountValidator(this.account)
            if (required.valid === false) {
                this.errors[field] = this.t('default.' + required.message, required.params)
            } else if (rootAccount.valid === false) {
                this.errors[field] = this.t('default.' + rootAccount.message, rootAccount.params)
            } else {
                this.errors[field] = null
            }
            this.isValidated.account = true
        },

        validateName(){ //TODO
            const field = "name"
            const required = requiredValidator(this.name)
            const minLengthVal = minLength(this.name, 3)
            const maxLengthVal = maxLength(this.name, 64)
            if (required.valid === false) {
                this.errors[field] = this.t('default.' + required.message, required.params)
            } else if (minLengthVal.valid === false) {
                this.errors[field] = this.t('default.' + minLengthVal.message, minLengthVal.params)
            } else if (maxLengthVal.valid === false){
                this.errors[field] = this.t('default.' + maxLengthVal.message, maxLengthVal.params)
            }else {
                this.errors[field] = null
            }
            this.isValidated.name = true
        },

        validateSlogan(){ //TODO
            const field = "slogan"
            const maxLengthVal = maxLength(this.slogan, 100)
            if (maxLengthVal.valid === false){
                this.errors[field] = this.t('default.' + maxLengthVal.message, maxLengthVal.params)
            }else {
                this.errors[field] = null
            }
            this.isValidated.slogan = true
        },

        validateDescription(){
            const field = "description"
            const minLengthVal = minLength(this.description, 1)
            const maxLengthVal = maxLength(this.description, 3000)
            if (minLengthVal.valid === false){
                this.errors[field] = this.t('default.' + minLengthVal.message, minLengthVal.params)
            } else if (maxLengthVal.valid === false){
                this.errors[field] = this.t('default.' + maxLengthVal.message, maxLengthVal.params)
            } else {
                this.errors[field] = null
            }
            this.isValidated.description = true
        },

        validateLocation(){
            const field = "location"
            const minLengthVal = minLength(this.location, 2)
            const maxLengthVal = maxLength(this.location, 3)
            if (minLengthVal.valid === false){
                this.errors[field] = this.t('default.' + minLengthVal.message, minLengthVal.params)
            } else if (maxLengthVal.valid === false){
                this.errors[field] = this.t('default.' + maxLengthVal.message, maxLengthVal.params)
            } else {
                this.errors[field] = null
            }
            this.isValidated.location = true
        },

        validateType(){
            const field = "type"
            const required = requiredValidator(this.type)
            if (required.valid === false){
                this.errors[field] = this.t('default.' + required.message, required.params)
            } else {
                this.errors[field] = null
            }
            this.isValidated.type = true
        },

        validateCouncil(){
            const field = "council"
            const councilArray = this.councilString.split(",").map(s => s.trim())
            let councilAccountVal = true
            councilArray.forEach(council => {
                councilAccountVal = councilAccountValidator(council)
            })
            if (councilAccountVal.valid === false){
                this.errors[field] = this.t('default.' + councilAccountVal.message, councilAccountVal.params)
            }else{
                this.errors[field] = null
            }

            this.isValidated.council = true
            if(!this.errors[field]){
                this.council = this.councilString.split(",").map(s => s.trim())
            }
        },

        validateFtName(){ // TODO
            const field = "ftName"
            const required = requiredValidator(this.ftName)
            const minLengthVal = minLength(this.ftName, 3)
            const maxLengthVal = maxLength(this.ftName, 64)
            const alphaUpper = isAlphanumericUpperecase(this.ftName)
            if (required.valid === false){
                this.errors[field] = this.t('default.' + required.message, required.params)
            }else if( minLengthVal.valid === false){
                this.errors[field] = this.t('default.' + minLengthVal.message, minLengthVal.params)
            }else if( maxLengthVal.valid === false){
                this.errors[field] = this.t('default.' + maxLengthVal.message, maxLengthVal.params)
            }else if(alphaUpper.valid === false){
                this.errors[field] = this.t('default.' + alphaUpper.message, alphaUpper.params)
            }else{
                this.errors[field] = null
            }
            this.isValidated.ftName = true
        },

        validateFtAmount(){
            const field = "ftAmount"
            const requiredVal = requiredValidator(this.ftAmount)
            const isNumberVal = isNumber(this.ftAmount)
            const minNumberVal = minNumber(this.ftAmount, 1.0)
            const maxNumberVal = maxNumber(this.ftAmount, 1_000_000_000.0)
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
            this.validateFtInitDistribution(false)
            this.isValidated.ftAmount = true
        },

        validateFtInitDistribution(isValidated = true){
            const field = "ftInitDistribution"
            const requiredVal = requiredValidator(this.ftInitDistribution)
            const isNumberVal = isNumber(this.ftInitDistribution)
            const minNumberVal = minNumber(this.ftInitDistribution, 1)
            const maxNumberVal = maxNumber(this.ftInitDistribution, this.ftAmount)
            if (isNumberVal.valid === false) {
                this.errors[field] = this.t('default.' + isNumberVal.message, isNumberVal.params)
            }else if (requiredVal.valid === false) {
                this.errors[field] = this.t('default.' + requiredVal.message, requiredVal.params)
            } else if (minNumberVal.valid === false) {
                this.errors[field] = this.t('default.' + minNumberVal.message, minNumberVal.params)
            } else if (maxNumberVal.valid === false) {
                this.errors[field] = this.t('default.' + maxNumberVal.message, maxNumberVal.params)
            } else {
                this.errors[field] = null
            }
            if(isValidated){
                this.isValidated.ftInitDistribution = true
            }
        },

        validateFtShares(){
            const field = "ftShares"
            const maxNumberVal = sharesValidator(this.ftPublicShare + this.ftFundationShare + this.ftCommunityShare)
            if (maxNumberVal.valid === false) {
                this.errors[field] = this.t('default.' + maxNumberVal.message, maxNumberVal.params)
                this.$refs.refFtShares.classList.remove('invisible')
            } else {
                this.errors[field] = null
                this.$refs.refFtShares.classList.add('invisible')
            }
            const sum = this.ftPublicShare + this.ftFundationShare + this.ftCommunityShare
            if (sum > 100){
                this.ftInsiderShare = 0
            }else{
                this.ftInsiderShare = 100 - sum
            }
        },

        validateVoteSpamThreshold(){
            const field = "voteSpamThreshold"
            const requiredVal = requiredValidator(this.voteSpamThreshold)
            const isNumberVal = isNumber(this.voteSpamThreshold)
            const maxNumberVal = maxNumber(this.voteSpamThreshold, 100.0)
            if (isNumberVal.valid === false) {
                this.errors[field] = this.t('default.' + isNumberVal.message, isNumberVal.params)
            }else if (requiredVal.valid === false) {
                this.errors[field] = this.t('default.' + requiredVal.message, requiredVal.params)
            } else if (maxNumberVal.valid === false) {
                this.errors[field] = this.t('default.' + maxNumberVal.message, maxNumberVal.params)
            } else {
                this.errors[field] = null
            }
            this.isValidated.voteSpamThreshold = true
        },

        validateVoteDurationDays(){
            const field = "voteDurationDays"
            const requiredVal = requiredValidator(this.voteDurationDays)
            const isNumberVal = isNumber(this.voteDurationDays)
            if (isNumberVal.valid === false) {
                this.errors[field] = this.t('default.' + isNumberVal.message, isNumberVal.params)
            }else if (requiredVal.valid === false) {
                this.errors[field] = this.t('default.' + requiredVal.message, requiredVal.params)
            } else {
                this.errors[field] = null
            }
            this.isValidated.voteDurationDays = true
        },

        validateVoteDurationHours(){
            const field = "voteDurationHours"
            const requiredVal = requiredValidator(this.voteDurationHours)
            const isNumberVal = isNumber(this.voteDurationHours)
            if (isNumberVal.valid === false) {
                this.errors[field] = this.t('default.' + isNumberVal.message, isNumberVal.params)
            }else if (requiredVal.valid === false) {
                this.errors[field] = this.t('default.' + requiredVal.message, requiredVal.params)
            } else {
                this.errors[field] = null
            }
            this.isValidated.voteDurationHours = true
        },

        validateVoteQuorum(){
            const field = "voteQuorum"
            const requiredVal = requiredValidator(this.voteQuorum)
            const isNumberVal = isNumber(this.voteQuorum)
            const maxNumberVal = maxNumber(this.voteQuorum, 100.0)
            if (isNumberVal.valid === false) {
                this.errors[field] = this.t('default.' + isNumberVal.message, isNumberVal.params)
            }else if (requiredVal.valid === false) {
                this.errors[field] = this.t('default.' + requiredVal.message, requiredVal.params)
            } else if (maxNumberVal.valid === false) {
                this.errors[field] = this.t('default.' + maxNumberVal.message, maxNumberVal.params)
            } else {
                this.errors[field] = null
            }
            this.isValidated.voteQuorum = true 
        },

        validateVoteApproveThreshold(){
            const field = "voteApproveThreshold"
            const requiredVal = requiredValidator(this.voteApproveThreshold)
            const isNumberVal = isNumber(this.voteApproveThreshold)
            const maxNumberVal = maxNumber(this.voteApproveThreshold, 100.0)
            if (isNumberVal.valid === false) {
                this.errors[field] = this.t('default.' + isNumberVal.message, isNumberVal.params)
            }else if (requiredVal.valid === false) {
                this.errors[field] = this.t('default.' + requiredVal.message, requiredVal.params)
            } else if (maxNumberVal.valid === false) {
                this.errors[field] = this.t('default.' + maxNumberVal.message, maxNumberVal.params)
            } else {
                this.errors[field] = null
            }
            this.isValidated.voteApproveThreshold = true
        },

        validate(){
            this.validateAccount()
            this.validateName()
            this.validateSlogan()
            // this.validateDescription()
            this.validateType()
            this.validateLocation()
            this.validateCouncil()
            this.validateFtName()
            this.validateFtAmount()
            this.validateFtInitDistribution()
            this.validateFtShares()
            this.validateVoteSpamThreshold()
            this.validateVoteDurationDays()
            this.validateVoteDurationHours()
            this.validateVoteQuorum()
            this.validateVoteApproveThreshold()
        },

        async createDao(){
            this.validate()
            if (isValid(this.errors) === false) {
                this.fieldErrorAlert = true
            }else{
                const accountId = this.account + '.' + this.factoryAccount
                // set accountId to localStorage because of redirection
                localStorage.create_dao_account = accountId
                // create
                let created = await this.nearService.createDao(
                    this.account
                    , null
                    , this.name
                    , this.description
                    , [this.type]
                    , this.council // founders
                    , this.location // location
                    , this.ftName // ftName
                    , this.ftAmount // ftAmount
                    , this.ftInitDistribution // ftInitDistribution
                    , this.ftInsiderShare // ftInsiderShare
                    , this.ftFundationShare // ftFundationShare
                    , this.ftCommunityShare // ftCommunityShare
                    , this.voteSpamThreshold // voteSpamThreshold
                    , this.voteDurationDays // voteDurationDays
                    , this.voteDurationHours // voteDurationHours
                    , this.voteQuorum // voteQuorum
                    , this.voteApproveThreshold // voteApproveThreshold
                    , this.voteOnlyOnce // voteOnlyOnce
                    , 5 // amountToTransfer
                )

                if(created === true) {
                    null
                } else {
                    this.createDaoErrorAlert = true
                }
            }
        },
    },
    computed: {
        accountId(){
            return this.$store.getters['near/getAccountId']
        },
        isAccountSigned() {
            return this.$store.getters['near/isSignedIn']
        },
        nearService(){
            return this.$store.getters['near/getService']
        },
        factoryContract() {
            return this.$store.getters['near/getFactoryContract']
        },
        factoryAccount() {
            return this.$store.getters['near/getFactoryAccount']
        },
        envContactName() {
            return process.env.VUE_APP_NEAR_CONTRACT_NAME
        },
        locationOptions() {
            return locationList()
        },
        noResults() {
            return this.t('default.no_results')
        },
    },
    created() {
        
    },
    mounted() {
        // redirect after dao created
        if (localStorage.create_dao_account !== undefined && localStorage.create_dao_account !== null && localStorage.create_dao_account.length > 0) {
            const accountId = localStorage.create_dao_account
            localStorage.create_dao_account = ''
            this.$router.push({name: 'dao', params: {id: accountId}})
        }
        this.council = [this.accountId]
        this.councilString = this.accountId
        
        // type loading
        this.nearService.getTags().then((tags) => {
            this.typeOptions = tags.map(tag => { return {text: this.t('default.' + tag), value: tag}}).sort(compareByText)
            this.$refs.refDaoType.setValue('corporation')
        })
        // type select
        //this.$refs.refDaoType.setValue('')
        //console.log(this.type)
    },
})

</script>

