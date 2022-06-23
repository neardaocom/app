<template>
    <div>
        <div class="d-flex justify-content-between">
            <label v-if="labelName" :for="id" class="form-label">
                {{ labelName }}
                <TooltipLabel v-if="tooltip" :description="tooltip"/>
            </label>
            <div v-if="balance" class="small">{{`${t('default.balance')}: ${balanceLocale}`}}</div>
        </div>
        <MDBInput 
            inputGroup 
            wrapperClass="mb-4"
            :disabled="disabled"
            :id="id" 
            ref="input" 
            v-model="displayValue" 
            :isValidated="meta.touched" 
            :isValid="!errorMessage" 
            :invalidFeedback="errorMessage"
            @change="handleChange"
            @blur="handleBlur($event), handleChange($event)"
            @input="handleBlur"
        >
            <MDBBtn v-if="max" @click="valueToMax" :id="id" outline="primary" :ripple="{ color: 'dark' }">
                {{t('default.max')}}
            </MDBBtn>
            <template v-if="prepend" #prepend>
                <span class="input-group-text" id="id">{{ prepend }}</span>
            </template>
            <span v-if="addon" class="input-group-text" :id="id">{{ addon }}</span>
        </MDBInput>
    </div>
</template>


<script>
import { useI18n } from "vue-i18n";
import { computed, ref, toRefs } from '@vue/reactivity'
import { useField } from 'vee-validate';
import LocaleHelper from '@/models/utils/LocaleHelper'
import TooltipLabel from '@/components/forms/TooltipLabel.vue'
import {
  MDBInput,
  MDBBtn
} from "mdb-vue-ui-kit";
import Decimal from 'decimal.js'

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
        balance: {
            type: [Object, Number, String],
            required: false
        },
        max: {
            type: [Object, Number, String],
            required: false
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
        }
    },
    setup(props) {
        const input = ref(null)
        const {max, balance, id} = toRefs(props)
        const { t, locale } = useI18n();
        const { value, errorMessage, meta, handleChange, handleBlur } = useField(id.value);


        const displayValue = computed({
            get: () => {
                return value.value            
            },
            set: (v) => {
                value.value = v
            }
        })
        
        // const displayValue = computed({
        //     get: () => {
        //         // if (meta.valid){
        //         //     if (locale.value === 'en' ){
        //         //         console.log(value.value.replace(/[^0-9,]^,^\./g,''));
        //         //         return value.value.replace(/[^0-9,]^,^\./g,'')
        //         //     }
        //         //     else if(locale.value === 'cs'){
        //         //         return value.value.replace(/[^0-9]/g,'')
        //         //     }
        //         // }
        //         // return value.value
        //         //     if (locale.value === 'en' ){
        //         //         console.log(value.value.replace(/[^0-9]^,^\./g,''));
        //         //         return value.value.replace(/[^0-9]/g,'')
        //         //     }
        //         //     else if(locale.value === 'cs'){
        //         //         return value.value.replace(/[^0-9]/g,'')
        //         //     }
                
        //          return LocaleHelper.stringNumberToLocale(value.value, locale.value)

        //     },
        //     set: (v) => {
        //         let result
        //         if (locale.value === 'cs' ){
        //             result = v.replace(/,/g,'.')
        //             result = result.replace(/[^0-9.]/g,'')
        //         }else{ // locale.value === 'en' ... so far we only have these two
        //             result = v.replace(/[^0-9.]/g,'')
        //             console.log('set', result);
        //         }
        //         console.log(result);
        //         //input.value.inputValue = LocaleHelper.stringNumberToLocale(result, locale.value)
        //         value.value = result
        //     }
        // })

        const valueToMax = () => displayValue.value = new Decimal(max.value).toFixed()
        const balanceLocale = computed(() => LocaleHelper.stringNumberToLocale(new Decimal(balance.value).toFixed(), locale.value))

        return{
            t,
            input,
            value,
            errorMessage,
            displayValue,
            meta,
            handleChange,
            valueToMax,
            balanceLocale, 
            handleBlur
        }
        
    },
}
</script>
