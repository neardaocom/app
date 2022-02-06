<template>
    <InputString :labelName="t('default.account_id')" id="account_id" :addon="`.${accountPostfix}`"/>

    <br/>
    <div class="text-start">
        <label for="description-id-input"  class="form-label">{{ t('default.description') }}</label>
    </div>
    <MDBWysiwyg :fixedOffsetTop="58" ref="refWysiwyg">
        <section v-html="description"></section>
    </MDBWysiwyg>
    
</template>

<script>
import InputString from '@/components/forms/InputString.vue'
import { MDBWysiwyg } from "mdb-vue-wysiwyg-editor";
import { useI18n } from 'vue-i18n';
import { useStore } from 'vuex'
import { computed, ref } from '@vue/reactivity';
import { useForm } from 'vee-validate';
import { getAccountIdPostfix } from "@/services/nearService/utils"


export default {
    components:{
        InputString,
        MDBWysiwyg,
    },
    props:{
        contractId: {
            type: String,
            required: false
        },
    },
    setup () {
        const {t} = useI18n()
        const store = useStore()   

        const factoryAccount = computed(() => (store.getters['near/getFactoryAccount']))
        const accountPostfix = computed(() => getAccountIdPostfix(factoryAccount.value))
        //const nearService = computed(() => (store.getters['near/getService']))
        //const accountId = computed(() => ( store.getters['near/getAccountId']))

        const description = ref('')

        const schema = computed(() => {
            return {
                account_id: 'required|accountExists',
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
            accountPostfix,
            description,
            onSubmit
        }
    }
}
</script>