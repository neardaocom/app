import { defineRule } from 'vee-validate';
import { required, numeric, max, min, alpha } from '@vee-validate/rules';
import store from '@/store'
import Decimal from 'decimal.js';
import { getAccountIdPostfix } from "@/services/nearService/utils"

const stringLocaleNumber = (value, [localeString]) => {
    if (localeString === 'en') {
        return value.match(/^([0-9]{1,3},([0-9]{3},)*[0-9]{3}|[0-9]+)(\.[0-9]+)?$/g)
    }else if (localeString === 'cs') {
        return value.match(/^([0-9]{1,3} ([0-9]{3},)*[0-9]{3}|[0-9]+)(,[0-9]+)?$/g)
    }
}

const strIsNumber = (value) => {
    return value.match(/^-?\d+\.?\d*$|^\d*\.?\d+$/g)
}

const strNumMin = (value, [min]) => {
    if (strIsNumber(value)){
        return new Decimal(value).gte(min)
    }
    return false
        
}

const strNumMax = (value, [max]) => {
    if (strIsNumber(value)){
        return new Decimal(value).lte(max)
    }
    return false
}

const accountExists = async (value: string) => {    
    try{
        const newValue = value.trim()
        const account = await store.getters['near/getService'].getAccountState(newValue + '.' + getAccountIdPostfix(store.getters['near/getFactoryAccount']))   
        if (account){
            return true
        }
        return false
    }catch(e){    
        return false
    }
}

const accountNotExists = async (value: string) => {
    const result = await accountExists(value)
    return !result
}


export default{
    install() {
        defineRule('required', required)
        defineRule('max', max)
        defineRule('min', min)
        defineRule('alpha', alpha)
        defineRule('strIsNumber', strIsNumber)
        defineRule('strNumMin', strNumMin)
        defineRule('strNumMax', strNumMax)
        defineRule('numeric', numeric)
        defineRule('accountExists', accountExists)
        defineRule('accountNotExists', accountNotExists)
        defineRule('localeNumber', stringLocaleNumber)
    },
}