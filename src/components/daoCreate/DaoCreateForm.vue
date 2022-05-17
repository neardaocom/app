<template>
    <MDBStepper vertical class="text-start pb-4">
        <MDBStepperStep active>
            <MDBStepperHead class="h4" icon="1">
                {{ t('default.create') }}
            </MDBStepperHead>
            <MDBStepperContent>
                <div class="row" >
                    <!-- Name -->
                    <div class="col-12 col-md-6">
                       <InputString :labelName="t('default.dao_name')" id="dao_name"/>
                    </div>
                    <!-- Account --> 
                    <div class="col-12 col-md-6">
                        <InputString :labelName="t('default.account')" id="dao_account" :addon="`.${factoryAccount}`"/>
                    </div>

                    <!-- Purpose -->
                    <div class="col-12 col-md-8">
                        <InputString :labelName="t('default.purpose_short')" id="dao_purpose"/>
                    </div>

                    <!-- Type -->
                    <div v-if="false" class="col-12 col-md-6  mb-4">
                        <Select :labelName="t('default.type')" id="dao_type" :options="typeOptions" :filter="true"/>
                    </div>
                </div>
            </MDBStepperContent>
        </MDBStepperStep>

         <MDBStepperStep>
            <MDBStepperHead class="h4" icon="2">
                {{ t('default.add_founders') }}
            </MDBStepperHead>
            <MDBStepperContent>
                 <!-- Councils -->
                <div class="col-12 col-md-6  mb-4">
                    <InputString :labelName="t('default.add_founding_members')" id="dao_council" :buttonText="t('default.add')" :addon="`.${accountPostfix}`" @button-click="addCouncil"/>
                </div>
                <div class="row">
                    <div class="col-12 mb-4 mt-2">
                        <MDBBtn class="mb-1" v-for="(c, i) in council" :key="i" @click="removeCouncil(c)" color="primary" size="sm">
                            {{c}}<span class="ms-2"><MDBIcon icon="times" size="sm"/></span>
                        </MDBBtn>
                    </div>
                </div>
                <FromErrorMessage :show="councilErrorMessage !== null" :message="councilErrorMessage"/>
            </MDBStepperContent>
        </MDBStepperStep>

        <MDBStepperStep>
            <MDBStepperHead class="h4" icon="3">
                {{ t('default.issue_tokens') }}
            </MDBStepperHead>
            <MDBStepperContent class="pb-4 mb-2">
                <div class = "row">
                    <!-- ftName -->
                    <div class="col-12 col-md-4">
                        <InputString :labelName="t('default.dao_ft_name')" id="dao_ft_name" :tooltip="t('default.ft_name_tooltip')"/>
                    </div>
                
                    <!-- ftAmount -->
                    <div class="col-12 col-md-4">
                        <InputNumber :labelName="t('default.total_supply')" id="dao_ft_amount" :tooltip="t('default.ft_amount_tooltip')" />
                    </div>
                </div>

                <div class="row">
                    <div class="mt-4 col-12">
                        <h5>{{ t('default.founders_vs_community') }}</h5>
                    </div>
                    <div class="col-10 col-md-6">
                        <!-- <label class="form-label">{{ t('default.allocation') }}</label> -->
                        <MDBRange  :disabled="false" v-model="ftCouncilShare" :min="0" :max="100"/>
                    </div>
                    <div class="col-2">
                        <label class="form-label">{{ ftCouncilShareComp }}</label>
                    </div>
                </div>

                <!-- ftCouncilShare -->
                <div class="row mt-4">
                    <div class="col-12 col-md-7">
                        <MDBProgress :height="20" class="rounded">
                            <MDBProgressBar :value="ftCouncilShare" bg="primary">{{ t('default.founders') }} {{ ftCouncilShare }}%</MDBProgressBar>
                            <MDBProgressBar :value="ftCommunityShare" bg="warning" >{{ t('default.community') }} {{ ftCommunityShare }}%</MDBProgressBar>
                        </MDBProgress>
                    </div>
                </div>

                <div class="row mt-4">
                    <div class="col-12">
                        <h5>{{ t('default.founders_unlock') }}</h5>
                    </div>
                    <div class="col-12 col-md-7">
                        <div class="row">
                            <div class="col-4">
                                <InputNumber :labelName="t('default.dao_ft_init_distribution')" id="dao_ft_init_distribution" :disabled="disabledUnlocking" :tooltip="t('default.ft_council_init_tooltip')" addon="%" />
                            </div>
                            <div class="col-4">
                                <InputNumber :labelName="t('default.lenght_founders_vesting')" id="dao_unlocking_year" :disabled="disabledUnlocking" :tooltip="t('default.ft_council_unlocking_tooltip')" :addon="t('default.year')" />
                            </div>
                            <div class="col-4">
                                <InputNumber labelName="&nbsp;" id="dao_unlocking_month" :disabled="disabledUnlocking" :addon="t('default.month')" />
                            </div>
                        </div>
                    </div>
                </div>
            </MDBStepperContent>
        </MDBStepperStep>
        <MDBStepperStep>
            <MDBStepperHead class="h4" icon="4">
                {{ t('default.set_up_voting') }}
            </MDBStepperHead>
            <MDBStepperContent>

                <!-- voteApproveThreshold -->
                <label class="form-label col-md-6 col-3">
                    {{ t('default.dao_vote_approve_threshold') }}
                    <TooltipLabel description="Percent of vouters agreeing with notion"/>
                </label>
                <div class="row mb-4">
                    <MDBRange wrapperClass="col-md-6 col-9" v-model="voteApproveThreshold" :min="1" :max="100" />
                    <label class="form-label col-md-6 col-3">{{ voteApproveThreshold }}%</label>
                </div>

                <!-- voteQuorum -->
                <label class="form-label col-md-6 col-3">
                    {{ t('default.dao_vote_quorum') }}
                    <TooltipLabel description="Minimum precent of voter's voting"/>
                </label>
                <div class="row mb-4">
                    <MDBRange wrapperClass="col-md-6 col-9" v-model="voteQuorum" :min="1" :max="100" />
                    <label class="form-label col-md-6 col-3">{{ voteQuorum }}%</label>
                </div>

                <!-- voteDurationDays -->
                <div class="row mb-4">
                    <MDBRange wrapperClass="col-md-6 col-9" :label="t('default.dao_vote_duration_days')" v-model="voteDurationDays" :min="0" :max="30" />
                    <label class="form-label col-md-6 col-3">{{ voteDurationDays }} </label>
                </div>

                <!-- voteDurationHours -->
                <div class="row mb-4">
                    <MDBRange wrapperClass="col-md-6 col-9" :label="t('default.dao_vote_duration_hours')" v-model="voteDurationHours" :min="0" :max="23" />
                    <label class="form-label col-md-6 col-3">{{ voteDurationHours }}h</label>
                </div>

                <!-- voteDurationMinutes TODO: Delete in production mode -->
                <div class="row mb-4"> 
                    <MDBRange wrapperClass="col-md-6 col-9" :label="t('default.dao_vote_duration_minutes')" v-model="voteDurationMinutes" :min="0" :max="60" />
                    <label class="form-label col-md-6 col-3">{{ voteDurationMinutes }}m</label>
                </div>
            </MDBStepperContent>
        </MDBStepperStep>
            
        <MDBStepperStep>
            <MDBStepperHead class="h4" icon="5">
                {{ t('default.summary') }}
            </MDBStepperHead>
            <MDBStepperContent>
                <div class="row">
                    <div class="col-6">
                        <dl class="row">
                            <FormSummary :name="t('default.dao_name')" :value="values.dao_name"/>

                            <FormSummary :name="t('default.account')" :value="values.dao_account"/>

                            <FormSummary :name="t('default.purpose_short')" :value="values.dao_purpose"/>

                            <FormSummary :name="t('default.type')" :value="t('default.' + values.dao_type)"/>

                            <FormSummary :name="t('default.founders')" :value="council.join(', ')"/>
                        </dl> 
                    </div>
                </div>

                <div class="row">
                    <div class="col-md-6">
                        <h5 class="text-muted">{{ t('default.governance_tokens') }}</h5>
                        <hr>
                          <dl class="row">
                            <FormSummary :name="t('default.dao_ft_name')" :value="values.dao_ft_name"/>

                            <FormSummary :name="t('default.amount')" :value="values.dao_ft_amount"/>

                            <FormSummary :name="t('default.founders_unlock')" :value="(ftCouncilShare ? ftCouncilShare : '0') + '%'"/>
                            
                            <FormSummary :name="t('default.dao_ft_init_distribution')" :value="(values.dao_ft_init_distribution ? values.dao_ft_init_distribution  : '0') + '%'"/>
                            
                            <FormSummary :name="t('default.lenght_founders_vesting')" :value="unlockingTime"/>

                            <FormSummary :name="t('default.community_fund')" :value="(ftCommunityShare ? ftCommunityShare : '0') + '%'"/>
                        </dl>
                    </div>

                    <div class="col-md-6">
                        <h5 class="text-muted">{{ t('default.voting') }}</h5>
                        <hr>
                        <dl class="row">
                            <FormSummary :name="t('default.dao_vote_approve_threshold')" :value="(voteApproveThreshold ? voteApproveThreshold : '0') + '%'"/>

                            <FormSummary :name="t('default.dao_vote_quorum')" :value="voteQuorum ? voteQuorum : '0' + '%'" />

                            <FormSummary :name="t('default.dao_vote_duration_days')" :value="voteDurationDays"/>

                            <FormSummary :name="t('default.dao_vote_duration_hours')" :value="voteDurationHours"/>

                            <FormSummary :name="t('default.dao_vote_duration_minutes')" :value="voteDurationMinutes"/>
                        </dl>       
                    </div>
                </div> 

                <MDBBtn wrapperClass="mt-10 mb-2" color="success" @click="onSubmit" size="lg" >{{ t('default.create_dao') }}</MDBBtn>
                <!-- TODO: Change button to big like landing page -->
            </MDBStepperContent>
        </MDBStepperStep>
    </MDBStepper>


</template>

<script>
import {
    MDBStepperHead,
    MDBStepperContent,
    MDBStepperStep,
    MDBStepper,
    MDBBtn,
    MDBProgress,
    MDBProgressBar,
    MDBRange,
    MDBIcon
} from "mdb-vue-ui-kit";
import InputString from '@/components/forms/InputString.vue'
import Select from '@/components/forms/Select.vue'
import InputNumber from '@/components/forms/InputNumber.vue';
import TooltipLabel from '@/components/forms/TooltipLabel.vue'
import FormSummary from '@/components/forms/FormSummary.vue'
import FromErrorMessage from '@/components/forms/FormErrorMessage.vue'
import moment from 'moment'
import loLowerCase from "lodash/lowerCase"
import { useI18n } from 'vue-i18n';
import { computed, ref, inject } from 'vue';
import { useStore } from 'vuex'
import { onMounted, watch, watchEffect } from '@vue/runtime-core';
import ObjectHelper from '@/models/utils/ObjectHelper'
import { useForm, useField } from 'vee-validate';
import Decimal from 'decimal.js';
import NearUtils from "@/models/nearBlockchain/Utils";

export default {
    components: {
        MDBStepperHead,
        MDBStepperContent,
        MDBStepperStep,
        MDBStepper,
        MDBBtn,
        MDBProgress,
        MDBProgressBar,
        MDBRange,
        MDBIcon,
        TooltipLabel,
        InputString,
        Select,
        InputNumber,
        FormSummary,
        FromErrorMessage
    },
    setup () {
        const {t} = useI18n()
        const logger = inject('logger')
        const notify = inject('notify')
        const config = inject('config')
        const store = useStore()

        const factoryAccount = computed(() => (config.value.near.contractName))
        const accountPostfix = computed(() => NearUtils.getAccountIdPostfix(factoryAccount.value))
        const nearService = computed(() => (store.getters['near/getService']))
        const accountId = computed(() => ( store.getters['near/getAccountId']))

        const schema = computed(() => {
            return {
                dao_name: 'required|min:3|max:64',
                dao_account: `required|accountNotExists:${factoryAccount.value}`,
                dao_purpose: 'required|min:3|max:160',
                dao_type: 'required',
                dao_council: `accountExists:${accountPostfix.value}`,
                council_array: 'required',
                dao_ft_name: 'required|min:3|max:64|alpha',
                dao_ft_amount:'required|strIsNumber|strNumMin:1.0|strNumMax:1000000000.0',
                dao_ft_init_distribution: 'required|strIsNumber|strNumMin:0|strNumMax:100',
                dao_unlocking_year:'required|strIsNumber|strNumMin:0|strNumMax:20',
                dao_unlocking_month:'required|strIsNumber|strNumMin:0|strNumMax:12'
            }
        });

        const { errors, handleSubmit, values, setFieldValue, setFieldTouched } = useForm({ validationSchema: schema});

        const {value: council, errorMessage: councilErrorMessage} = useField('council_array', undefined, { initialValue: [accountId.value]})
        
        const typeOptions = ref([])
        const ftCommunityShare = ref(80)
        const ftCouncilShare = ref(20)
        const disabledUnlocking = ref(false)

        const voteQuorum = ref(20)
        const voteApproveThreshold = ref(51)
        const voteDurationDays = ref(3)
        const voteDurationHours = ref(0)
        const voteDurationMinutes = ref(0)

        
        const defaultTypeOptions = [
            ['1000000', '10', 51, 20, 3, 0],
            ['2000000', '30', 5, 2, 83, 10],
            ['4000000', '50', 1, 70, 33, 20]
        ]


        watchEffect(() => {ftCommunityShare.value = 100 - ftCouncilShare.value})
        watchEffect(() => {disabledUnlocking.value = ftCouncilShare.value === 0 ? true : false})

         watch(() => [values.dao_name], () => {
            setFieldValue('dao_account', loLowerCase(values.dao_name).replace(/\s/g, '') )
            setFieldTouched('dao_account', true)
        })

        watch(() => [values.dao_type], () => {
            const newType = typeOptions.value.find( type => type.selected === true ) ?? {mdbKey: 0}
            if(newType !== undefined){
                setFieldValue('dao_ft_amount', defaultTypeOptions[newType.mdbKey][0])
                setFieldTouched('dao_ft_amount', false)
                setFieldValue('dao_ft_init_distribution', defaultTypeOptions[newType.mdbKey][1])
                setFieldTouched('dao_ft_init_distribution', false)
                voteApproveThreshold.value = defaultTypeOptions[newType.mdbKey][2]
                voteQuorum.value = defaultTypeOptions[newType.mdbKey][3]
                voteDurationDays.value = defaultTypeOptions[newType.mdbKey][4]
                voteDurationHours.value = defaultTypeOptions[newType.mdbKey][5]
            }
        });

        const addCouncil = () =>{
            if (!errors.value.dao_council && values.dao_council){
                council.value.push(`${values.dao_council}.${accountPostfix.value}`)
                values.dao_council = ''
            }
        }

        const removeCouncil = (removedCouncil) => {
            council.value = council.value.filter((el) => el !== removedCouncil )
        }

        const onSubmit = handleSubmit(values => {
            console.log('onSubmit')
            createDao(values)
        }, () => {
            console.log('onSubmit - 2')
            if(Object.keys(errors.value).length === 1 && errors.value['dao_council']){
                createDao(values)
            }
        });

        onMounted(() => {
            values.dao_type = 'dao'
            values.dao_unlocking_year = 3
            values.dao_unlocking_month = 0
        })

        const createDao = (values) => {
            const accountId = values.dao_account + '.' + factoryAccount.value
            // set accountId to localStorage because of redirection
            localStorage.create_dao_account = accountId

            const councilMembers = values.council_array.map((councilAccount) =>{ return {account_id: councilAccount, tags : [1]}})
            //create
            nearService.value.createDao(
                values.dao_name,
                values.dao_account,
                values.dao_purpose,
                values.dao_ft_name,
                new Decimal(values.dao_ft_amount).toNumber(), // TODO: when Peta update smartContract toFixed()
                councilMembers,
                new Decimal(ftCouncilShare.value).mul(values.dao_ft_amount ? values.dao_ft_amount : '0').div(100).toNumber(), //councilReleaseAmount  TODO: when Peta update smartContract toFixed()
                new Decimal(values.dao_ft_init_distribution).div(100).mul(ftCouncilShare.value).div(100).mul(values.dao_ft_amount).toNumber(), //councilReleaseInitDistribution  TODO: when Peta update smartContract toFixed()
                moment.duration().add(Number.parseFloat(values.dao_unlocking_year), 'y').add(Number.parseFloat(values.dao_unlocking_month), 'M').asSeconds(), //councilReleaseDuration
                voteApproveThreshold.value,
                voteQuorum.value,
                voteDurationDays.value,
                voteDurationHours.value,
                voteDurationMinutes.value,
                10
            )
        }

        // type loading
        onMounted(() => {
            nearService.value.getTags().then((tags) => {
                typeOptions.value = tags.map(tag => { return {text: t('default.' + tag), value: tag}}).sort(ObjectHelper.compareByText)
                setFieldTouched('dao_type', false)
            }).catch((e) => {
                logger.error('D', 'app@pages/DaoCreate', 'GetTags-blockchain', `Tags could not be loaded`)
                logger.error('B', 'app@pages/DaoCreate', 'GetTags-blockchain', `Tags could not be loaded`)
                notify.danger(this.t('default.notify_proposal_finalize_fail_title'), this.t('default.notify_blockchain_fail') + " " +  this.t('default.notify_proposal_finalize_fail_message', {proposal: this.proposal.title}))
                notify.flush()
                console.log(e);
            })
        })

        const ftCommunityShareComp = computed(() => new Decimal(ftCommunityShare.value).mul(values.dao_ft_amount ? values.dao_ft_amount : '0').div(100).toFixed())
        const ftCouncilShareComp = computed(() => new Decimal(ftCouncilShare.value).mul(values.dao_ft_amount ? values.dao_ft_amount : '0').div(100).toFixed())
        const unlockingTime = computed(() => `${values.dao_unlocking_year ? `${values.dao_unlocking_year}  ${t('default.year')} ` : ''}${values.dao_unlocking_month > 0 ? `${values.dao_unlocking_month} ${t('default.month')}`: ''}`)


        // const step = ref(null)
        // watchEffect(() => {
        //     console.log(step.value?.className);
        // })
        

        return {
            t,
            factoryAccount,
            accountPostfix,
            typeOptions,
            onSubmit,
            council,
            ftCommunityShare,
            ftCommunityShareComp,
            ftCouncilShare,
            ftCouncilShareComp,
            disabledUnlocking,
            voteQuorum,
            voteApproveThreshold,
            voteDurationDays,
            voteDurationHours,
            voteDurationMinutes,
            values,
            unlockingTime,
            addCouncil,
            removeCouncil,
            councilErrorMessage,
            errors
        }
    }
}
</script>
<style>
    .stepper-completed .stepper-head-icon {
        background-color: #ABD055 !important
    }

    .stepper-active .stepper-head-icon{
        background-color: #5F8AFA !important
    }

    .stepper-active .h4 .stepper-head-text {
        font-weight: 700 !important;
    }

    .range .thumb:after{
         background-color: #5F8AFA !important
    }

    /* .stepper-active +.stepper-step .stepper-head-icon{
        background-color: #E3935B !important
    } */



</style>