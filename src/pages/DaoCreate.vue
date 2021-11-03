<template>
    <Header></Header>
    <main>
        <MDBContainer>
            <Breadcrumb :list-name="'create_dao'" />
        </MDBContainer>
        <section class="mb-3">
            <div class="container">
                <div class="row">
                    <div class="col-12 text-center">
                    <h2>{{ t('default.create_dao')}} {{ t('default.form')}}</h2>
                    </div>
                </div>
                <div class="card text-start w-auto p-2 mt-4">
                    <div class="card-body">
                <MDBStepper vertical class="text-start pb-4">
                    <MDBStepperStep active>
                        <MDBStepperHead icon="1">
                            {{ t('default.basic') }}
                        </MDBStepperHead>
                        <MDBStepperContent>
                            <div class="row" >
                                <!-- Name -->
                                <div class="col-12 col-md-6">
                                    <label for="dao-name" class="form-label">{{ t('default.dao_name') }}</label>
                                    <MDBInput  wrapperClass="mb-4" id="dao-name" @change="generateAccountId(false)" @keyup="validateName" @blur="validateName" v-model="name" :isValid="!errors.name" :isValidated="isValidated.name" :invalidFeedback="errors.name"/>
                                </div>

                                <!-- Account --> 
                                <div class="col-12 col-md-6">
                                    <label for="dao-account" class="form-label">{{ t('default.account') }}</label>
                                    <MDBInput wrapperClass="mb-4" id="dao-account" @change="validateAccountExists" @keyup="validateAccount" @blur="validateAccountExists" v-model="account" :isValid="!errors.account" :isValidated="isValidated.account" :invalidFeedback="errors.account" inputGroup :formOutline="false" aria-describedby="dao-account">
                                        <span class="input-group-text" id="dao-account">.{{ factoryAccount }}</span>
                                    </MDBInput>
                                </div>

                                <!-- Purpose -->
                                <div class="col-12 col-md-8">
                                    <label for="dao-slogan" class="form-label">{{ t('default.purpose_short') }}</label>
                                    <MDBInput wrapperClass="mb-4" id="dao-slogan" @keyup="validateSlogan" @blur="validateSlogan" v-model="slogan" :isValid="!errors.slogan" :isValidated="isValidated.slogan" :invalidFeedback="errors.slogan"/>
                                </div>

                                <!-- Type -->
                                <div class="col-12 col-md-6  mb-4">
                                    <label for="dao-type" class="form-label">{{ t('default.type') }}</label>
                                    <MDBSelect filter ref="refDaoType" :preselect="true" v-model:selected="type" v-model:options="typeOptions" :no-results-text="noResults" wrapperClass="mb-4" id="dao-type" @keyup="validateType" @blur="validateType" :isValid="!errors.type" :isValidated="isValidated.type" :invalidFeedback="errors.type"/>
                                </div>
                            </div>
                        
                        </MDBStepperContent>
                    </MDBStepperStep>

                    <MDBStepperStep>
                        <MDBStepperHead icon="2">
                            {{ t('default.founders') }}
                        </MDBStepperHead>
                        <MDBStepperContent>
                            <div class="row" >
                                 <!-- Councils -->
                                <div class="col-12 col-md-6 mb-3">
                                    <div>
                                        <label for="dao-council" class="form-label">{{ t('default.dao_council') }}</label>
                                        <FromErrorMessage :show="errors.council !== null" :message="errors.council"/>
                                    </div>
                                    
                                    <MDBInput inputGroup v-model="councilAdd" :isValid="!errors.councilAdd" :isValidated="isValidated.councilAdd" :invalidFeedback="errors.councilAdd" wrapperClass="mb-1">
                                        <MDBBtn @click="addCouncil()" id="dao-council-add" color="primary">{{ t('default.add') }}</MDBBtn>
                                    </MDBInput>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-12 col-md-7 mb-4">
                                    <MDBBtn v-for="(c, i) in council" :key="i" @click="removeCouncil(c)" color="primary" size="sm">
                                        {{c}}<span class="ms-2"><MDBIcon icon="times" size="sm"/></span>
                                    </MDBBtn>
                                </div>
                            </div>
                        </MDBStepperContent>
                    </MDBStepperStep>

                    <MDBStepperStep>
                        <MDBStepperHead icon="3">
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
                                    <MDBInput wrapperClass="mb-4" id="dao-ft-amount" @input="changeFtAmount" @keyup="validateFtAmount" @blur="validateFtAmount"  :model-value="ftAmountInit" :isValid="!errors.ftAmount" :isValidated="isValidated.ftAmount" :invalidFeedback="errors.ftAmount"/>
                                </div>
                             </div>

                            <!-- ftInitDistribution -->
                            <div class = "row">
                                <div class="col-md-6">
                                    <label for="dao-ft-init-distribution" class="form-label">{{ t('default.dao_ft_init_distribution') }}</label>
                                    <MDBInput wrapperClass="mb-4" id="dao-ft-init-distribution" @input="changeftInitDistribution" @keyup="validateFtInitDistribution" @blur="validateFtInitDistribution"  :model-value="ftInitDistributionInit" :isValid="!errors.ftInitDistribution" :isValidated="isValidated.ftInitDistribution" :invalidFeedback="errors.ftInitDistribution"/>
                                </div>
                            </div>

                            <!-- error message for shares -->
                            <div ref="refFtShares" class="col text-danger invisible" >{{t('default.validator_shares_sum')}}</div>

                            <h6>{{ t('default.allocation')}}</h6>
                            <!-- ftCouncilShare -->
                            <div class="row mb-4">
                                <div class="col-md-7 col-8">
                                    <MDBProgress :height="20" class="rounded">
                                        <MDBProgressBar :value="ftCouncilShare" >{{ ftCouncilShare }}%</MDBProgressBar>
                                        <MDBProgressBar :value="ftCommunityShare" bg="info" >{{ ftCommunityShare }}%</MDBProgressBar>
                                        <MDBProgressBar :value="ftFundationShare" bg="success" >{{ ftFundationShare }}%</MDBProgressBar>
                                        <MDBProgressBar :value="ftPublicShare" bg="warning" >{{ ftPublicShare }}%</MDBProgressBar>
                                    </MDBProgress>
                                </div>
                            </div>

                            <label for="dao-ft-council-share" class="form-label"><MDBBadge color="primary" class="me-2">&nbsp;</MDBBadge>{{ t('default.add_ft_council_share') }}</label>
                            <br>
                            <!-- ftCommunityShare -->
                            <MDBSwitch v-if="false" :label="t('default.add_ft_community_share')" v-model="addFtCommunityShare"/>
                            <label for="dao-ft-community-share" class="form-label"><MDBBadge color="info" class="me-2">&nbsp;</MDBBadge>{{ t('default.add_ft_community_share') }}</label>
                            <div ref="refFtCommunityShare" class="row mt-1 mb-4">
                                <MDBRange :disabled="false" wrapperClass="col-md-6 col-9"  v-model="ftCommunityShare" :min="0" :max="100" /> <!-- not @onChange, but watcher is set to ftCommunityShare -->
                                <label class="form-label col-md-6 col-3">{{ ftCommunityShare }}%</label>
                            </div>
                        
                            <!-- ftFundationShare -->
                            <MDBSwitch v-if="false" :label="t('default.add_ft_fundation_share')" v-model="addFtFundationShare"/>
                            <label for="dao-ft-fundation-share" class="form-label"><MDBBadge color="success" class="me-2">&nbsp;</MDBBadge>{{ t('default.add_ft_fundation_share') }}</label>
                            <div ref="refFtFundationShare" class="row mt-1 mb-4">
                                <MDBRange :disabled="false" wrapperClass="col-md-6 col-9" v-model="ftFundationShare" :min="0" :max="100" /> <!-- not @onChange, but watcher is set to ftFundationShare -->
                                <label class="form-label col-md-6 col-3">{{ ftFundationShare }}%</label>
                            </div>

                            <!-- ftPublicShare -->
                            <MDBSwitch v-if="false" :label="t('default.add_ft_public_share')" v-model="addFtPublicShare"/>
                            <label for="dao-ft-public-share" class="form-label"><MDBBadge color="warning" class="me-2">&nbsp;</MDBBadge>{{ t('default.add_ft_public_share') }}</label>
                            <div ref="refFtPublicShare" class="row mt-1 mb-4">
                                <MDBRange :disabled="false" wrapperClass="col-md-6 col-9" v-model="ftPublicShare" :min="0" :max="100" /> <!-- not @onChange, but watcher is set to ftPublicShare -->
                                <label class="form-label col-md-6 col-3">{{ ftPublicShare }}%</label> 
                            </div>

                        </MDBStepperContent>
                    </MDBStepperStep>
                    <MDBStepperStep>
                        <MDBStepperHead icon="4">
                            {{ t('default.voting') }}
                        </MDBStepperHead>
                            <MDBStepperContent>

                                <!-- voteApproveThreshold -->
                                <label class="form-label col-md-6 col-3">
                                    {{ t('default.dao_vote_approve_threshold') }}
                                    <MDBTooltip v-model="tooltipApproveThreshold" >
                                        <template #reference>
                                            <MDBIcon icon="question-circle" iconStyle="far" />
                                        </template>
                                        <template #tip>
                                            Hi! I'm tooltip
                                        </template>
                                    </MDBTooltip>
                                </label>
                                <div class="row mb-4">
                                    <MDBRange wrapperClass="col-md-6 col-9" v-model="voteApproveThreshold" :min="1" :max="100" />
                                    <label class="form-label col-md-6 col-3">{{ voteApproveThreshold }}%</label>
                                </div>

                                <!-- voteQuorum -->
                                <label class="form-label col-md-6 col-3">
                                    {{ t('default.dao_vote_quorum') }}
                                    <MDBTooltip v-model="tooltipQuorum" >
                                        <template #reference>
                                            <MDBIcon icon="question-circle" iconStyle="far" />
                                        </template>
                                        <template #tip>
                                            Hi! I'm tooltip
                                        </template>
                                    </MDBTooltip>
                                </label>
                                <div class="row mb-4">
                                    <MDBRange wrapperClass="col-md-6 col-9" v-model="voteQuorum" :min="1" :max="100" />
                                    <label class="form-label col-md-6 col-3">{{ voteQuorum }}%</label>
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

                            </MDBStepperContent>
                        </MDBStepperStep>
                        
                        <MDBStepperStep>
                            <MDBStepperHead icon="5">
                                {{ t('default.summary') }}
                            </MDBStepperHead>
                                <MDBStepperContent>
                                    <div class="row">
                                        <div class="col-md-6">
                                            <h4>{{ t('default.basic') }}</h4>
                                            <hr>
                                            <dl class="row">
                                                <dt class="col-6 col-md-6 ps-3">{{t('default.dao_name')}}:</dt>
                                                <dd v-if="name" class="col-6 col-md-6">{{name}} </dd>
                                                <dd v-else class="col-6 col-md-6"><span class="text-danger">{{t('default.empty')}}</span> </dd>

                                                <dt class="col-6 col-md-6 ps-3">{{t('default.account')}}:</dt>
                                                <dd v-if="account" class="col-6 col-md-6">{{account}} </dd>
                                                <dd v-else class="col-6 col-md-6"><span class="text-danger">{{t('default.empty')}}</span> </dd>

                                                <dt class="col-6 col-md-6 ps-3">{{ t('default.purpose_short') }}:</dt>
                                                <dd v-if="slogan" class="col-6 col-md-6">{{slogan}}</dd>
                                                <dd v-else class="col-6 col-md-6"><span class="text-danger">{{t('default.empty')}}</span> </dd>

                                                <dt class="col-6 col-md-6 ps-3">{{ t('default.type') }}:</dt>
                                                <dd v-if="type" class="col-6 col-md-6">{{ t('default.' + type) }} </dd>
                                                <dd v-else class="col-6 col-md-6"><span class="text-danger">{{t('default.empty')}}</span> </dd>
                                            </dl>
                                        </div> 
                                    

                                        <div class="col-md-6">
                                            <h4>{{ t('default.founding') }}</h4>
                                            <hr>
                                            <dl class="row">
                                                <dt class="col-6 col-md-6 ps-3">{{t('default.dao_council')}}:</dt>
                                                <dd v-if="council.length !== 0" class="col-6 col-md-6">{{council.join(', ')}} </dd>
                                                <dd v-else class="col-6 col-md-6"><span class="text-danger">{{t('default.empty')}}</span> </dd>
                                            </dl>                                        
                                        </div>
                                    </div>

                                    <div class="row">
                                        <div class="col-md-6">
                                            <h4>{{ t('default.tokens') }}</h4>
                                            <hr>
                                            <dl class="row">
                                                <dt class="col-6 col-md-6 ps-3">{{t('default.dao_ft_name')}}:</dt>
                                                <dd v-if="ftName" class="col-6 col-md-6">{{ftName}} </dd>
                                                <dd v-else class="col-6 col-md-6"><span class="text-danger">{{t('default.empty')}}</span> </dd>

                                                <dt class="col-6 col-md-6 ps-3">{{t('default.amount')}}:</dt>
                                                <dd class="col-6 col-md-6">{{ n(ftAmount) }}</dd>

                                                <dt class="col-6 col-md-6 ps-3">{{ t('default.dao_ft_init_distribution') }}:</dt>
                                                <dd class="col-6 col-md-6">{{ n(ftInitDistribution) }}</dd>

                                                <dt class="col-6 col-md-6 ps-3">{{ t('default.dao_council') }}:</dt>
                                                <dd class="col-6 col-md-6">{{ftCouncilShare}}%</dd>

                                                <dt class="col-6 col-md-6 ps-3">{{ t('default.fundation') }}:</dt>
                                                <dd class="col-6 col-md-6">{{ftFundationShare}}%</dd>

                                                <dt class="col-6 col-md-6 ps-3">{{ t('default.community_programs') }}:</dt>
                                                <dd class="col-6 col-md-6">{{ftCommunityShare}}%</dd>

                                                <dt class="col-6 col-md-6 ps-3">{{ t('default.public_token') }}:</dt>
                                                <dd class="col-6 col-md-6">{{ftPublicShare}}%</dd>
                                            </dl>
                                        </div>

                                        <div class="col-md-6">
                                            <h4>{{ t('default.voting') }}</h4>
                                            <hr>
                                            <dl class="row">
                                                <dt class="col-6 col-md-6 ps-3">{{t('default.dao_vote_approve_threshold')}}:</dt>
                                                <dd class="col-6 col-md-6">{{voteApproveThreshold}}%</dd>

                                                <dt class="col-6 col-md-6 ps-3">{{t('default.dao_vote_quorum')}}:</dt>
                                                <dd class="col-6 col-md-6">{{voteQuorum}}%</dd>

                                                <dt class="col-6 col-md-6 ps-3">{{ t('default.dao_vote_duration_days') }}:</dt>
                                                <dd class="col-6 col-md-6">{{voteDurationDays}}</dd>

                                                <dt class="col-6 col-md-6 ps-3">{{ t('default.dao_vote_duration_hours') }}:</dt>
                                                <dd class="col-6 col-md-6">{{voteDurationHours}}</dd>
                                            </dl>      

                                                                  
                                        </div>
                                    </div>

                                    <MDBBtn wrapperClass="mt-10 mb-2" @click="createDao()" color="primary">{{ t('default.create_dao') }}</MDBBtn>

                                </MDBStepperContent>
                        </MDBStepperStep>
                </MDBStepper>
                    </div>
                </div>
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
import Breadcrumb from '@/components/daoCreate/Breadcrumb.vue'
import FromErrorMessage from '@/components/FormErrorMessage.vue'
import { useI18n } from 'vue-i18n'
import { ref } from 'vue'
import { mask } from 'vue-the-mask'
import { reactive } from "@vue/reactivity"
import _ from "lodash"
import {
    requiredValidator, nearRootAccountValidator, nearAccountExistsValidator, minLength, maxLength,
    isAlphanumericUpperecase, isNumber, minNumber, maxNumber, sharesValidator, isValid, requiredArrayValidator
} from '@/utils/validators'
import { locationList } from '@/composables/location'
import { compareByText } from '@/utils/object'
import {
    MDBContainer,
    MDBInput, MDBSelect,
    MDBSwitch, MDBBtn,
    MDBStepper, MDBStepperStep, MDBStepperHead, MDBStepperContent,
    MDBRange, MDBAlert, MDBIcon , MDBTooltip,
    MDBProgress, MDBProgressBar, MDBBadge //MDBTable
} from 'mdb-vue-ui-kit';

export default({
    components: {
        Header, Footer,
        MDBContainer, Breadcrumb,
        MDBInput, MDBSelect,
        MDBSwitch, MDBBtn,
        MDBStepper, MDBStepperStep, MDBStepperHead, MDBStepperContent,
        MDBRange, MDBAlert, MDBIcon, MDBTooltip,
        MDBProgress, MDBProgressBar, MDBBadge, //MDBTable
        FromErrorMessage
    },
    directives: {
        mask
    },
    setup() {
        const { t, n } = useI18n();
        const exampleModal = ref(false)

        const contract = ref(undefined)
        // form feilds
        // basic
        const account = ref('');  // TODO: podilni.near, not dot
        const name = ref('') // nazev dao 3 .. 64,  TODO: unique dao name   ??? also root ???
        const type = ref('corporation')
        const typeOptions = ref([])
        const slogan = ref('') // nazev dao 3 .. 64,  TODO: unique dao name   ??? also root ???
        const purpose = ref('') // textare max 3000
        //const location = ref('')
        const location = ref('glo')
        const council = ref([]) // at least 1 root account something.near
        const councilAdd = ref('')
        // tokens
        const ftName = ref('')   // governance token
        const ftAmount = ref(1_000_000) 
        const ftAmountInit = ref(n(1_000_000)) 
        const ftInitDistribution = ref(100_000) // 0 ... ftAmount 10%
        const ftInitDistributionInit = ref(n(100_000))
        const ftCouncilShare = ref(100) // 0 ... 100 all shareing 
        const ftFundationShare = ref(0) // 0 ... 100 all shareing 
        const ftCommunityShare = ref(0) // 0 ... 100 all shareing 
        const ftPublicShare = ref(0) // 0 ... 100 all shareing
        // voting 
        const voteSpamThreshold = ref(80) // 0 .. 100 
        const voteDurationDays = ref(3)
        const voteDurationHours = ref(0)
        const voteQuorum = ref(20) // 10 ... 100
        const voteApproveThreshold = ref(51) // 0 .. 100
        const voteOnlyOnce = ref(true)

        const nearTags = reactive([])

        const addFtFundationShare = ref(false)
        const addFtCommunityShare = ref(false)
        const addFtPublicShare = ref(false)

        const isValidated = ref({
            account: false,
            name: false,
            type: false,
            slogan: false,
            purpose: false,
            location: false,
            council: false,
            councilAdd: false,
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

        const errors = reactive({
            council: null
        })
        const fieldErrorAlert = ref(false);
        const createDaoErrorAlert = ref(false);

        const tooltipApproveThreshold = ref(false);
        const tooltipQuorum = ref(false);

        const defaultTypeOptions = [
            [n(1_000_000), 1_000_000,  n(100_000), 100_000, 51, 20, 3, 0],
            [n(2_000_000), 2_000_000, n(300_000), 300_000, 5, 20, 3, 0],
            [n(4_000_000), 4_000_000, n(500_000), 500_000, 1, 20, 3, 0],
            [n(6_000_000), 6_000_000, n(700_000), 700_000, 517, 20, 3, 0],
            [n(8_000_000), 8_000_000, n(900_000), 900_000, 45, 20, 3, 0],
            [n(45_000_000), 45_000_000, n(5_600_000), 5_600_000, 46, 20, 3, 0],
        ]
        
        return{
           t, n, exampleModal, account, name, slogan, type, typeOptions,
           purpose, location, ftName, ftAmount, ftAmountInit, ftInitDistribution, ftInitDistributionInit,
           ftCouncilShare, ftFundationShare, ftCommunityShare,ftPublicShare, 
           voteSpamThreshold, voteDurationDays, voteDurationHours, voteQuorum, 
           voteApproveThreshold, voteOnlyOnce, council, councilAdd, addFtFundationShare,
           addFtCommunityShare, addFtPublicShare, isValidated, errors, fieldErrorAlert,
           createDaoErrorAlert, contract, nearTags, tooltipApproveThreshold, tooltipQuorum, defaultTypeOptions
        }
    },

    watch: {
        addFtFundationShare(newValue) {
            //this.$refs.refFtFundationShare.classList.toggle('invisible')
            if (newValue === false ){
                this.ftFundationShare = 0
            }
            this.validateFtShares()
        },
        addFtCommunityShare(newValue) {
            //this.$refs.refFtCommunityShare.classList.toggle('invisible')
            if (newValue === false ){
                this.ftCommunityShare = 0
            }
            this.validateFtShares()
        },
        addFtPublicShare(newValue) {
            //this.$refs.refFtPublicShare.classList.toggle('invisible')
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
        },

        type(){
            const newType = this.typeOptions.find( type => type.selected === true )
            if(newType !== undefined){
                [this.ftAmountInit, this.ftAmount, this.ftInitDistributionInit, this.ftInitDistribution, this.voteApproveThreshold, this.voteQuorum, this.voteDurationDays, this.voteDurationHours] = [...this.defaultTypeOptions[newType.mdbKey]]
            }
            
        }
    },
    
    methods:{
        generateAccountId(overwrite) {
            console.log('Generation account id')
            if (overwrite || this.account === '') {
                console.log(this.account)
                if (this.name.length > 0) {
                    this.account = _.deburr(_.toLower(_.replace(this.name, ' ', '')))
                    this.validateAccountExists()
                }
            }
        },

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
    
        async validateAccountExists(){
            const field = "account"
            this.account = this.account.trim()
            this.errors[field] = this.t('default.validating')
            this.nearService.getAccountState(this.account + '.' + this.factoryAccount)
                .then(accountState => {
                    const existsAccount = nearAccountExistsValidator(accountState)
                    if (existsAccount.valid === false) {
                        this.errors[field] = this.t('default.' + existsAccount.message, existsAccount.params)
                    } else {
                        this.validateAccount()
                    }
                })
                .catch(() => {
                    this.validateAccount()
                })
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

        validateSlogan(){
            const field = "slogan"
            const maxLengthVal = maxLength(this.slogan, 160)
            if (maxLengthVal.valid === false){
                this.errors[field] = this.t('default.' + maxLengthVal.message, maxLengthVal.params)
            }else {
                this.errors[field] = null
            }
            this.isValidated.slogan = true
        },

        validatePurpose(){
            const field = "purpose"
            const minLengthVal = minLength(this.purpose, 1)
            const maxLengthVal = maxLength(this.purpose, 100000)
            if (minLengthVal.valid === false){
                this.errors[field] = this.t('default.' + minLengthVal.message, minLengthVal.params)
            } else if (maxLengthVal.valid === false){
                this.errors[field] = this.t('default.' + maxLengthVal.message, maxLengthVal.params)
            } else {
                this.errors[field] = null
            }
            this.isValidated.purpose = true
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
            const requiredVal = requiredArrayValidator(this.council)

            if (requiredVal.valid === false){
                this.errors[field] = this.t('default.' + requiredVal.message, requiredVal.params)
            } else{
                this.errors[field] = null
            }

            this.isValidated.council = true
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

        changeFtAmount(event){
            event.target.value = this.n(+event.target.value.replace(/[^0-9]/g,''))
            this.ftAmount = +event.target.value.replace(/[^0-9]/g,'')
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

        changeftInitDistribution(event){
            event.target.value = this.n(+event.target.value.replace(/[^0-9]/g,''))
            this.ftInitDistribution = +event.target.value.replace(/[^0-9]/g,'')
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
                this.ftCouncilShare = 0
            }else{
                this.ftCouncilShare = 100 - sum
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
            //this.validateAccountExists()
            this.validateName()
            this.validateSlogan()
            // this.validatePurpose()
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

        addCouncil() {
            const field = "councilAdd"
            this.councilAdd = this.councilAdd.trim()
            
            this.errors[field] = this.t('default.validating')
            this.nearService.getAccountState(this.councilAdd)
                .then(() => {
                    this.council.push(this.councilAdd);
                    this.councilAdd = ''
                    this.errors[field] = null
                    this.validateCouncil()
                })
                .catch(() => {
                    this.errors[field] = this.t('default.validator_near_account_not_found')
                })
            this.isValidated.councilAdd = true
        },

        removeCouncil(removedCouncil){
            this.council = this.council.filter((el) => el !== removedCouncil )
            this.validateCouncil()
        },

        async createDao(){
            this.validate()
            if (isValid(this.errors) === false) {
                console.log(this.errors)
                this.fieldErrorAlert = true
            }else{
                const accountId = this.account + '.' + this.factoryAccount
                // set accountId to localStorage because of redirection
                localStorage.create_dao_account = accountId
                localStorage.purpose = this.purpose

                //create
                let created = await this.nearService.createDao(
                    this.account
                    , null
                    , this.name
                    , this.slogan
                    , [this.nearTags.value.indexOf(this.type)] // tags
                    , [...this.council] // founders
                    , this.location // location
                    , this.ftName // ftName
                    , this.ftAmount // ftAmount
                    , this.ftInitDistribution // ftInitDistribution
                    , this.ftCouncilShare // ftCouncilShare
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
                    this.$log.error('B', 'DAO', 'DAO could not be created', `User [${this.accountId}] could not create dao [${this.name}]`)
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
        Account(){
            console.log(this.account)
            return this.account
        }

    },
    created() {
        
    },
    mounted() {
        // redirect after dao created
        if (localStorage.create_dao_account !== undefined && localStorage.create_dao_account !== null && localStorage.create_dao_account.length > 0) {
            const accountId = localStorage.create_dao_account
            localStorage.create_dao_account = ''
            this.$logger.notice('B', 'dao', 'create', `User [${this.accountId}] created DAO named [${accountId}]`)
            this.$router.push({name: 'dao', params: {id: accountId}})
        }
        this.council = [this.accountId]
        
        // type loading
        this.nearService.getTags().then((tags) => {
            this.nearTags.value = tags
            this.typeOptions = tags.map(tag => { return {text: this.t('default.' + tag), value: tag}}).sort(compareByText)
            // this.$refs.refDaoType.setValue('corporation')
        })
        // type select
        //this.$refs.refDaoType.setValue('')
        //console.log(this.type)
    },
})

</script>