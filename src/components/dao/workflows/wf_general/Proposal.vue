<template>
    <InputString :labelName="t('default.title')" id="title" />

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
//import { useStore } from 'vuex'
import { computed, ref } from '@vue/reactivity';
import { useForm } from 'vee-validate';

export default {
    components:{
        InputString,
        MDBWysiwyg,
    },
    props:{
        contractId: {
            type: String,
            required: true
        },
    },
    setup () {
        const {t} = useI18n()

        const description = ref('')

        const schema = computed(() => {
            return {
                title: 'required|min:5|max:40',
            }
        });

        const { handleSubmit, errors } = useForm({ validationSchema: schema});

        const onSubmit = handleSubmit(values => {
            let ipfsError = false
            if (description.value){
            }
            
            if(!ipfsError){
                console.log(values.cid);
            }
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