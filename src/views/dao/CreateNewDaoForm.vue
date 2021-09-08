<template>
    <MDBBtn  @click="exampleModal = true" class="btn btn-black btn-rounded mx-2" >{{ t('default.create_new_dao') }}</MDBBtn>

    <MDBModal
        id="exampleModal"
        tabindex="-1"
        labelledby="exampleModalLabel"
        v-model="exampleModal"
        size="lg"
    >
        <MDBModalHeader>
            <MDBModalTitle id="exampleModalLabel"> {{ t('default.create_new_dao') }} </MDBModalTitle>
        </MDBModalHeader>
        <MDBModalBody>
            
            <!--

            <MDBStepper vertical>
                <MDBStepperStep active>
                <MDBStepperHead icon="1">
                    step1
                </MDBStepperHead>
                <MDBStepperContent>
                    <span
                    >Lorem ipsum dolor sit amet enim. Etiam ullamcorper.
                    Suspendisse a pellentesque dui, non felis. Maecenas malesuada
                    elit lectus felis, malesuada ultricies.</span
                    >
                </MDBStepperContent>
                </MDBStepperStep>
                <MDBStepperStep>
                <MDBStepperHead icon="2">
                    step2
                </MDBStepperHead>
                <MDBStepperContent>
                    <span
                    >Lorem ipsum dolor sit amet enim. Etiam ullamcorper.
                    Suspendisse a pellentesque dui, non felis. Maecenas malesuada
                    elit lectus felis, malesuada ultricies.</span
                    >
                </MDBStepperContent>
                </MDBStepperStep>
                <MDBStepperStep>
                <MDBStepperHead icon="3">
                    step3
                </MDBStepperHead>
                <MDBStepperContent>
                    <span
                    >Lorem ipsum dolor sit amet enim. Etiam ullamcorper.
                    Suspendisse a pellentesque dui, non felis. Maecenas malesuada
                    elit lectus felis, malesuada ultricies.</span
                    >
                </MDBStepperContent>
                </MDBStepperStep>
            </MDBStepper> -->

            <label for="account-id-input" class="form-label">{{ t('default.account_id') }}</label>
            <MDBInput id="account-id-input" aria-describedby="account-addon" v-model="account" :data-mdb-showcounter="true" maxlength="64" required/>     
                
            <!-- Form 
            <MDBRow tag="form" class="g-3 needs-validation" novalidate @submit.prevent="checkForm">
                <MDBCol col="12">
                    <MDBInput
                        :label="t('default.dao_name')"
                        v-model="account"
                        :invalidFeedback="t('default.dao_form_invalid_feedback')" 
                        :validFeedback="t('default.dao_form_valid_feedback')" 
                        required
                    />
                </MDBCol>
                <MDBCol col="12">
                    <MDBTextarea
                        :label="t('default.dao_purpose')"
                        rows="3"
                        v-model="daoPurpose"
                        :invalidFeedback="t('default.dao_form_invalid_feedback')" 
                        :validFeedback="t('default.dao_form_valid_feedback')" 
                        required
                    />
                </MDBCol>

                <MDBCol col="12">
                    <MDBTextarea
                        :label="t('default.dao_council')"
                        rows="2"
                        v-model="daoCouncil"
                        :invalidFeedback="t('default.dao_form_invalid_feedback')" 
                        :validFeedback="t('default.dao_form_valid_feedback')" 
                        required
                    />
                </MDBCol>

                <MDBCol col="12">
                <MDBTextarea
                    :label="t('default.dao_tags')"
                    rows="2"
                    v-model="daoTags"
                    :invalidFeedback="t('default.dao_form_invalid_feedback')" 
                    :validFeedback="t('default.dao_form_valid_feedback')" 
                />
                </MDBCol>

                <MDBCol col="12">
                    <MDBInput
                        :label="t('default.dao_initital_treasury')"
                        v-model="treasury"
                        :invalidFeedback="t('default.dao_form_invalid_feedback')" 
                        :validFeedback="t('default.dao_form_valid_feedback')" 
                        required
                    />
                </MDBCol>

                <MDBCol col="12">
                    <MDBBtn color="primary" type="submit">{{ t('default.create') }} </MDBBtn>
                </MDBCol>
            </MDBRow>

              Form -->


            <!-- <form class="needs-validation" novalidate  @submit.prevent="checkForm"> 
                <div class="mb-4">
                    <MDBInput
                        :label="t('default.dao_name')"
                        v-model="daoName"
                        invalidFeedback="Example invalid form file feedback"
                        required
                    />
                </div>

                <div class="mb-3">
                    <MDBTextarea
                        :label="t('default.dao_purpose')"
                        rows="3"
                        v-model="daoPurpose"
                        invalidFeedback="Please enter a message in the textarea"
                        required
                    />
                </div>

                <div class="mb-3">
                    <MDBTextarea
                        :label="t('default.dao_council')"
                        rows="2"
                        v-model="daoCouncil"
                        invalidFeedback="Please enter a message in the textarea"
                        required
                    />
                </div>

                <div class="mb-3">
                    <MDBTextarea
                        :label="t('default.dao_tags')"
                        rows="2"
                        v-model="daoTags"
                        invalidFeedback="Please enter a message in the textarea"
                        required
                    />
                </div>

                <div class="mb-4">
                    <MDBInput
                        :label="t('default.dao_initital_treasury')"
                        v-model="treasury"
                        invalidFeedback="Example invalid form file feedback"
                        required
                    />
                </div> 

                <div class="pb-4">
                    <MDBBtn color="primary" type="submit">{{ t('default.create') }} </MDBBtn>
                </div>
            </form> -->


        </MDBModalBody>
    </MDBModal>
</template>



<script>
    import { useI18n } from 'vue-i18n';
    import { ref } from 'vue';
  import {
    MDBBtn,
    MDBModal,
    MDBModalHeader,
    MDBModalTitle,
    MDBModalBody,
    //MDBModalFooter,
    //MDBTextarea,
    MDBInput,
    //MDBRow,
    //MDBCol,
    //MDBStepper, MDBStepperStep, MDBStepperHead, MDBStepperContent
  } from 'mdb-vue-ui-kit';

export default({
    components: {
        MDBBtn,
        MDBModal,
        MDBModalHeader,
        MDBModalTitle,
        MDBModalBody,
        //MDBModalFooter,
        //MDBTextarea,
        MDBInput,
        //MDBRow,
        //MDBCol,
        //MDBStepper, MDBStepperStep, MDBStepperHead, MDBStepperContent
    },
    setup() {
        const { t } = useI18n();
        const exampleModal = ref(false);
        // basic        
        const account = ref('');  // TODO: podilni.near, not dot
        const name = ref('') // nazev dao 3 .. 64 TODO: unique dao name
        const description = ref('') // textare max 3000
        const councils = ref([]) // at least 1 root account something.near
        
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
        


        const daoPurpose = ref('')
        const daoCouncil = ref('')
        const daoTags = ref('')
        const daoInitialTreasury = ref(0)

        const checkForm = (e) => {
            e.target.classList.add('was-validated');
        };
        return{
           t, exampleModal, account, daoPurpose, daoCouncil, daoTags, daoInitialTreasury, checkForm, name, 
           description, ftName, ftAmount, ftInsiderInitDistribution, ftInsiderShare, ftFundationShare, ftCommunityShare,
           ftPublicShare, voteSpamTreshold, voteDurationDays, voteDurationHours, voteQuorum, voteApproveTreshhold, voteOnlyOnce,
           councils 
        } 
        
    },
    methods:{
        createDao(){
            const accountId = this.account // all
            const publicKey = null
            const info = {
                name: this.name,
                description: this.description,
                ft_name: this.ftName,
                ft_amount: this.ftAmount, // 1.. 1_000_000_000
                tags: ['organization', 'dao']
            }
            // const args = Buffer.from(JSON.stringify({
            const args = {
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
                }
            }
            // })).toString('base64')
            const config = {
                insiders_share: this.ftInsiderShare,
                fundation_share: this.ftFundationShare,
                community_share: this.ftCommunityShare,
                description: this.description,
                vote_spam_treshold: this.voteSpamTreshold,
                release_config: 'voting',
            }
            const vote_policy_configs = [
                JSON.stringify({
                    proposal_kind: '...', // TODO: PStu fill in
                    duration: (this.voteDurationHours * 3_600) + (this.voteDurationDays * 3_600 * 24),
                    quorum: this.voteQuorum,
                    approve_treshhold: this.voteApproveTreshhold,
                    vote_only_once: this.voteOnlyOnce 
                })
            ]
            const founders = this.councils
            
            console.log(accountId, publicKey, info, args, config, vote_policy_configs, founders)
        }

    },

    computed: {
        accountId(){
            return this.$store.getters['near/getAccountId']
        }
    },
    
    mounted(){
        this.councils = [this.accountId]
    }
})
</script>
