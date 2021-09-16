export default function Validators() {

    const isEmpty = (fieldName, fieldValue) => {
        return !fieldValue ? "The " + fieldName + " field is required" : "";
    }
       
    const minLength = (fieldName, fieldValue, min) => {
        return fieldValue.length < min ? `The ${fieldName} field must be atleast ${min} characters long` : "";
    }

    const maxLength = (fieldName, fieldValue, max) => {
        return fieldValue.length > max ? `The ${fieldName} field can contain a maximum of ${max} letters` : "";
    }

    const lengthBetween = (fieldName, fieldValue, min, max) => {
        return fieldValue.length > max || fieldValue.length < min ? `The ${fieldName} must contain between ${min} and ${max} characters` : "";
    }

    const isRootAccount = (fieldName, fieldValue, withNear = false) => {
        const validLength = lengthBetween(fieldName, fieldValue, 2 , 64) 
        if (validLength === ""){
            let re
            if (!withNear){
                re = /^(([a-z\d]+[-_])*[a-z\d]+)*([a-z\d]+[-_])*[a-z\d]+$/
            }else{
                re = /^(([a-z\d]+[-_])*[a-z\d]+)*([a-z\d]+[-_])*[a-z\d].near+$/
            }
            return !re.test(fieldValue) ? "The input is not a valid " + fieldName + " Root Account" : "";
        }
        else{
            return validLength
        }
    }

    const isNumber = (fieldName, fieldValue) =>{
        let isNum = /^\d+$/.test(fieldValue);
        return !isNum ? "The " + fieldName + " field only have numbers" : "";
    }

    const maxValue = (fieldName, fieldValue, max) => {
        return fieldValue > max ? `The ${fieldName} field value should not be greater than ${max == "" ? 0 : max}` : "";
    }

    const valueBetween = (fieldName, fieldValue, min, max) => {
        return fieldValue > max || fieldValue < min ? `The ${fieldName} must be between ${min} and ${max}` : "";
    }

    const sumMaxValue = (fieldNames, fieldValue, max) => {
        fieldValue = fieldValue.map(function(num) {
            return num === "" ? 0 : num
        })
        const reducer = (accumulator, curr) => accumulator + curr;
        return fieldValue.reduce(reducer) > max ? `The Shares should not be greater than ${max}%` : "";
    }

    const isCouncilRootAccounts = (fieldName, fieldValue) => {
        let councilArray = fieldValue.split(",")
        let error = ""
        councilArray.forEach(council => {            
            if (isRootAccount(fieldName, council.trim(), true)){
                error = "One of council is not a root account"
            }
        })
        return error
    }

    const isAlphanumericUpperecase = (fieldName, fieldValue) => {
        let re = /^[A-Z0-9]+$/
        return !re.test(fieldValue) ? "This field must be alphanumeric and uppercase" : "";
    } 

    return {isEmpty, minLength, maxLength, lengthBetween, isRootAccount, isNumber,
         maxValue, valueBetween, sumMaxValue, isCouncilRootAccounts, isAlphanumericUpperecase}
}