import { defineRule } from 'vee-validate';
import { required, numeric, max, min, alpha, url } from '@vee-validate/rules';
import store from '@/store'
import Decimal from 'decimal.js';
import { getAccountIdPostfix } from "@/services/nearService/utils"
import moment from 'moment'

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

const accountExists = async (value: string, [accountPosfix]) => {
    try{
        // console.log("accountExists", `${value.trim()}.${accountPosfix}`)
        // console.log(store)
        const newValue = value.trim()
        const account = await store.getters['near/getService'].getAccountState(accountPosfix ? `${newValue}.${accountPosfix}` : newValue)   
        if (account){
            return true
        }
        return false
    } catch(e) {
        return false
    }
}

const accountNotExists = async (value: string, [accountPosfix]) => {
    const result = await accountExists(value, [accountPosfix])
    return !result
}

const minDate = (value, [min, format]) => {
    const formDate = moment(value, format).toDate()
    if (formDate.valueOf() < min.valueOf()){
        return false
    }
    return true
}

const maxDate = (value, [max, format]) => {
    const formDate = moment(value, format).toDate()
    if (formDate.valueOf() > max.valueOf()){
        return false
    }
    return true
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
        defineRule('url', url)
        defineRule('minDate', minDate)
        defineRule('maxDate', maxDate)
    },
}