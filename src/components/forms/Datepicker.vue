<template>
    <label v-if="labelName" :for="id" class="form-label">
        {{ labelName }}
        <TooltipLabel v-if="tooltip" :description="tooltip"/>
    </label>
    <MDBDatepicker
        v-model="value"
        :format="t('_datepicker_format')"
        @change="handleChange"
        @blur="handleBlur($event), handleChange($event)"
        @input="handleBlur"
    />
    <FromErrorMessage class="mt-3 mb-4" :show="errorMessage !== null" :message="errorMessage"/>

</template>

<script>
import { useField } from 'vee-validate';
import TooltipLabel from '@/components/forms/TooltipLabel.vue'
import FromErrorMessage from '@/components/forms/FormErrorMessage.vue'

import {
    MDBDatepicker,
} from "mdb-vue-ui-kit";
import { toRefs } from '@vue/reactivity';
import { useI18n } from 'vue-i18n';

export default {
    components:{
        MDBDatepicker,
        FromErrorMessage,
        TooltipLabel
    },
    props:{
        labelName: {
            type: String,
            required: false 
        },
        id: {
            type: String,
            required: true 
        },
        tooltip: {
            type: String,
            required: false
        },
    },
    setup (props, {emit}) {
        const {id} = toRefs(props)
        const {t} = useI18n()
        const { value, errorMessage, meta, handleChange, handleBlur } = useField(id.value);

        return {
            t,
            value,
            errorMessage,
            meta,
            handleChange,
            handleBlur,
            emit
        }
    }
}
</script>