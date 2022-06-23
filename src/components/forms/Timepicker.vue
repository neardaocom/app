<template>
    <label v-if="labelName" :for="id" class="form-label">
        {{ labelName }}
        <TooltipLabel v-if="tooltip" :description="tooltip"/>
    </label>

    <MDBTimepicker
        v-model.trim="value"
        :hoursFormat="24"
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
    MDBTimepicker,
} from "mdb-vue-ui-kit";
import { toRefs } from '@vue/reactivity';

export default {
    components:{
        MDBTimepicker,
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
        const { value, errorMessage, meta, handleChange, handleBlur } = useField(id.value);

        return {
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