<template>
    <Header></Header>
    <main>
        <section class="bg-white shadow-2 mb-3">
            <div class="container">


                <MDBStepper vertical>
                    <MDBStepperStep active>
                        <MDBStepperHead icon="1">
                            step1
                        </MDBStepperHead>
                        <MDBStepperContent>

                            <!-- Account -->
                            <label for="dao-account" class="form-label">{{ t('default.account') }}</label>
                            <MDBInput id="dao-account" @keyup="validateAccount" @blur="validateAccount" v-model="account" :isValid="!errors.account" :isValidated="isValidated.account" :invalidFeedback="errors.account" inputGroup :formOutline="false" aria-describedby="dao-account" :data-mdb-showcounter="true">
                                <span class="input-group-text" id="dao-account">.near</span>
                            </MDBInput>

                            <!-- Name -->
                            <label for="dao-name" class="form-label">{{ t('default.dao_name') }}</label>
                            <MDBInput  id="dao-name" @keyup="validateName" @blur="validateName" v-model="name" :isValid="!errors.name" :isValidated="isValidated.name" :invalidFeedback="errors.name"/>

                            <!-- Description -->
                            <label for="dao-description" class="form-label">{{ t('default.dao_description') }}</label>
                            <MDBTextarea id="dao-description" @keyup="validateDescription" @blur="validateDescription" v-model="description" :isValid="!errors.description" :isValidated="isValidated.description" :invalidFeedback="errors.description"  rows="4" />

                            <!-- Councils -->
                            <label for="dao-council" class="form-label">{{ t('default.dao_council') }}</label>
                            <MDBTextarea id="dao-council" @keyup="validateCouncil" @blur="validateCouncil" v-model="councilString" :isValid="!errors.council" :isValidated="isValidated.council" :invalidFeedback="errors.council"  rows="2" wrapperClass="mb-5" />
                        
                        </MDBStepperContent>
                    </MDBStepperStep>
                    <MDBStepperStep>
                        <MDBStepperHead icon="2">
                            step2
                        </MDBStepperHead>
                        <MDBStepperContent>

                            <!-- ftName -->
                            <label for="dao-ft-name" class="form-label">{{ t('default.dao_ft_name') }}</label>
                            <MDBInput inputGroup  id="dao-ft-name" @keyup="validateFtName" @blur="validateFtName" v-model="ftName" :isValid="!errors.ftName" :isValidated="isValidated.ftName" :invalidFeedback="errors.ftName"/>

                            <!-- ftAmount -->
                            <label for="dao-ft-amount" class="form-label">{{ t('default.dao_ft_amount') }}</label>
                            <MDBInput inputGroup id="dao-ft-amount"  v-model.number="ftAmount" :isValid="!errors.ftAmount" :isValidated="isValidated.ftAmount" :invalidFeedback="errors.ftAmount" type="number"/>

                            <!-- ftInsiderInitDistribution -->
                            <label for="dao-ft-insider-init-distribution" class="form-label">{{ t('default.dao_ft_insider_init_distribution') }}</label>
                            <MDBInput inputGroup id="dao-ft-insider-init-distribution" @keyup="validateFtIIDistribution" @blur="validateFtIIDistribution"  v-model.number="ftInsiderInitDistribution" :isValid="!errors.ftIIDistribution" :isValidated="isValidated.ftIIDistribution" :invalidFeedback="errors.ftIIDistribution" type="number"/>



                            <!-- ftInsiderShare -->
                            <label for="ft-insider-share" class="form-label">{{ t('default.dao_ft_insider_share') }}</label>
                            <MDBInput  id="ft-insider-share" @keyup="validateFfShares('ftInsiderShare', $event)" @blur="validateFfShares('ftInsiderShare', $event)"  v-model.number="ftInsiderShare" :isValid="!errors.ftInsiderShare" :isValidated="isValidated.ftInsiderShare" :invalidFeedback="errors.ftInsiderShare" type="number"/>

                            <!-- ftFundationShare -->
                            <label for="ft-fundation-share" class="form-label">{{ t('default.dao_ft_fundation_share') }}</label>
                            <MDBInput  id="ft-fundation-share" @keyup="validateFfShares('ftFundationShare', $event)" @blur="validateFfShares('ftFundationShare', $event)"  v-model.number="ftFundationShare" :isValid="!errors.ftFundationShare" :isValidated="isValidated.ftFundationShare" :invalidFeedback="errors.ftFundationShare" type="number"/>

                            <!-- ftCommunityShare -->
                            <label for="ft-community-share" class="form-label">{{ t('default.dao_ft_community_share') }}</label>
                            <MDBInput  id="ft-community-share" @keyup="validateFfShares('ftCommunityShare', $event)" @blur="validateFfShares('ftCommunityShare', $event)"  v-model.number="ftCommunityShare" :isValid="!errors.ftCommunityShare" :isValidated="isValidated.ftCommunityShare" :invalidFeedback="errors.ftCommunityShare" type="number"/>

                            <!-- ftPublicShare -->
                            <label for="ft-public-share" class="form-label">{{ t('default.dao_ft_public_share') }}</label>
                            <MDBInput  id="ft-public-share" @keyup="validateFfShares('ftPublicShare', $event)" @blur="validateFfShares('ftPublicShare', $event)"  v-model.number="ftPublicShare" :isValid="!errors.ftPublicShare" :isValidated="isValidated.ftPublicShare" :invalidFeedback="errors.ftPublicShare" type="number" wrapperClass="mb-8"/>

                        </MDBStepperContent>
                    </MDBStepperStep>
                    <MDBStepperStep>
                        <MDBStepperHead icon="3">
                            step3
                        </MDBStepperHead>
                            <MDBStepperContent>

                                <!-- voteSpamTreshold -->
                                <label for="dao-vote-spam-treshold" class="form-label">{{ t('default.dao_vote_spam_treshold') }}</label>
                                <MDBInput  id="dao-vote-spam-treshold" @keyup="validateVoteSpamTreshold" @blur="validateVoteSpamTreshold"  v-model.number="voteSpamTreshold" :isValid="!errors.voteSpamTreshold" :isValidated="isValidated.voteSpamTreshold" :invalidFeedback="errors.voteSpamTreshold" type="number"/>


                                <!-- voteDurationDays -->
                                <label for="dao-vote-duration-days" class="form-label">{{ t('default.dao_vote_duration_days') }}</label>
                                <MDBInput  id="dao-vote-duration-days" @keyup="validateVoteDurationDays" @blur="validateVoteDurationDays"  v-model.number="voteDurationDays" :isValid="!errors.voteDurationDays" :isValidated="isValidated.voteDurationDays" :invalidFeedback="errors.voteDurationDays" type="number"/>


                                <!-- voteDurationHours -->
                                <label for="dao-vote-duration-hours" class="form-label">{{ t('default.dao_vote_duration_hours') }}</label>
                                <MDBInput  id="dao-vote-duration-hours" @keyup="validateVoteDurationHours" @blur="validateVoteDurationHours"  v-model.number="voteDurationHours" :isValid="!errors.voteDurationHours" :isValidated="isValidated.voteDurationHours" :invalidFeedback="errors.voteDurationHours" type="number"/>
                            
                                <!-- voteQuorum -->
                                <label for="dao-vote-quorum" class="form-label">{{ t('default.dao_vote_quorum') }}</label>
                                <MDBInput  id="dao-vote-quorum" @keyup="validateVoteQuorum" @blur="validateVoteQuorum"  v-model.number="voteQuorum" :isValid="!errors.voteQuorum" :isValidated="isValidated.voteQuorum" :invalidFeedback="errors.voteQuorum" type="number"/>
                            
                                <!-- voteApproveTreshhold -->
                                <label for="dao-vote-approve-treshhold" class="form-label">{{ t('default.dao_vote_approve_treshhold') }}</label>
                                <MDBInput  id="dao-vote-approve-treshhold" @keyup="validateVoteApproveTreshhold" @blur="validateVoteApproveTreshhold"  v-model.number="voteApproveTreshhold" :isValid="!errors.voteApproveTreshhold" :isValidated="isValidated.voteApproveTreshhold" :invalidFeedback="errors.voteApproveTreshhold" type="number"/>
                                            
                                <!-- voteOnlyOnce-->
                                <MDBCheckbox :label="t('default.dao_vote_only_once')" v-model="voteOnlyOnce" />

                                <MDBBtn @click="createDao" color="primary">{{ t('default.create_new_dao') }}</MDBBtn>
                                        

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
        MDBInput, MDBTextarea, MDBCheckbox, MDBBtn,
        MDBStepper, MDBStepperStep, MDBStepperHead, MDBStepperContent,

    } from 'mdb-vue-ui-kit';

    //import * as nearAPI from "near-api-js";

export default({

    components: {
        Header, Footer,
        MDBInput, MDBTextarea, MDBCheckbox, MDBBtn,
        MDBStepper, MDBStepperStep, MDBStepperHead, MDBStepperContent 
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
        const council = ref([]) // at least 1 root account something.near
        const councilString = ref('')
        
        // tokens
        const ftName = ref('')   // governance token 
        const ftAmount = ref(0) 
        const ftInsiderInitDistribution = ref(0) // 0 ... ftAmount
        const ftInsiderShare = ref(0) // 0 ... 100 all shareing 
        const ftFundationShare = ref(0) // 0 ... 100 all shareing 
        const ftCommunityShare = ref(0) // 0 ... 100 all shareing 
        const ftPublicShare = ref(100) // 0 ... 100 all shareing
        // voting 
        const voteSpamTreshold = ref(0) // 0 .. 100 
        const voteDurationDays = ref(0)
        const voteDurationHours = ref(0)
        const voteQuorum = ref(50) // 10 ... 100
        const voteApproveTreshhold = ref(50) // 0 .. 100
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
            voteSpamTreshold: false,
            voteDurationDays: false,
            voteDurationHours: false,
            voteQuorum: false,
            voteApproveTreshhold: false,
            voteOnlyOnce: false
        })

        const {errors, validateAccountField, validateNameField,
            validateDescriptionField, validateCouncilField, validateFtNameField, 
            validateFtIIDistributionField, validateFfSharesFields, validateFfSharesFieldsTogether} = createDaoFormValidation()

        return{
           t, exampleModal, account, name, 
           description, ftName, ftAmount, ftInsiderInitDistribution, ftInsiderShare, ftFundationShare, ftCommunityShare,
           ftPublicShare, voteSpamTreshold, voteDurationDays, voteDurationHours, voteQuorum, voteApproveTreshhold, voteOnlyOnce,
           council, councilString, isValidated, errors,  validateAccountField, validateNameField, validateDescriptionField, validateCouncilField,
           validateFtNameField, validateFtIIDistributionField, validateFfSharesFields, validateFfSharesFieldsTogether ,contract
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
            this.validateCouncilField("council", this.council)
            this.isValidated.council = true
        },

        validateFtName(){ // TODO
            this.validateFtNameField("ftName", this.ftName)
            this.isValidated.ftName = true
        },

        /*validateFtAmount(){ // TODO
            this.validateFtNameAmount("ftAmount", this.ftAmount)
            this.isValidated.ftAmount = true
        },*/

        validateFtIIDistribution(){ // TODO
            this.validateFtIIDistributionField("ftIIDistribution", this.ftInsiderInitDistribution, this.ftAmount)
            this.isValidated.ftIIDistribution = true
        },

        validateFfShares(fieldName, event){
            console.log(event.target.value)
            this.validateFfSharesFields(fieldName, event.target.value)
            this.isValidated[fieldName] = true
            this.validateFfSharesTogether()
        },

        validateFfSharesTogether(){
            this.ftPublicShare = 100 - (this.ftInsiderShare + this.ftFundationShare + this.ftCommunityShare)
            if (this.ftPublicShare < 0) {
                this.ftPublicShare = 0
                this.errors.ftInsiderShare = `The  fields should not be greater than `
                this.errors.ftFundationShare = `The  fields should not be greater than `
                this.errors.ftCommunityShare = `The  fields should not be greater than `
                this.errors.ftPublicShare = `The  fields should not be greater than `
            } else{
                this.errors.ftInsiderShare = ``
                this.errors.ftFundationShare = ``
                this.errors.ftCommunityShare = ``
                this.errors.ftPublicShare = ``
            }
            //this.validateFfSharesFieldsTogether(["ftInsiderShare", "ftFundationShare", "ftCommunityShare", "ftPublicShare"], this.ftInsiderShare, this.ftFundationShare, this.ftCommunityShare, this.ftPublicShare)
            this.isValidated.ftInsiderShare = true
            this.isValidated.ftFundationShare = true
            this.isValidated.ftCommunityShare = true
            this.isValidated.ftPublicShare = true
            console.log(this.errors.ftInsiderShare)
        },



        async createDao(){
            const accountId = this.account + ".near" // all
            const publicKey = null
            const info = {
                name: this.name,
                description: this.description,
                ft_name: this.ftName,
                ft_amount: this.ftAmount, // 1.. 1_000_000_000
                tags: ['organization', 'dao']
            }

            //const args = {
            const args = Buffer.from(JSON.stringify({
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
                    vote_spam_treshold: this.voteSpamTreshold,
                },
                release_config: 'voting',
                vote_policy_configs : [
                    {
                        proposal_kind: 'Pay', // TODO: PStu fill in
                        duration: ((this.voteDurationHours * 3_600) + (this.voteDurationDays * 3_600 * 24)) * Math.pow(10,9),
                        quorum: this.voteQuorum,
                        approve_treshhold: this.voteApproveTreshhold,
                        vote_only_once: this.voteOnlyOnce 
                    }
                ],
                founders: this.council
                })).toString('base64')
                //}
           
           
            /*let b = await this.contract.create({ "acc_name": accountId, "public_key": publicKey, "dao_info": info, "args": args},
            3000000000000000,
            1000000000000000000000000
            )

            console.log(b)*/
            
            console.log(accountId, publicKey, info, args)
        },
    },

    computed: {
        accountId(){
            return this.$store.getters['near/getAccountId']
        }
    },        

    
    mounted(){
        this.council = [this.accountId]
        this.councilString = this.accountId
    },

    /*async created(){
        const account = await this.$store.state.near.api.account("dev-1631206593211-61689593480844")
        this.contract = new nearAPI.Contract(
            account, // the account object that is connecting
            "dev-1631206593211-61689593480844",
            {
                // name of contract you're connecting to
                viewMethods: ["get_dao_list"], // view methods do not change state but usually return a value
                changeMethods: ["create"], // change methods modify state
                sender: account, // account object to initialize and sign transactions.
            })

            let v =await this.contract.get_dao_list({ } );
            console.log(v)
    }*/
})

</script>

