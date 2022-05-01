import _ from "lodash"
import { Validation, ValidationParamsMin, ValidationParamsMinDate, ValidationParamsMax, ValidationParamsMaxDate } from "./types/validations";

export default class Validator {

    static successValidation(): Validation { return { valid: true } }
    static errorValidation(message: string, params: any = {}): Validation { return { valid: false, message: 'validator_' + message, params: params } }

    static isValid(errors: any): boolean {
        // console.log(Object.values(errors))
        return !Object.values(errors).map(value => _.toString(value) === '').includes(false)
    }

    static requiredValidator(value: string): Validation {
        let validation = this.successValidation()
        if (_.toString(value) === '') {
            validation = this.errorValidation('required', {})
        }
        return validation
    }

    static urlValidator(value: string): Validation {
        let validation = this.successValidation()
        const validUrl = require('valid-url');
        if (validUrl.isWebUri(value) == undefined) {
            validation = this.errorValidation('invalid_url', {})
        }

        return validation
    }

    static requiredArrayValidator(value: any): Validation {
        let validation = this.successValidation()
        if (Array.isArray(value) !== true || value.length === 0) {
            validation = this.errorValidation('required', {})
        }
        return validation
    }

    static nearRootAccountValidator(value: string): Validation {
        let validation = this.successValidation()
        const re = /^(([a-z\d]+[-_])*[a-z\d]+)*([a-z\d]+[-_])*[a-z\d]+$/
        if (value.length < 2) {
            validation = this.errorValidation('at_least_characters', { min: 2 })
        } else if (value.length > 64) {
            validation = this.errorValidation('maximum_characters', { max: 64 })
        } else if (!re.test(value)) {
            validation = this.errorValidation('invalid_near_root_account', {})
        }

        return validation
    }

    static nearAccountValidator(value: string): Validation {
        let validation = this.successValidation()
        const re = /^([a-z\d]+[a-z\d-_]*[a-z\d]+)([.][a-z\d]+[a-z\d-_]*[a-z\d]+)*$/
        if (value.length < 2) {
            validation = this.errorValidation('at_least_characters', { min: 2 })
        } else if (value.length > 64) {
            validation = this.errorValidation('maximum_characters', { max: 64 })
        } else if (!re.test(value)) {
            validation = this.errorValidation('invalid_near_account', {})
        }

        return validation
    }

    static nearAccountExistsValidator(value: string): Validation {
        let validation = this.successValidation()
        if (value) {
            validation = this.errorValidation('near_account_exists', {})
        }

        return validation
    }

    static councilAccountValidator(value: string): Validation {
        let validation = this.successValidation()
        const re = /^(([a-z\d]+[-_])*[a-z\d]+)*([a-z\d]+[-_])*[a-z\d].(near|testnet)+$/
        if (value.length < 2) {
            validation = this.errorValidation('at_least_characters', { min: 2 })
        } else if (value.length > 64) {
            validation = this.errorValidation('maximum_characters', { max: 64 })
        } else if (!re.test(value)) {
            validation = this.errorValidation('invalid_council_account', {})
        }

        return validation
    }

    static isAlphanumericUpperecase(value: string): Validation {
        let validation = this.successValidation()
        const re = /^[A-Z0-9]+$/
        if (!re.test(value)){
            validation = this.errorValidation('alphanumeric_uppercase', {})
        }
        return validation
    } 

    static minNumber(value: number, params: ValidationParamsMin): Validation {
        let validation = this.successValidation()
        if (value < params.min) {
            validation = this.errorValidation('min_number', params)
        }
        return validation;
    }

    static maxNumber(value: number, params: ValidationParamsMax): Validation {
        let validation = this.successValidation()
        if (value > params.max) {
            validation = this.errorValidation('max_number', params)
        }
        return validation;
    }

    static sharesValidator(value: number): Validation {
        let validation = this.maxNumber(value, { max: 100})
        if (validation.valid === false) {
            validation = this.errorValidation('shares_sum', {})
        }
        return validation
    }

    static isNumber(value: string): Validation {
        let validation = this.successValidation()
        const re = /^\d+\.?\d*$/
        if (!re.test(value)) {
            validation = this.errorValidation('not_number', {})
        }
        return validation;
    }

    static minLength(value: string, params: ValidationParamsMin): Validation {
        let validation = this.successValidation()
        if (_.toString(value).length < params.min) {
            validation = this.errorValidation('at_least_characters', params)
        }
        return validation;
    }

    static maxLength(value: string, params: ValidationParamsMax): Validation {
        let validation = this.successValidation()
        if (_.toString(value).length > params.max) {
            validation = this.errorValidation('maximum_characters', params)
        }
        return validation;
    }

    static minDate(value: Date, params: ValidationParamsMinDate, d: any): Validation {
        let validation = this.successValidation()
        if (value.valueOf() < params.min.valueOf()) {
            validation = this.errorValidation('min_date', { min: d(params.min) })
        }
        return validation;
    }

    static maxDate(value: Date, params: ValidationParamsMaxDate, d: any): Validation {
        let validation = this.successValidation()
        if (value.valueOf() > params.max.valueOf()) {
            validation = this.errorValidation('max_date', { max: d(params.max) })
        }
        return validation;
    }
}