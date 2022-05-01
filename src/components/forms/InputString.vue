<template>
    <label v-if="labelName" :for="id" class="form-label float-start">
        {{ labelName }}
        <TooltipLabel v-if="tooltip" :description="tooltip"/>
    </label>
    <MDBInput 
        inputGroup 
        wrapperClass="mb-4"
        :disabled="disabled"
        :id="id" 
        v-model="value" 
        :isValidated="meta.touched"
        :isValid="!errorMessage"
        :invalidFeedback="errorMessage" 
        :aria-describedby="id"
        @change="handleChange"
        @blur="handleBlur($event), handleChange($event)"
        @input="handleBlur"
    >
        <template v-if="prepend" #prepend>
            <span class="input-group-text" id="id">{{ prepend }}</span>
        </template>
        <span v-if="addon" class="input-group-text" :id="id">{{ addon }}</span>
        <MDBBtn v-if="buttonText" :id="`${id}-add`" @click="emit('buttonClick')" :color="color">
            {{ buttonText}}
        </MDBBtn>
    </MDBInput>

</template>

<script>
import { useField } from 'vee-validate';
import TooltipLabel from '@/components/forms/TooltipLabel.vue'

import {
    MDBInput,
    MDBBtn
} from "mdb-vue-ui-kit";
import { toRefs } from '@vue/reactivity';

export default {
    components:{
        MDBInput,
        MDBBtn,
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
        prepend: {
            type: String,
            required: false
        },
        addon: {
            type: String,
            required: false
        },
        disabled:{
            type: Boolean,
            default: false,
            required: false
        },
        buttonText:{
            type: String,
            required: false
        },
        color:{
            type: String,
            required: false,
            default: 'primary'
        }
    },
    emits: ['buttonClick'],
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