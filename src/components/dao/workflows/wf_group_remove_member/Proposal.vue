<template>
    <Select :labelName="t('default.account_id')" id="account_id" :options="accountsDropdown" />

    <br/>
    <div class="text-start">
        <label for="description-id-input"  class="form-label">{{ t('default.description') }}</label>
    </div>
    <MDBWysiwyg :fixedOffsetTop="58" ref="refWysiwyg">
        <section v-html="description"></section>
    </MDBWysiwyg>
    
</template>

<script>
import Select from '@/components/forms/Select.vue'
import { MDBWysiwyg } from "mdb-vue-wysiwyg-editor";
import { useI18n } from 'vue-i18n';
//import { useStore } from 'vuex'
import { computed, ref, toRefs } from '@vue/reactivity';
import { useForm } from 'vee-validate';


export default {
    components:{
        Select,
        MDBWysiwyg,
    },
    props:{
        contractId: {
            type: String,
            required: true
        },
        groups: {
            type: Object,
            required: true
        },
        members: {
            type: Object,
            required: true
        }
    },
    setup (props) {
        const { members } = toRefs(props)
        const {t} = useI18n()

        const accountsDropdown= computed(() => (Object.keys(members.value).map(accountId => {return {value: accountId, text: accountId}})))

        const description = ref('')

        const schema = computed(() => {
            return {
                account_id: 'required|accountExists',
            }
        });

        const { handleSubmit, errors } = useForm({ validationSchema: schema});

        const onSubmit = handleSubmit(values => {
            values.groupId = 1
            alert(JSON.stringify(values, null, 2));
        }, () => {
                console.log(errors.value)
        });
        

        return {
            t,
            accountsDropdown,
            description,
            onSubmit
        }
    }
}
</script>