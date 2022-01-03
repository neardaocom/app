import _ from "lodash"
import { AppError } from "./error";

export class ValidationError extends AppError {}

export type Validation = {
    valid: boolean;
    message?: string;
    params?: any;
};

export type ValidationParamsMin = {
    min: number;
};

export type ValidationParamsMax = {
    max: number;
};

export type ValidationParamsMinDate = {
    min: Date;
};

export type ValidationParamsMaxDate = {
    max: Date;
};

const successValidation = (): Validation => { return { valid: true } }
const errorValidation = (message: string, params: any = {}): Validation => { return { valid: false, message: 'validator_' + message, params: params } }

export const isValid = (errors: any): boolean => {
    // console.log(Object.values(errors))
    return !Object.values(errors).map(value => _.toString(value) === '').includes(false)
}

export const requiredValidator = (value: string): Validation => {
    let validation = successValidation()
    if (_.toString(value) === '') {
        validation = errorValidation('required', {})
    }
    return validation
}

export const urlValidator = (value: string): Validation => {
    let validation = successValidation()
    let validUrl = require('valid-url');
    if (validUrl.isWebUri(value) == undefined) {
        validation = errorValidation('invalid_url', {})
    }

    return validation
}

export const requiredArrayValidator = (value: any): Validation => {
    let validation = successValidation()
    if (Array.isArray(value) !== true || value.length === 0) {
        validation = errorValidation('required', {})
    }
    return validation
}

export const nearRootAccountValidator = (value: string): Validation => {
    let validation = successValidation()
    const re = /^(([a-z\d]+[-_])*[a-z\d]+)*([a-z\d]+[-_])*[a-z\d]+$/
    if (value.length < 2) {
        validation = errorValidation('at_least_characters', { min: 2 })
    } else if (value.length > 64) {
        validation = errorValidation('maximum_characters', { max: 64 })
    } else if (!re.test(value)) {
        validation = errorValidation('invalid_near_root_account', {})
    }

    return validation
}

export const nearAccountValidator = (value: string): Validation => {
    let validation = successValidation()
    const re = /^([a-z\d]+[a-z\d-_]*[a-z\d]+)([.][a-z\d]+[a-z\d-_]*[a-z\d]+)*$/
    if (value.length < 2) {
        validation = errorValidation('at_least_characters', { min: 2 })
    } else if (value.length > 64) {
        validation = errorValidation('maximum_characters', { max: 64 })
    } else if (!re.test(value)) {
        validation = errorValidation('invalid_near_account', {})
    }

    return validation
}

export const nearAccountExistsValidator = (value: string): Validation => {
    let validation = successValidation()
    if (value) {
        validation = errorValidation('near_account_exists', {})
    }

    return validation
}

export const councilAccountValidator = (value: string): Validation => {
    let validation = successValidation()
    const re = /^(([a-z\d]+[-_])*[a-z\d]+)*([a-z\d]+[-_])*[a-z\d].(near|testnet)+$/
    if (value.length < 2) {
        validation = errorValidation('at_least_characters', { min: 2 })
    } else if (value.length > 64) {
        validation = errorValidation('maximum_characters', { max: 64 })
    } else if (!re.test(value)) {
        validation = errorValidation('invalid_council_account', {})
    }

    return validation
}

export const isAlphanumericUpperecase = (value: string): Validation => {
    let validation = successValidation()
    let re = /^[A-Z0-9]+$/
    if (!re.test(value)){
        validation = errorValidation('alphanumeric_uppercase', {})
    }
    return validation
} 

export const minNumber = (value: number, params: ValidationParamsMin): Validation => {
    let validation = successValidation()
    if (value < params.min) {
        validation = errorValidation('min_number', params)
    }
    return validation;
}

export const maxNumber = (value: number, params: ValidationParamsMax): Validation => {
    let validation = successValidation()
    if (value > params.max) {
        validation = errorValidation('max_number', params)
    }
    return validation;
}

export const sharesValidator = (value: number): Validation => {
    let validation = maxNumber(value, { max: 100})
    if (validation.valid === false) {
        validation = errorValidation('shares_sum', {})
    }
    return validation
}

export const isNumber = (value: string): Validation => {
    let validation = successValidation()
    const re = /^\d+\.?\d*$/
    if (!re.test(value)) {
        validation = errorValidation('not_number', {})
    }
    return validation;
}

export const minLength = (value: string, params: ValidationParamsMin): Validation => {
    let validation = successValidation()
    if (_.toString(value).length < params.min) {
        validation = errorValidation('at_least_characters', params)
    }
    return validation;
}

export const maxLength = (value: string, params: ValidationParamsMax): Validation => {
    let validation = successValidation()
    if (_.toString(value).length > params.max) {
        validation = errorValidation('maximum_characters', params)
    }
    return validation;
}

export const minDate = (value: Date, params: ValidationParamsMinDate, d: any): Validation => {
    let validation = successValidation()
    if (value.valueOf() < params.min.valueOf()) {
        validation = errorValidation('min_date', { min: d(params.min) })
    }
    return validation;
}

export const maxDate = (value: Date, params: ValidationParamsMaxDate, d: any): Validation => {
    let validation = successValidation()
    if (value.valueOf() > params.max.valueOf()) {
        validation = errorValidation('max_date', { max: d(params.max) })
    }
    return validation;
}