<template>
    <InputString :labelName="t('default.account_id')" id="account_id" :addon="`.${accountPostfix}`"/>
    <InputNumber :labelName="t('default.amount')" id="amount" :addon="amountPostfix"/>

    <!-- <div class="text-center mt-2">
        <MDBBtnGroup>
            <MDBRadio :btnCheck="true" :wrap="false" labelClass="btn btn-secondary" label="NEAR" name="options" value="near"
            v-model="formAsset" />
            <MDBRadio :btnCheck="true" :wrap="false" labelClass="btn btn-secondary" :label="tokenName" name="options" value="token"
            v-model="formAsset" />
        </MDBBtnGroup>
    </div> -->

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
import { makeFileFromString } from "@/services/ipfsService/IpfsService.js"
import { inject } from '@vue/runtime-core';

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
        tokenName: {
            type: String,
            required: true
        },
        template: {
            type: Object,
            required: true
        },
    },
    setup (props) {
        const { tokenName, contractId, template } = toRefs(props)
        const {t} = useI18n()

        const { nearService, factoryAccount, accountId } = useNear()
        const { ipfsService } = useIPFS()
        const accountPostfix = computed(() => NearUtils.getAccountIdPostfix(factoryAccount.value))
        //const accountId = computed(() => ( store.getters['near/getAccountId']))
        //const logger = inject('logger')
        const notify = inject('notify')

        const formAsset = ref('near')
        const refWysiwyg = ref(null)


        const amountPostfix = computed(() => {
            let postfix = 'Ⓝ'
            if (formAsset.value == 'token') {
                postfix = tokenName.value
            }
            return postfix
        })

        const schema = computed(() => {
            return {
                account_id: `required|accountExists:${accountPostfix.value}`,
                amount: 'required|strIsNumber|strNumMin:0|strNumMax:1000000.0'
            }
        });

        const { handleSubmit, errors } = useForm({ validationSchema: schema});

        const onSubmit = handleSubmit(async () => {
            // if(formAsset.value === 'near'){
            //     values.nearAmount = values.amount
            // }else{
            //     values.tokenAmount = values.amount
            // }

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
            formAsset,
            amountPostfix,
            accountPostfix,
            onSubmit,
            refWysiwyg,
        }
    },
}
</script>
