<template>
    <InputString :labelName="t('default.account_id')" id="account_id" :addon="`.${accountPostfix}`"/>
    <InputNumber :labelName="t('default.amount')" id="amount" :balance="availableNearAmount" :max="availableNearAmount" addon="Ⓝ"/>

    <br/>
    <div class="text-start">
        <label for="description-id-input"  class="form-label">{{ t('default.description') }}</label>
    </div>
    <MDBWysiwyg :fixedOffsetTop="58" ref="refWysiwyg">
    </MDBWysiwyg>
</template>

<script>
import InputNumber from '@/components/forms/InputNumber.vue'
import InputString from '@/components/forms/InputString.vue'
import { MDBWysiwyg } from "mdb-vue-wysiwyg-editor";
import { useI18n } from 'vue-i18n';
import { computed, ref, toRefs } from '@vue/reactivity';
import { useForm } from 'vee-validate';
import { useNear, useIPFS } from "@/hooks/vuex";
import NearUtils from '@/models/nearBlockchain/Utils';
import moment from 'moment'
import { makeFileFromString } from "@/models/services/ipfsService/IpfsService.js"
import { inject } from '@vue/runtime-core';
import { useAnalytics } from '@/hooks/treasury';

// import {
//   MDBRadio,
//   MDBBtnGroup,
// } from "mdb-vue-ui-kit";

export default {
    components:{
        InputString,
        InputNumber,
        MDBWysiwyg,
        // MDBRadio,
        // MDBBtnGroup,
    },
    props:{
        contractId: {
            type: String,
            required: true
        },
        template: {
            type: Object,
            required: true
        }
    },
    setup (props) {
        const { contractId, template } = toRefs(props)
        const {t} = useI18n()
        const dao = inject('dao')
        const loader = inject('loader')
        const config = inject('config')
        const {availableNearAmount} = useAnalytics(dao, loader)

        console.log();

        const { nearService, accountId } = useNear(config)
        const { ipfsService } = useIPFS()
        const accountPostfix = computed(() => NearUtils.getAccountIdPostfix(config.value.near.adminAccountId))
        const notify = inject('notify')
        const refWysiwyg = ref(null)

        const schema = computed(() => {
            return {
                account_id: `required|accountExists:${accountPostfix.value}`,
                amount: `required|strIsNumber|strNumMin:0|strNumMax:${availableNearAmount.value}`
            }
        });

        const { handleSubmit, errors } = useForm({ validationSchema: schema});

        const onSubmit = handleSubmit(async () => {
            let ipfs_cid = ''
            if(refWysiwyg.value.getCode()){
                try {
                    const name = `${accountId.value}-wf_near_send-proposal-desc-${moment().valueOf()}`
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
            
            nearService.value.addProposal(
                null,
                contractId.value,
                template.value.id,
                template.value.settings[0].id,
                ipfs_cid,
            
                `wf_near_send-${moment().valueOf()}`,
                1.0
            )
            
        }, () => {
                console.log(errors.value)
        });
        

        return {
            t,
            dao,
            accountPostfix,
            onSubmit,
            refWysiwyg,
            availableNearAmount
        }
    },
}
</script>
