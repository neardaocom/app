<template>
    <!-- Title -->
    <InputString :labelName=" t('default.title')" id="title"/>
    <!-- Amount -->
    <InputNumber :labelName=" t('default.amount')" id="amount" :addon="'Ⓝ'"/>
    <!-- Deposit -->
    <InputNumber :labelName=" t('default.deposit')" id="deposit" :addon="'Ⓝ'"/>
    <br/>
    <div v-if="false" class="text-start">
        <label for="description-id-input"  class="form-label">{{ t('default.description') }}</label>
    </div>
    <MDBWysiwyg v-if="false" :fixedOffsetTop="58" ref="refWysiwyg">
    </MDBWysiwyg>
</template>

<script>
import InputString from '@/components/forms/InputString.vue'
import InputNumber from '@/components/forms/InputNumber.vue'
import { useI18n } from 'vue-i18n';
import { computed, ref, toRefs } from '@vue/reactivity';
import { useForm } from 'vee-validate';
import decimal from "decimal.js";
import NearUtils from '@/models/nearBlockchain/Utils';
import { useNear } from "@/hooks/vuex";
// import { makeFileFromString } from "@/models/services/ipfsService/IpfsService.js"
//import { inject } from '@vue/runtime-core';
import { MDBWysiwyg } from "mdb-vue-wysiwyg-editor";
import { generateStorageKey } from "@/models/dao/DaoProposal";

export default {
    components:{
        InputString, InputNumber,
        MDBWysiwyg,
    },
    props:{
        contractId: {
            type: String,
            required: false
        },
        template: {
            type: Object,
            required: true
        },
        proposalCount: {
            type: Number,
            required: false
        },
    },
    setup (props) {
        const {t} = useI18n()

        const { contractId, template, proposalCount } = toRefs(props)

        const { nearService } = useNear()
        // const { nearService, accountId } = useNear()
        //const  ipfsService  = useIPFS()

        //const logger = inject('logger')
        //const notify = inject('notify')

        const refWysiwyg = ref(null)

        const schema = computed(() => {
            return {
                amount: 'required|strIsNumber|strNumMin:1|strNumMax:1000000000.0',
                deposit: 'required|strIsNumber|strNumMin:0|strNumMax:1000000000.0',
            }
        });
        const { handleSubmit, errors } = useForm({ validationSchema: schema});

        const onSubmit = handleSubmit(async values => {
            let ipfs_cid = ''
            /*
            if(refWysiwyg.value.getCode()){
                try {
                    const name = `${accountId.value}-wf_bounty-proposal-desc-${moment().valueOf()}`
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
            */

            nearService.value.addProposal(
                null,
                contractId.value,
                template.value.id,
                template.value.settings[0].id,
                ipfs_cid,
                [
                    {U128: NearUtils.nearToYocto(decimal(values.amount).toFixed())},
                    {U128: NearUtils.nearToYocto(decimal(values.deposit).toFixed())},
                    {String: values.title},
                ],
                'wf_bounty-' + generateStorageKey(proposalCount.value),
                1.0
            )
        }, () => {
            console.log(errors.value)
        });
        

        return {
            t,
            onSubmit,
            refWysiwyg
        }
    }
}
</script>
