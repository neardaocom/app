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

    const lengthbetween = (fieldName, fieldValue, min, max) => {
        return fieldValue.length > max || fieldValue.length < min ? `The ${fieldName} must contain between ${min} and ${max} characters` : "";
    }

    const isRootAccount = (fieldName, fieldValue) => {
        const validLength = lengthbetween(fieldName, fieldValue, 2 , 64) 
        if (validLength === ""){
            let re = /^(([a-z\d]+[-_])*[a-z\d]+)*([a-z\d]+[-_])*[a-z\d]+$/
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

    const sumMaxValue = (fieldNames, fieldValue, max) => {
        fieldValue = fieldValue.map(function(num) {
            return num === "" ? 0 : num
        })
        const reducer = (accumulator, curr) => accumulator + curr;
        return fieldValue.reduce(reducer) > max ? `The ${fieldNames} fields should not be greater than ${max}` : "";
    }

    const isCouncilRootAccounts = (fieldName, fieldValue) => {
        let councilArray = fieldValue.split(",")
        let error = ""
        councilArray.forEach(council => {            
            if (isRootAccount(fieldName, council.trim())){
                console.log("from root",error)
                error = "One of council is not a root account"
            }
        })
        return error
    }

    return {isEmpty, minLength, maxLength, lengthbetween, isRootAccount, isNumber, maxValue, sumMaxValue, isCouncilRootAccounts}
}