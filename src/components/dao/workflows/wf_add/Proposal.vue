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
            <Select :labelName="t('default.wf_activities_rights')" id="activities_rights" :options="activitiesRights" />   
        </div>
    </div> 

    <div class="text-start">
        <label for="description-id-input"  class="form-label">{{ t('default.description') }}</label>
    </div>
    <MDBWysiwyg :fixedOffsetTop="58" ref="refWysiwyg">
    </MDBWysiwyg>
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
import { useNear, useIPFS } from "@/hooks/vuex";
import { inject } from '@vue/runtime-core';
import { makeFileFromString } from "@/services/ipfsService/IpfsService.js"
import loCloneDeep from "lodash/cloneDeep";
import loSplit from 'lodash/split'
import loFind from 'lodash/find'
import loFill from 'lodash/fill'
import { getRandom } from '@/utils/integer'
import moment from 'moment'
import { MDBWysiwyg } from "mdb-vue-wysiwyg-editor";
import { rightAnyone } from "@/data/dao";


export default {
    components:{
        Select,
        MDBWysiwyg
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
        template: {
            type: Object,
            required: true
        }
    },
    setup (props) {
        const { template, contractId, dao, daoRights} = toRefs(props)
        const { t } = useI18n()
        const { nearService, accountId } = useNear()
        const  ipfsService  = useIPFS()

        //const logger = inject('logger')
        const notify = inject('notify')

        const workflowsToAdd = ref([])
        const refWysiwyg = ref(null)

        const voteLevel = voteLevelToTranslate(dao.value.voteLevels[0])
        const proposeRights = computed(() => { 
            const rights = []
            daoRights.value.forEach((right, index) => {  
                if(right.type === DAORightsType.Anyone || right.type === DAORightsType.Member || right.type ===  DAORightsType.TokenHolder ||  right.type === DAORightsType.Group ){
                    const trans = toTranslate(right, dao.value.groups)
                    rights.push({text: t('default.' + trans.key, trans.params), value: index})
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
        const activitiesRights =computed(() => loCloneDeep(proposeRights.value))

        const schema = computed(() => {
            return {
                workflow: 'required',
                can_propose: 'required',
                can_vote: 'required',
                activities_rights: 'required',
            }
        });
        const { handleSubmit, errors, setFieldTouched, values } = useForm({ validationSchema: schema});

        // fetch template list
        const {fetch, dataResults} = useTemplateList()
        onMounted(() => {
            fetch(dao.value.templates.map((item) => item.code))
        })
       watch(() => [dataResults.value], () => {
            const workflows = loDifferenceBy(dataResults.value, dao.value.templates, 'code');
            console.log(workflows);
            console.log(dataResults.value);
            workflowsToAdd.value = workflows.map((workflow) =>({text: t('default.wf_templ_' + workflow.code), value: workflow.id, code: workflow.code}))
            setFieldTouched('workflow', false)
        })

        const onSubmit = handleSubmit(async (values) => {
            const canProposeArray = loSplit(values.can_propose, ',')
            const canPropose = canProposeArray.map((right) => (daoRights.value[right]))
            const workflowName = loFind(workflowsToAdd.value, { 'value': values.workflow })
            const storageKey = `${workflowName.text}-${values.workflow}-${getRandom(1, 999)}-${moment().valueOf()}`

            // load templete, to count number of activities
            const loadTemplate = await nearService.value.providerGet(values.workflow) // TODO: try, catch

            const numActivities = loadTemplate[0].activities.length - 1
            const activitiesRights = loFill(Array(numActivities), [daoRights.value[values.activities_rights]])
            // Bounty
            if (values.workflow === 8) { // TODO: Move to code
                console.log('Bounty')
                activitiesRights[0] = [rightAnyone]
            }

            const transitionsConstraints = loadTemplate[0].transitions.map((trans) => {
                return trans.map(() => {
                    return {'transition_limit': 10, 'cond': null}
                })
            })

            
            let ipfs_cid = ''
            if(refWysiwyg.value.getCode()){
                try {
                    const name = `${accountId.value}-wf_add-proposal-desc-${moment().valueOf()}`
                    ipfs_cid = await ipfsService.value.storeFiles(makeFileFromString(refWysiwyg.value.getCode(), name), name)
                } catch(e){
                    //logger.error('D', 'app@components/dao/ModalGeneral', 'StoreFile-ipfs', 'File saving to ipfs failed')
                    //logger.error('B', 'app@components/dao/ModalGeneral', 'StoreFile-ipfs', 'File saving to ipfs failed')
                    notify.danger(t('default.notify_save_file_ipfs_fail_title'), t('default.notify_ipfs_fail') + " " + t('default.notify_save_file_ipfs_fail_message'))
                    notify.flush()
                    console.log(e);
                    return
                }
            }

            nearService.value.addWorkflow(
                contractId.value,
                template.value.settings[0].id,
                transitionsConstraints, //transition_constraints,
                daoRights.value[values.can_vote],
                canPropose,
                activitiesRights,
                ipfs_cid, //desc
                [{'U16': values.workflow}], //binds
                storageKey, //storage_key: string, name wokflow, id, provider, date  
                dao.value.voteLevels[0].approveThreshold, // TODO: Resolve vote level
                dao.value.voteLevels[0].quorum,
                dao.value.voteLevels[0].duration.days,
                dao.value.voteLevels[0].duration.hours,
                dao.value.voteLevels[0].duration.minutes,
                '0', //depositPropose
                '0', //depositVote
                0, //depositProposeReturn
                1.0
            )
        }, () => {
                console.log(errors.value)
        });
        

        return {
            t,
            voteLevel,
            proposeRights,
            voteRights,
            workflowsToAdd,
            activitiesRights,
            onSubmit,
            values,
            errors,
            refWysiwyg
        }
    }
}
</script>
