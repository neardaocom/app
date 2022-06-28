<template>
    <Select :labelName="t('group')" id="group" :options="groups" />
    <Select :labelName="t('rights')" id="rights" :options="rights"/>

    <MDBWysiwyg :fixedOffsetTop="58" ref="refWysiwyg">
        <section v-html="description"></section>
    </MDBWysiwyg>
    
</template>

<script>
import Select from '@/components/forms/Select.vue'
import { MDBWysiwyg } from "mdb-vue-wysiwyg-editor";
import { useI18n } from 'vue-i18n';
//import { useStore } from 'vuex'
import { computed, ref } from '@vue/reactivity';
import { useForm } from 'vee-validate';

export default {
    components:{
        Select,
        MDBWysiwyg,
    },
    props:{
        contractId: {
            type: String,
            required: false
        },
        groups: {
            type: Object,
            required: true
        },
        rights:{
            type: Object,
            required: true
        }
    },
    setup () {
        const {t} = useI18n()

        const description = ref('')

        const schema = computed(() => {
            return {
                group: 'required',
                rights: 'required'
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
            description,
            onSubmit
        }
    }
}
</script>