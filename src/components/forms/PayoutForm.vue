<template>
    <InputString :labelName="t('default.account_id')" id="account_id" :addon="`.${accountPostfix}`"/>
    <InputNumber :labelName="t('default.amount')" id="amount" :addon="amountPostfix"/>

    <div class="text-center mt-2">
        <MDBBtnGroup>
            <MDBRadio :btnCheck="true" :wrap="false" labelClass="btn btn-secondary" label="NEAR" name="options" value="near"
            v-model="formAsset" />
            <MDBRadio :btnCheck="true" :wrap="false" labelClass="btn btn-secondary" :label="tokenName" name="options" value="token"
            v-model="formAsset" />
        </MDBBtnGroup>
    </div>

    <br/>
    <div class="text-start">
        <label for="description-id-input"  class="form-label">{{ t('default.description') }}</label>
    </div>
    <MDBWysiwyg :fixedOffsetTop="58" ref="refWysiwyg">
        <section v-html="description"></section>
    </MDBWysiwyg>
    
</template>

<script>
import InputNumber from '@/components/forms/InputNumber.vue'
import InputString from '@/components/forms/InputString.vue'
import { MDBWysiwyg } from "mdb-vue-wysiwyg-editor";
import { useI18n } from 'vue-i18n';
import { useStore } from 'vuex'
import { computed, ref, toRefs } from '@vue/reactivity';
import { useForm } from 'vee-validate';
import { getAccountIdPostfix } from "@/services/nearService/utils"

import {
  MDBRadio,
  MDBBtnGroup,
} from "mdb-vue-ui-kit";

export default {
    components:{
        InputString,
        InputNumber,
        MDBWysiwyg,
        MDBRadio,
        MDBBtnGroup
    },
    props:{
        contractId: {
            type: String,
            required: false
        },
        tokenName: {
            type: String,
            required: true
        }
    },
    setup (props) {
        const {tokenName} = toRefs(props)
        const {t} = useI18n()
        const store = useStore()   

        const factoryAccount = computed(() => (store.getters['near/getFactoryAccount']))
        const accountPostfix = computed(() => getAccountIdPostfix(factoryAccount.value))
        //const nearService = computed(() => (store.getters['near/getService']))
        //const accountId = computed(() => ( store.getters['near/getAccountId']))

        const formAsset = ref('near')
        const description = ref('')

        const amountPostfix = computed(() => {
            let postfix = 'Ⓝ'
            if (formAsset.value == 'token') {
                postfix = tokenName.value
            }
            return postfix
        })

        const schema = computed(() => {
            return {
                account_id: `required|accountExists:${accountPostfix}`,
                amount: 'required|strIsNumber|strNumMin:0|strNumMax:1000000.0'
            }
        });

        const { handleSubmit, errors } = useForm({ validationSchema: schema});

        const onSubmit = handleSubmit(values => {
            console.log(values);
            alert(JSON.stringify(values, null, 2));
        }, () => {
                console.log(errors.value)
        });
        

        return {
            t,
            formAsset,
            amountPostfix,
            description,
            accountPostfix,
            onSubmit
        }
    }
}
</script>