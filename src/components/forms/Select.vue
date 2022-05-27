<template>
    <span>
        <label :for="id" class="form-label">{{ labelName }}</label>
        <MDBSelect 
            :filter="filter"
            :preselect="true" 
            v-model:selected="value"
            v-model:options="typeOptions"
            :no-results-text="t('default.no_results')"
            wrapperClass="mb-4"
            :id="id"
            :multiple="multiple"
            :isValidated="meta.touched"
            :isValid="!errorMessage"
            :invalidFeedback="errorMessage" 
            @blur="handleBlur"
            @change="handleBlur"
        />
    </span>
</template>

<script>
import {
    MDBSelect,
} from "mdb-vue-ui-kit";
import { useI18n } from 'vue-i18n';
import { useField } from 'vee-validate';
import { toRefs } from '@vue/reactivity';

export default {
    components:{
        MDBSelect
    },
    props:{
        labelName:{
            type: String,
            required: true
        },
        id: {
            type: String,
            required: true 
        },
        options: {
            type: Object,
            required: true
        },
        filter: {
            type: Boolean,
            required: false,
            default: false
        },
        multiple: {
            type: Boolean,
            required: false,
            default: false
        }
    },

    setup (props) {
        const {options: typeOptions, id} = toRefs(props)
        const {t} = useI18n()
        const { value, errorMessage, meta, handleBlur } = useField(id.value);
        return {
            t,
            value,
            errorMessage,
            meta,
            typeOptions,
            handleBlur
        }
    }
}
</script>