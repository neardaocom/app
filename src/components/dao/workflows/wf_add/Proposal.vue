<template>
    <div class="row mb-4">
        <div class="col-12 col-md-7">
            <Select :labelName="t('default.workflow')" id="workflow" :options="workflowsToAdd" />
        </div>
    </div> 

     <div class="row mb-4">
        <div class="col-12 col-md-7">
            <dt>{{t('default.wf_vote_level')}}:</dt>
                <dd v-html="t('default.' + voteLevel.key, voteLevel.params)"></dd>
        </div>
    </div> 

    <div class="row mb-4">
        <div class="col-12 col-md-7">
            <Select :labelName="t('default.wf_can_propose')" id="can_propose" multiple :options="proposeRights" />
        </div>
    </div>

    <div class="row mb-4">
        <div class="col-12 col-md-7">
            <Select :labelName="t('default.wf_can_vote')" id="can_vote" :options="voteRights" />
        </div>
    </div>

    <div class="row mb-4">
        <div class="col-12 col-md-7">
            <Select :labelName="t('default.wf_activities_rights')" id="activities_rights" :options="voteRights" />   
        </div>
    </div> 
</template>

<script>
import Select from '@/components/forms/Select.vue'
import { useI18n } from 'vue-i18n';
//import { useStore } from 'vuex'
import { computed, ref, toRefs } from '@vue/reactivity';
import { useForm } from 'vee-validate';
import { voteLevelToTranslate } from "@/models/dao"
import { toTranslate } from "@/models/rights";
import { DAORightsType } from '@/types/dao';
import { useTemplateList } from "@/hooks/workflow";
import { onMounted, watch } from '@vue/runtime-core';
import loDifferenceBy from 'lodash/differenceBy'
//import { useNearService } from '@/hooks/vuex';


export default {
    components:{
        Select,
    },
    props:{
        contractId: {
            type: String,
            required: true
        },
        dao: {
            type: Object,
            required: true,
        },
        daoRights: {
            type: Object,
            required: true,
        },
    },
    setup (props) {
        const {dao, daoRights} = toRefs(props)
        const {t} = useI18n()
        //const { nearService } = useNearService()
        const workflowsToAdd = ref([])

        const voteLevel = voteLevelToTranslate(dao.value.voteLevels[0])
        const proposeRights = computed(() => { 
            const rights = []
            daoRights.value.forEach((right) => { 
                if(right.type === DAORightsType.Anyone || right.type === DAORightsType.Member || right.type ===  DAORightsType.TokenHolder ||  right.type === DAORightsType.Group ){
                    const trans = toTranslate(right, dao.value.groups)
                    rights.push({text: t('default.' + trans.key, trans.params), value: right.type})
                }
            })
            return rights
        })

        const voteRights = computed(() => {
            const rights = []
            proposeRights.value.forEach((right) => {
                if(right.value !== DAORightsType.TokenHolder){
                    rights.push({
                        ...right,
                        disabled: true
                    })
                }else{
                    rights.push({...right})
                }
                
            })
            return rights
        })

        const schema = computed(() => {
            return {
                workflow: 'required',
                can_propose: 'required',
                can_vote: 'required',
                activities_rights: 'required',
            }
        });
        const { handleSubmit, errors, setFieldTouched } = useForm({ validationSchema: schema});

        
        const {fetch, dataResults} = useTemplateList()

        onMounted(() => {
            fetch()
        })

       watch(() => [dataResults.value], () => {
            const workflows = loDifferenceBy(dataResults.value, dao.value.templates, 'id');
            workflowsToAdd.value = workflows.map((workflow) =>({text: workflow.name, value: workflow.id}))
            setFieldTouched('workflow', false)
        })



        const onSubmit = handleSubmit(values => {
                console.log(values);
                // nearService.value.addWorkflow(
                //     contractId.value,
                //     templateSettingsId,
                //     activity_inputs,
                //     transition_constraints,
                //     binds,
                //     obj_validators,
                //     validator_exprs,
                //     storage_key,
                //     dao.value.voteLevels[0].approveThreshold,
                //     dao.value.voteLevels[0].quorum,
                //     dao.value.voteLevels[0].duration.days,
                //     dao.value.voteLevels[0].duration.hours,
                //     dao.value.voteLevels[0].minutes,
                //     0, //depositPropose
                //     0, //depositVote
                //     0, //depositProposeReturn
                //     1.0
                // )
        }, () => {
                console.log(errors.value)
        });
        

        return {
            t,
            voteLevel,
            proposeRights,
            voteRights,
            workflowsToAdd,
            onSubmit
        }
    }
}
</script>