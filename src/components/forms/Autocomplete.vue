<template>
    <div class="text-start">
        <label v-if="labelName" :for="id" class="form-label">
            {{ labelName }}
            <TooltipLabel v-if="tooltip" :description="tooltip"/>
        </label>
    </div>
    <MDBAutocomplete
        :class="[!meta.touched ?  ''  
            : errorMessage ? 'is-invalid' : 'is-valid']"
        :id="id"
        :no-results-text="t('no_results')"
        :displayValue="displayValue"
        :itemContent="itemTemplate"
        v-model="value"
        :filter="filter"
        :maxlength="100"
        @change="handleChange"
        @blur="handleBlur($event), handleChange($event)"
        @input="handleBlur"
    />
</template>

<script>
import { useI18n } from 'vue-i18n'
import {
    MDBAutocomplete
} from "mdb-vue-ui-kit";
import TooltipLabel from '@/components/forms/TooltipLabel.vue'
import { toRefs } from '@vue/reactivity';
import { useField } from 'vee-validate';

export default {
    components:{
        MDBAutocomplete,
        TooltipLabel
    },
    props:{
        labelName: {
            type: String,
            required: false 
        },
        tooltip: {
            type: String,
            required: false 
        },
        id: {
            type: String,
            required: true 
        },
        options: {
            type: Object,
            required: true
        },
        filtredBy: {
            type: Function,
            required: false
        },
        valueDisplayed: {
            type: Function,
            required: false
        },
        itemContent:{
            type: Function,
            required: false
        }
    },
    setup (props) {
        const {id, options, filtredBy, valueDisplayed, itemContent} = toRefs(props)
        const {t} = useI18n()  

        const { value, errorMessage, meta, handleChange, handleBlur } = useField(id.value);


        const filter = filtredBy.value ? filtredBy.value
            :   (value) => {
                    return options.value.filter(item => {
                        return item.toLowerCase().startsWith(value.toLowerCase())
                    })
                } 
        
        const displayValue = valueDisplayed.value ? valueDisplayed.value
            :   (value) => {
                    return value
                }

        const itemTemplate = itemContent.value ? itemContent.value 
            :   (result) => {
                    return result
                };
        
        return {
            t,
            value,
            errorMessage,
            meta,
            handleChange,
            handleBlur,
            filter,
            displayValue,
            itemTemplate
        }
    }
}
</script>

