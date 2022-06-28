import { defineRule,  configure } from 'vee-validate';
import { required, numeric, max, min, alpha, url } from '@vee-validate/rules';
import { localize } from '@vee-validate/i18n';
// import store from '@/store'
import Decimal from 'decimal.js';
import moment from 'moment'
import loToNumber from "lodash/toNumber";
import loIsNil from "lodash/isNil";
import _ from "lodash";
import { useServiceStore } from '@/store/service';

const stringLocaleNumber = (value, [localeString]) => {
    if (localeString === 'en') {
        return value.match(/^([0-9]{1,3},([0-9]{3},)*[0-9]{3}|[0-9]+)(\.[0-9]+)?$/g)
    }else if (localeString === 'cs') {
        return value.match(/^([0-9]{1,3} ([0-9]{3},)*[0-9]{3}|[0-9]+)(,[0-9]+)?$/g)
    }
}

const strIsNumber = (value) => {
    if (typeof value !== 'number')
        return (value !== undefined && value.length > 0) ? value.match(/^-?\d+\.?\d*$|^\d*\.?\d+$/g) : true
    else
        return true
}

const strNumMin = (value, [min]) => {
    if (loIsNil(value) || value == '') {
        return true
    }
    if (strIsNumber(value)){
        return new Decimal(value).gte(min)
    }
    return false
}

const strNumMax = (value, [max]) => {
    if (loIsNil(value) || value == '') {
        return true
    }
    if (strIsNumber(value)){
        return new Decimal(value).lte(max)
    }
    return false
}

const accountExists = async (value: string, [accountPosfix]) => {
    try{
        if (value) {
            const store = useServiceStore()
            const newValue = value.trim()
            const accountService = await store.servicePool?.getAccount(accountPosfix ? `${newValue}.${accountPosfix}` : newValue)
            const account = await accountService?.state()
            if (account){
                return true
            }
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
    if (formDate.valueOf() < loToNumber(min)){
        return false
    }
    return true
}

const maxDate = (value, [max, format]) => {
    const formDate = moment(value, format).toDate()
    // console.log('validatorMaxDate', formDate.valueOf(), maxDate.valueOf())
    if (formDate.valueOf() > loToNumber(max)){
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

        configure({
            // Generates an English message locale generator
            generateMessage: localize('en', {
              messages: {
                required: 'This field is required',
                max: 'This field is too long',
                min: 'This field is too short',
                alpha: 'This field may only contain alphabetic characters',
                strIsNumber: 'This field must be a valid number',
                strNumMin: 'This field is too low',
                strNumMax: 'This field is too high',
                numeric: 'This field may only contain numbers',
                accountExists: 'Account does not exist',
                accountNotExists: 'Account already exists',
                localeNumber: 'This field must be a valid number',
                url: 'This field must be a valid URL',
                minDate: 'The date you entered is invalid',
                maxDate: 'The date you entered is invalid',

              },
            }),
          });
    },


}