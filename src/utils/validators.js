/*
TypeScript version
export type Validation = {
    valid: boolean;
    message?: string;
    params?: any;
};

const successValidation = (): Validation => { return { valid: true, message: null, params: null } }
const errorValidation = (message: string, params: any = {}): Validation => { return { valid: false, message: message, params: params } }

export const requiredValidator = (value: string): Validation => {
    let validation = successValidation()
    if (value === undefined || value === '') {
        validation = errorValidation('Required field', {})
    }

    return validation
}
export const nearRootAccountValidator = (value: string): Validation => {
    let validation = successValidation()
    const re = /^(([a-z\d]+[-_])*[a-z\d]+)*([a-z\d]+[-_])*[a-z\d]+$/
    if (value.length < 2) {
        validation = errorValidation('At least {min} characters', { min: 2 })
    } else if (value.length > 64) {
        validation = errorValidation('Maximum {max} letters', { max: 64 })
    } else if (!re.test(value)) {
        validation = errorValidation('Invalid NEAR root Account', {})
    }

    return validation
}
*/

const successValidation = () => { return { valid: true, message: null, params: null } }
const errorValidation = (message, params) => { return { valid: false, message: 'validator_' + message, params: params } }

export const isValid = (errors) => {
    // console.log(Object.values(errors))
    return !Object.values(errors).map(value => value === '' || value === undefined || value === null).includes(false)
}

export const requiredValidator = (value) => {
    let validation = successValidation()
    if (value === undefined || value === '') {
        validation = errorValidation('required', {})
    }
    return validation
}

export const urlValidator = (value) => {
    let validation = successValidation()
    let validUrl = require('valid-url');
    if (validUrl.isWebUri(value) == undefined) {
        validation = errorValidation('invalid_url', {})
    }

    return validation
}

export const requiredArrayValidator = (value) => {
    let validation = successValidation()
    if (Array.isArray(value) !== true || value.length === 0) {
        validation = errorValidation('required', {})
    }
    return validation
}

export const nearRootAccountValidator = (value) => {
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

export const nearAccountValidator = (value) => {
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

export const nearAccountExistsValidator = (value) => {
    let validation = successValidation()
    if (value) {
        validation = errorValidation('near_account_exists', {})
    }

    return validation
}

export const councilAccountValidator = (value) => {
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

export const isAlphanumericUpperecase = (value) => {
    let validation = successValidation()
    let re = /^[A-Z0-9]+$/
    if (!re.test(value)){
        validation = errorValidation('alphanumeric_uppercase', {})
    }
    return validation
} 

export const sharesValidator = (value) => {
    let validation = maxNumber(value, 100)
    if(validation.valid === false){
        validation = errorValidation('shares_sum', {})
    }
    return validation
}

export const isNumber = (value) => {
    let validation = successValidation()
    const re = /^\d+\.?\d*$/
    if (!re.test(value)) {
        validation = errorValidation('not_number', {})
    }
    return validation;
}

export const minNumber = (value, min) => {
    let validation = successValidation()
    if (value < min) {
        validation = errorValidation('min_number', {min: min})
    }
    return validation;
}

export const maxNumber = (value, max) => {
    let validation = successValidation()
    if (value > max) {
        validation = errorValidation('max_number', {max: max})
    }
    return validation;
}

export const minLength = (value, min) => {
    let validation = successValidation()
    if (value.length < min) {
        validation = errorValidation('at_least_characters', {min: min})
    }
    return validation;
}

export const maxLength = (value, max) => {
    let validation = successValidation()
    if (value.length > max) {
        validation = errorValidation('maximum_characters', {max: max})
    }
    return validation;
}