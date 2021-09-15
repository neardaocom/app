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