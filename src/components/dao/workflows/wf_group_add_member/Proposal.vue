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
import { computed, ref, inject } from '@vue/reactivity';
import { useForm } from 'vee-validate';
import NearUtils from "@/models/nearBlockchain/Utils";


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
        const config = inject('config')

        const {t} = useI18n()

        const adminAccountId = computed(() => (config.near.adminAccountId))
        const accountPostfix = computed(() => NearUtils.getAccountIdPostfix(adminAccountId.value))

        const description = ref('')

        const schema = computed(() => {
            return {
                account_id: `required|accountExists:${accountPostfix.value}`,
            }
        });

        const { handleSubmit, errors } = useForm({ validationSchema: schema});

        const onSubmit = handleSubmit(values => {
            values.groupId = 1 //council
            values.roles = []
            alert(JSON.stringify(values, null, 2));
        }, () => {
                console.log(errors.value)
        });
        

        return {
            t,
            adminAccountId,
            accountPostfix,
            description,
            onSubmit
        }
    }
}
</script>