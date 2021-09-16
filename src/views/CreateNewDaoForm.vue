<template>
    <Header></Header>
    <main>
        <section class="bg-white shadow-2 mb-3">
            <div class="container">


                <MDBStepper vertical class="text-start">
                    <MDBStepperStep active>
                        <MDBStepperHead icon="1">
                            {{ t('default.basic_information') }}
                        </MDBStepperHead>
                        <MDBStepperContent>
                            <!-- Account -->
                            <label for="dao-account" class="form-label">{{ t('default.account') }}</label>
                            <MDBInput wrapperClass="mb-3" id="dao-account" @keyup="validateAccount" @blur="validateAccount" v-model="account" :isValid="!errors.account" :isValidated="isValidated.account" :invalidFeedback="errors.account" inputGroup :formOutline="false" aria-describedby="dao-account" :data-mdb-showcounter="true">
                                <span class="input-group-text" id="dao-account">.{{ envContactName }}.near</span>
                            </MDBInput>

                            <!-- Name -->
                            <label for="dao-name" class="form-label">{{ t('default.dao_name') }}</label>
                            <MDBInput  class="mb-3" id="dao-name" @keyup="validateName" @blur="validateName" v-model="name" :isValid="!errors.name" :isValidated="isValidated.name" :invalidFeedback="errors.name"/>

                            <!-- Description -->
                            <label for="dao-description" class="form-label">{{ t('default.dao_description') }}</label>
                            <MDBTextarea class="mb-3" id="dao-description" @keyup="validateDescription" @blur="validateDescription" v-model="description" :isValid="!errors.description" :isValidated="isValidated.description" :invalidFeedback="errors.description"  rows="4" />
                            
                            <!-- Councils -->
                            <label for="dao-council" class="form-label">{{ t('default.dao_council') }}</label>
                            <MDBInput id="dao-council" @keyup="validateCouncil" @blur="validateCouncil" v-model="councilString" :isValid="!errors.council" :isValidated="isValidated.council" :invalidFeedback="errors.council"  rows="2" wrapperClass="mb-5" />
                        
                        </MDBStepperContent>
                    </MDBStepperStep>
                    <MDBStepperStep>
                        <MDBStepperHead icon="2">
                            {{ t('default.tokens') }}
                        </MDBStepperHead>
                        <MDBStepperContent>

                            <!-- ftName -->
                            <label for="dao-ft-name" class="form-label">{{ t('default.dao_ft_name') }}</label>
                            <MDBInput class="mb-3"  id="dao-ft-name" @keyup="validateFtName" @blur="validateFtName" v-model="ftName" :isValid="!errors.ftName" :isValidated="isValidated.ftName" :invalidFeedback="errors.ftName"/>

                            <!-- ftAmount -->
                            <label for="dao-ft-amount" class="form-label">{{ t('default.amount') }}</label>
                            <MDBInput class="mb-3" id="dao-ft-amount" @keyup="validateFtAmount" @blur="validateFtAmount"  v-model.number="ftAmount" :isValid="!errors.ftAmount" :isValidated="isValidated.ftAmount" :invalidFeedback="errors.ftAmount" type="number"/>

                            <!-- ftInsiderInitDistribution -->
                            <label for="dao-ft-insider-init-distribution" class="form-label">{{ t('default.dao_ft_insider_init_distribution') }}</label>
                            <MDBInput class="mb-3" id="dao-ft-insider-init-distribution" @keyup="validateFtIIDistribution" @blur="validateFtIIDistribution"  v-model.number="ftInsiderInitDistribution" :isValid="!errors.ftIIDistribution" :isValidated="isValidated.ftIIDistribution" :invalidFeedback="errors.ftIIDistribution" type="number"/>



    

                            <!-- ftInsiderShare -->
                            <div class="row">
                                <MDBRange wrapperClass="col-md-6" :label="t('default.dao_ft_insider_share')" v-model="ftInsiderShare" disabled :min="0" :max="100" />
                                <label class="form-label col-md-6">{{ ftInsiderShare }}%</label>
                            </div>

                            <!-- ftFundationShare -->
                            <MDBBtn class="mt-3" @click="createDao()" color="primary">{{ t('default.create_dao') }}</MDBBtn>
                            <div class="row">
                                <MDBRange wrapperClass="col-md-6" :label="t('default.dao_ft_fundation_share')" v-model="ftFundationShare" :min="0" :max="100" />
                                <label class="form-label col-md-6">{{ ftFundationShare }}%</label>
                            </div>
                            <!-- ftCommunityShare -->
                            <MDBBtn class="mt-3" @click="createDao()" color="primary">{{ t('default.create_dao') }}</MDBBtn>
                            <div class="row">
                                <MDBRange wrapperClass="col-md-6" :label="t('default.dao_ft_community_share')" v-model="ftCommunityShare" :min="0" :max="100" />
                                <label class="form-label col-md-6">{{ ftCommunityShare }}%</label>
                            </div>
                            <!-- ftPublicShare -->
                            <MDBBtn class="mt-3" @click="createDao()" color="primary">{{ t('default.create_dao') }}</MDBBtn>
                            <div class="row">
                                <MDBRange wrapperClass="col-md-6" :label="t('default.dao_ft_public_share')" v-model="ftPublicShare" :min="0" :max="100" />
                                <label class="form-label col-md-6">{{ ftPublicShare }}%</label>
                            
                            </div>
                             <!-- ftInsiderShare
                            <label for="ft-insider-share" class="form-label">{{ t('default.dao_ft_insider_share') }}</label>
                            <MDBInput class="mb-3" id="ft-insider-share" @keyup="validateFfShares('ftInsiderShare', $event)" @blur="validateFfShares('ftInsiderShare', $event)"  v-model.number="ftInsiderShare" :isValid="!errors.ftInsiderShare" :isValidated="isValidated.ftInsiderShare" :invalidFeedback="errors.ftInsiderShare" type="number"/>

                            ftFundationShare 
                            <label for="ft-fundation-share" class="form-label">{{ t('default.dao_ft_fundation_share') }}</label>
                            <MDBInput class="mb-3" id="ft-fundation-share" @keyup="validateFfShares('ftFundationShare', $event)" @blur="validateFfShares('ftFundationShare', $event)"  v-model.number="ftFundationShare" :isValid="!errors.ftFundationShare" :isValidated="isValidated.ftFundationShare" :invalidFeedback="errors.ftFundationShare" type="number"/>

                            ftCommunityShare 
                            <label for="ft-community-share" class="form-label">{{ t('default.dao_ft_community_share') }}</label>
                            <MDBInput class="mb-3" id="ft-community-share" @keyup="validateFfShares('ftCommunityShare', $event)" @blur="validateFfShares('ftCommunityShare', $event)"  v-model.number="ftCommunityShare" :isValid="!errors.ftCommunityShare" :isValidated="isValidated.ftCommunityShare" :invalidFeedback="errors.ftCommunityShare" type="number"/>

                            ftPublicShare 
                            <label for="ft-public-share" class="form-label">{{ t('default.dao_ft_public_share') }}</label>
                            <MDBInput id="ft-public-share" @keyup="validateFfShares('ftPublicShare', $event)" @blur="validateFfShares('ftPublicShare', $event)"  v-model.number="ftPublicShare" :isValid="!errors.ftPublicShare" :isValidated="isValidated.ftPublicShare" :invalidFeedback="errors.ftPublicShare" type="number" wrapperClass="mb-8"/>
                            -->

                        </MDBStepperContent>
                    </MDBStepperStep>
                    <MDBStepperStep>
                        <MDBStepperHead icon="3">
                            {{ t('default.voting') }}
                        </MDBStepperHead>
                            <MDBStepperContent>

                                <!-- voteQuorum -->
                                <label for="dao-vote-quorum" class="form-label">{{ t('default.dao_vote_quorum') }}</label>
                                <MDBInput class="mb-3" id="dao-vote-quorum" @keyup="validateVoteQuorum" @blur="validateVoteQuorum"  v-model.number="voteQuorum" :isValid="!errors.voteQuorum" :isValidated="isValidated.voteQuorum" :invalidFeedback="errors.voteQuorum" type="number"/>

                                <!-- voteApproveThreshold -->
                                <label for="dao-vote-approve-threshold" class="form-label">{{ t('default.dao_vote_approve_threshold') }}</label>
                                <MDBInput class="mb-3" id="dao-vote-approve-threshold" @keyup="validateVoteApproveThreshold" @blur="validateVoteApproveThreshold"  v-model.number="voteApproveThreshold" :isValid="!errors.voteApproveThreshold" :isValidated="isValidated.voteApproveThreshold" :invalidFeedback="errors.voteApproveThreshold" type="number"/>

                                <!-- voteDurationDays -->
                                <label for="dao-vote-duration-days" class="form-label">{{ t('default.dao_vote_duration_days') }}</label>
                                <MDBInput class="mb-3" id="dao-vote-duration-days" @keyup="validateVoteDurationDays" @blur="validateVoteDurationDays"  v-model.number="voteDurationDays" :isValid="!errors.voteDurationDays" :isValidated="isValidated.voteDurationDays" :invalidFeedback="errors.voteDurationDays" type="number"/>

                                <!-- voteDurationHours -->
                                <label for="dao-vote-duration-hours" class="form-label">{{ t('default.dao_vote_duration_hours') }}</label>
                                <MDBInput class="mb-3" id="dao-vote-duration-hours" @keyup="validateVoteDurationHours" @blur="validateVoteDurationHours"  v-model.number="voteDurationHours" :isValid="!errors.voteDurationHours" :isValidated="isValidated.voteDurationHours" :invalidFeedback="errors.voteDurationHours" type="number"/>

                                <!-- voteSpamThreshold -->
                                <label for="dao-vote-spam-threshold" class="form-label">{{ t('default.dao_vote_spam_threshold') }}</label>
                                <MDBInput class="mb-3" id="dao-vote-spam-threshold" @keyup="validateVoteSpamThreshold" @blur="validateVoteSpamThreshold"  v-model.number="voteSpamThreshold" :isValid="!errors.voteSpamThreshold" :isValidated="isValidated.voteSpamThreshold" :invalidFeedback="errors.voteSpamThreshold" type="number"/>

                                <!-- voteOnlyOnce-->
                                <MDBSwitch :label="t('default.dao_vote_only_once')" v-model="voteOnlyOnce"/>

                                <MDBBtn class="mt-3" @click="createDao()" color="primary">{{ t('default.create_dao') }}</MDBBtn>
                            </MDBStepperContent>
                        </MDBStepperStep>
                </MDBStepper>
            </div>
        </section>
    </main>

  <Footer></Footer>
</template>



<script>
    import Header from '@/views/layout/Header.vue'
    import Footer from '@/views/layout/Footer.vue'
    import { useI18n } from 'vue-i18n';
    import { ref } from 'vue';
    import createDaoFormValidation from "@/createDaoFormValidation";
    import {
        MDBInput, MDBTextarea,
        MDBSwitch, MDBBtn,
        MDBStepper, MDBStepperStep, MDBStepperHead, MDBStepperContent,
        MDBRange
    } from 'mdb-vue-ui-kit';

    import * as nearAPI from "near-api-js"

export default({

    components: {
        Header, Footer,
        MDBInput, MDBTextarea,
        MDBSwitch, MDBBtn,
        MDBStepper, MDBStepperStep, MDBStepperHead, MDBStepperContent,
        MDBRange
    },

    setup() {
        const { t } = useI18n();
        const exampleModal = ref(false)

        const contract = ref(undefined)
        
        // form feilds
        // basic        
        const account = ref('');  // TODO: podilni.near, not dot
        const name = ref('') // nazev dao 3 .. 64,  TODO: unique dao name   ??? also root ???
        const description = ref('') // textare max 3000
        const council = [] // at least 1 root account something.near
        const councilString = ref('')
        
        // tokens
        const ftName = ref('')   // governance token 
        const ftAmount = ref(1_000_000) 
        const ftInsiderInitDistribution = ref(0) // 0 ... ftAmount
        const ftInsiderShare = ref(100) // 0 ... 100 all shareing 
        const ftFundationShare = ref(0) // 0 ... 100 all shareing 
        const ftCommunityShare = ref(0) // 0 ... 100 all shareing 
        const ftPublicShare = ref(0) // 0 ... 100 all shareing
        // voting 
        const voteSpamThreshold = ref(80) // 0 .. 100 
        const voteDurationDays = ref(0)
        const voteDurationHours = ref(1)
        const voteQuorum = ref(50) // 10 ... 100
        const voteApproveThreshold = ref(50) // 0 .. 100
        const voteOnlyOnce = ref(true)

        const isValidated = ref({
            account: false,
            name: false,
            description: false,
            council: false,
            ftName: false,
            ftAmount: false,
            ftIIDistribution: false,
            ftInsiderShare: false,
            ftFundationShare: false,
            ftCommunityShare: false,
            ftPublicShare: false,
            voteSpamThreshold: false,
            voteDurationDays: false,
            voteDurationHours: false,
            voteQuorum: false,
            voteApproveThreshold: false,
            voteOnlyOnce: false
        })

        const {errors, validateAccountField, validateNameField,
            validateDescriptionField, validateCouncilField, validateFtNameField, validateFtAmountField,
            validateFtIIDistributionField, validateFfSharesFields, validateFfSharesFieldsTogether,
            validateVoteSpamThresholdField, validateVoteDurationDaysField, validateVoteDurationHoursField,
            validateVoteQuorumField, validateVoteApproveThresholdField} = createDaoFormValidation()

        return{
           t, exampleModal, account, name, 
           description, ftName, ftAmount, ftInsiderInitDistribution, ftInsiderShare, ftFundationShare, ftCommunityShare,
           ftPublicShare, voteSpamThreshold, voteDurationDays, voteDurationHours, voteQuorum, voteApproveThreshold, voteOnlyOnce,
           council, councilString, isValidated, errors,  validateAccountField, validateNameField, validateDescriptionField, validateCouncilField,
           validateFtNameField, validateFtAmountField, validateFtIIDistributionField, validateFfSharesFields, validateFfSharesFieldsTogether, validateVoteSpamThresholdField,
           validateVoteDurationDaysField, validateVoteDurationHoursField, validateVoteQuorumField, validateVoteApproveThresholdField, contract
        } 
        
    },
    
    methods:{

        validateAccount(){
            this.validateAccountField("account", this.account)
            this.isValidated.account = true
        },

        validateName(){
            this.validateNameField("name", this.name)
            this.isValidated.name = true
        },

        validateDescription(){
            this.validateDescriptionField("description", this.description)
            this.isValidated.description = true
        },

        validateCouncil(){ // TODO
            this.validateCouncilField("council", this.councilString)
            this.isValidated.council = true
            if(!this.errors.council){
                this.council = this.councilString.split(",").map(s => s.trim())
            }
        },

        validateFtName(){ // TODO
            this.validateFtNameField("ftName", this.ftName)
            this.isValidated.ftName = true
        },

        validateFtAmount(){
            this.validateFtAmountField("ftAmount", this.ftAmount)
            this.validateFtIIDistributionField("ftIIDistribution", this.ftInsiderInitDistribution, this.ftAmount)
            this.isValidated.ftAmount = true
        },

        validateFtIIDistribution(){
            this.validateFtIIDistributionField("ftIIDistribution", this.ftInsiderInitDistribution, this.ftAmount)
            this.isValidated.ftIIDistribution = true
        },

        validateFfShares(fieldName, event){
            this.validateFfSharesTogether()
            if (!this.errors[fieldName]){
                this.validateFfSharesFields(fieldName, event.target.value)
                this.isValidated[fieldName] = true
            }
        },

        validateFfSharesTogether(){
            this.ftPublicShare = 100 - (this.ftInsiderShare + this.ftFundationShare + this.ftCommunityShare)
            if (this.ftPublicShare < 0) {
                this.ftPublicShare = 0
            }
            this.validateFfSharesFieldsTogether(["ftInsiderShare", "ftFundationShare", "ftCommunityShare", "ftPublicShare"], this.ftInsiderShare, this.ftFundationShare, this.ftCommunityShare, this.ftPublicShare)
            this.isValidated.ftInsiderShare = true
            this.isValidated.ftFundationShare = true
            this.isValidated.ftCommunityShare = true
            this.isValidated.ftPublicShare = true
        },

        validateVoteSpamThreshold(){
            this.validateVoteSpamThresholdField("voteSpamThreshold", this.voteSpamThreshold, 100)
            this.isValidated.voteSpamThreshold = true
        },

        validateVoteDurationDays(){
            this.validateVoteDurationDaysField("voteDurationDays", this.voteDurationDays)
            this.isValidated.voteDurationDays = true
        },

        validateVoteDurationHours(){
            this.validateVoteDurationHoursField("voteDurationHours", this.voteDurationHours)
            this.isValidated.voteDurationHours = true
        },

        validateVoteQuorum(){
            this.validateVoteQuorumField("voteQuorum", this.voteQuorum, 100)
            this.isValidated.voteQuorum = true 
        },

        validateVoteApproveThreshold(){
            this.validateVoteApproveThresholdField("voteApproveThreshold", this.voteApproveThreshold, 100)
            this.isValidated.voteApproveThreshold = true
        },



        async createDao(){
            const accountId = this.account // + ".podilnik.testnet" // all
            console.log(accountId)
            const publicKey = null
            const info = {
                name: this.name,
                description: this.description,
                ft_name: this.ftName,
                ft_amount: this.ftAmount, // 1.. 1_000_000_000
                tags: ['organization', 'dao']
            }
            console.log(info)

            const args = {
            //const args = Buffer.from(JSON.stringify({
                name: this.name,
                total_supply: this.ftAmount, // TODO: check 
                init_distribution: this.ftInsiderInitDistribution,
                ft_metadata: {
                    spec: "ft-1.0.0",
                    name: this.ftName,
                    symbol: this.account.toUpperCase(),
                    icon: null,
                    reference: null,
                    reference_hash: null,
                    decimals: 0
                },
                config : {
                    insiders_share: this.ftInsiderShare,
                    fundation_share: this.ftFundationShare,
                    community_share: this.ftCommunityShare,
                    description: this.description,
                    vote_spam_threshold: this.voteSpamThreshold,
                },
                release_config: 'Voting',
                vote_policy_configs : [
                    {
                        proposal_kind: 'Pay', // TODO: PStu fill in
                        duration: ((this.voteDurationHours * 3_600) + (this.voteDurationDays * 3_600 * 24)) * Math.pow(10,9),
                        quorum: this.voteQuorum,
                        approve_threshold: this.voteApproveThreshold,
                        vote_only_once: this.voteOnlyOnce,
                        waiting_open_duration: 0
                    }
                ],
                founders: this.council
                //})).toString('base64')
                }
           
           
            const args_base64 = Buffer.from(JSON.stringify(args)).toString('base64')
            let b = await this.factoryContract.create(
                { "acc_name": accountId, "public_key": publicKey, "dao_info": info, "args": args_base64},
                "300000000000000", // gas 1000 TGas
                "10000000000000000000000000" // 1 NEAR
            )
            console.log(b)
        
            
            console.log(accountId, publicKey, info, args)
        },
    },
    computed: {
        accountId(){
            return this.$store.getters['near/getAccountId']
        },
        factoryContract() {
            return this.$store.getters['near/getFactoryContract']
        },
        apiKeyStore() {
            return this.$store.getters['near/getApiKeyStore']
        },
        envContactName() {
            return process.env.VUE_APP_NEAR_CONTRACT_NAME
        },
    },
    created() {
    },
    mounted() {
        this.council = [this.accountId]
        this.councilString = this.accountId
        const keyStore = new nearAPI.keyStores.BrowserLocalStorageKeyStore()
        const keyPair = keyStore.getKey('testnet', 'petrfilla.testnet')
        console.log(keyPair.publicKey)
    },
})

</script>

