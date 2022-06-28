<template>
    <Header></Header>
    <main>
        <MDBContainer>
            <Breadcrumb :list-name="'create_dao'" />
        </MDBContainer>
        <section class="mb-3">
            <div class="container">
                <div class="row">
                    <div class="col-12">
                        <h2>{{ t('create_your_dao')}}</h2>
                        <h6>{{ t('create_your_dao_sub')}}</h6>
                    </div>
                </div>
                <div class="card text-start w-auto p-2 mt-4">
                    <div class="card-body">
                        <MDBStepper ref="stepper" linear :mobileBreakpoint="620">
                            <MDBStepperStep active>
                                <MDBStepperHead icon="1">
                                    {{ t('governance_token') }}
                                </MDBStepperHead>
                                <MDBStepperContent>

                                    <div class="row justify-content-center">
                                        <dl class="row col-md-8 offset-md-2 text-start">
                                            <FormSummary :name="t('dao_ft_name')" :value="formCreateDao.data.dao_ft_name"/>
                                            <FormSummary :name="t('account')" :value="ftAccountId" />
                                            <FormSummary :name="t('amount')" :value="formCreateDao.data.dao_ft_amount"/>
                                            <FormSummary :name="t('founders_unlock')" :value="(formCreateDao.data.ftCouncilShare ? formCreateDao.data.ftCouncilShare : '0') + '%'"/>
                                            <FormSummary :name="t('dao_ft_init_distribution')" :value="(formCreateDao.data.dao_ft_init_distribution ? formCreateDao.data.dao_ft_init_distribution : '0') + '%'"/>
                                            <FormSummary :name="t('lenght_founders_vesting')" :value="unlockingTime"/>
                                            <FormSummary :name="t('community_fund')" :value="(formCreateDao.data.ftCommunityShare ? formCreateDao.data.ftCommunityShare : '0') + '%'"/>
                                        </dl>
                                    </div>
                                    <div class="mt-4 text-center"> 
                                        <MDBBtn @click="createToken(formCreateDao.data)" :disabled="!(formCreateDao.step === 'fromSubmited')" color="primary" rounded size="lg" class="bg-gradient-100 fs-6" style="width:210px">
                                            {{ t('create_token') }}
                                        </MDBBtn>
                                    </div>
                                    <!-- Hack: can't step to second step -->
                                    <MDBInput v-model="input1" wrapperClass="d-none" required/> 

                                </MDBStepperContent>
                            </MDBStepperStep>
                            <MDBStepperStep>
                                <MDBStepperHead icon="2">
                                    {{ t('Dao') }}
                                </MDBStepperHead>
                                <MDBStepperContent>

                                    <div class="row justify-content-center">
                                        <dl class="row col-md-8 offset-md-2 text-start">
                                            <FormSummary :name="t('dao_name')" :value="formCreateDao.data.dao_name" />
                                            <FormSummary :name="t('account')" :value="daoAccountId" />
                                            <FormSummary :name="t('purpose_short')" :value="formCreateDao.data.dao_purpose"/>
                                            <FormSummary :name="t('type')" :value="t('' + formCreateDao.data.dao_type)"/>
                                            <FormSummary :name="t('founders')" :value="formCreateDao.data.council_array.join(', ')"/>
                                        </dl>
                                    </div>
                                    <div class="mt-4 text-center"> 
                                        <MDBBtn @click="createDao(formCreateDao.data)" :disabled="!(formCreateDao.step === 'tokenCreated')" color="primary" rounded size="lg" class="bg-gradient-100 fs-6" style="width:210px">
                                            {{ t('create_dao') }}
                                        </MDBBtn>
                                    </div>
                                    <!-- Hack: can't step to third step -->
                                    <MDBInput v-model="input2" wrapperClass="d-none" required/> 

                                </MDBStepperContent>
                            </MDBStepperStep>
                            <MDBStepperStep>
                                <MDBStepperHead icon="3">
                                   {{ t('staking_service') }}
                                </MDBStepperHead>
                                <MDBStepperContent>
                                    <div class="row justify-content-center">
                                        <dl class="row col-md-8 offset-md-2 text-start">
                                            <FormSummary :name="t('dao_vote_approve_threshold')" :value="(formCreateDao.data.voteApproveThreshold ? formCreateDao.data.voteApproveThreshold : '0') + '%'" />
                                            <FormSummary :name="t('dao_vote_quorum')" :value="formCreateDao.data.voteQuorum ? formCreateDao.data.voteQuorum : '0' + '%'"/>
                                            <FormSummary :name="t('dao_vote_duration_days')" :value="formCreateDao.data.voteDurationDays" />
                                            <FormSummary :name="t('dao_vote_duration_hours')" :value="formCreateDao.data.voteDurationHours" />
                                            <FormSummary :name="t('dao_vote_duration_minutes')" :value="formCreateDao.data.voteDurationMinutes" />
                                        </dl>
                                    </div>
                                    <div class="mt-4 text-center"> 
                                        <MDBBtn @click="registerToken(daoAccountId, ftAccountId)" :disabled="!(formCreateDao.step === 'daoCreated')" color="primary" rounded size="lg" class="bg-gradient-100 fs-6" style="width:210px">
                                            {{ t('staking_service') }}
                                        </MDBBtn>
                                    </div> 
                                </MDBStepperContent>
                            </MDBStepperStep>
                        </MDBStepper>
                    </div>
                </div>
            </div>
        </section>
    </main>
    <!-- <MDBAlert v-model="fieldErrorAlert" width="250px" position="top-center" autohide appendToBody color="danger"> {{t('invalid_field_form')}} </MDBAlert>
    <MDBAlert v-model="createDaoErrorAlert" width="250px" position="top-center" autohide appendToBody color="danger"> {{t('invalid_field_form')}} </MDBAlert> -->
  <Footer></Footer>
</template>

<script>
import Header from '@/components/layout/Header.vue'
import Footer from '@/components/layout/Footer.vue'
import Breadcrumb from '@/components/ui/Breadcrumb.vue'
import FormSummary from '@/components/forms/FormSummary.vue'
import {
    MDBContainer,
    MDBBtn,
    MDBStepper,
    MDBStepperStep, 
    MDBStepperHead, 
    MDBStepperContent,
    MDBInput,
    //MDBAlert
} from 'mdb-vue-ui-kit';
import { ref, inject, computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { onMounted } from '@vue/runtime-core'
import { useRouter } from "vue-router";
import { useCreateToken } from '@/hooks/ft';
import { useAccounts, useFormStep, useCreateDAO } from "@/hooks/createDao"; // , useCreateDAO
import { useNearBlockchainTransaction } from "@/hooks/router";
import { useRegisterToken } from '@/hooks/staking'

export default {
    components:{
        Header,
        Footer,
        Breadcrumb,
        MDBContainer,
        MDBBtn,
        //MDBAlert,
        MDBStepper,
        MDBStepperStep, 
        MDBStepperHead, 
        MDBStepperContent,
        MDBInput,
        FormSummary
    },
    setup() {
        const { t } = useI18n()
        //const store = useStore()
        const router = useRouter()
        const { getState, tokenCreated, daoCreated, stakeServiceRegistred } = useFormStep()
        const loader = inject('loader')
        const config = inject('config')

        const { transactionHashes, transactionStatus } = useNearBlockchainTransaction()

        const formCreateDao = ref(getState())
        const formData = ref(formCreateDao.value.data)

        const { daoAccountId, ftAccountId } = useAccounts(config, formData)

        const { createToken } = useCreateToken(loader, config, daoAccountId.value)
        const { createDao } = useCreateDAO(loader, config, ftAccountId.value)
        const { registerToken } = useRegisterToken(loader)

        const unlockingTime = computed(() => `${formCreateDao.value.data.dao_unlocking_year ? `${formCreateDao.value.data.dao_unlocking_year}  ${t('year')} ` : ''}${formCreateDao.value.dao_unlocking_month > 0 ? `${formCreateDao.value.dao_unlocking_month} ${t('month')}`: ''}`)

        const stepper = ref(null);
        const input1 = ref('');
        const input2 = ref('');

        //const logger = inject('logger')
        
        //const { accountId } = useNear()

        const stepperCanAccess = (step) => {
            if (step === 2){
                stepper.value.changeStep(2)
                input1.value = 'some text' //can step from first step to second
            }
            if (step === 3){
                stepper.value.changeStep(2)
                stepper.value.changeStep(3)
                input1.value = 'some text' //can step from first step to second
                input2.value = 'some text' //can step from second step to third
            }
        }
        
        onMounted(() => {
            if (transactionStatus.value === 'success') {
                 // creating token
                if (formCreateDao.value.step === 'fromSubmited') {
                    formCreateDao.value = tokenCreated(transactionHashes.value)
                    stepperCanAccess(2)
                // creating dao
                } else if (formCreateDao.value.step === 'tokenCreated') {
                    stepperCanAccess(2)
                    if(transactionHashes.value !== formCreateDao.value.transactionHash){
                        formCreateDao.value = daoCreated(transactionHashes.value)
                        stepperCanAccess(3)
                    }
                // stake service
                } else if (formCreateDao.value.step === 'daoCreated') {
                    stepperCanAccess(3)
                    if(transactionHashes.value !== formCreateDao.value.transactionHash){
                        stakeServiceRegistred()
                        router.push({ name: 'dao', params: {id: daoAccountId.value}})
                    }
                } else {
                    // TODO: Wrong state
                }
            } else {
                // TODO: Wrong state
            }
        })
        return {
            t, formCreateDao, createToken, createDao, registerToken, formData, transactionHashes, 
            transactionStatus, daoAccountId, ftAccountId, stepper, input1, input2, unlockingTime
        }
    }
        
}
</script>