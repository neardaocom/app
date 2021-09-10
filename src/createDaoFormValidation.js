import { reactive } from "@vue/reactivity";
import useValidators from '@/validators'

const errors = reactive({});
const { isEmpty, isRootAccount, lengthbetween, maxLength, isNumber, maxValue, sumMaxValue /*minLength*/ } = useValidators()

export default function createDaoFormValidation() {

    const validateAccountField = (fieldName, fieldValue) => {
        errors[fieldName] = !fieldValue ? isEmpty(fieldName, fieldValue) : isRootAccount(fieldName, fieldValue)
    }

    const validateNameField = (fieldName, fieldValue) => {
        errors[fieldName] = !fieldValue ? isEmpty(fieldName, fieldValue) : lengthbetween(fieldName, fieldValue, 3, 64)
    }

    const validateDescriptionField = (fieldName, fieldValue) => {
        errors[fieldName] = maxLength(fieldName, fieldValue, 3000)
    }

    const validateCouncilField = (fieldName, fieldValue) => {
        errors[fieldName] = maxLength(fieldName, fieldValue, 3000)
    }

    const validateFtNameField = (fieldName, fieldValue) => {
        errors[fieldName] = isEmpty(fieldName, fieldValue)
    }

    /*const validateFtAmount = (fieldName, fieldValue) => {
        errors[fieldName] = isEmpty(fieldName, fieldValue)
    }*/

    const validateFtIIDistributionField = (fieldName, fieldValue, ftAmount) => {
        let isNum = isNumber(fieldName, fieldValue)
        errors[fieldName] = isNum ? isNum  :  maxValue(fieldName, fieldValue, ftAmount)
    }

    const validateFfSharesFields = (fieldName, fieldValue) => {
        console.log(fieldValue)
        errors[fieldName] =isNumber(fieldName, fieldValue)
    }

    
    const validateFfSharesFieldsTogether = (fieldNames,  ftInsiderShare, ftFundationShare, ftCommunityShare, ftPublicShare) => {
        errors[fieldNames] = sumMaxValue(
                            ["dao_ft_insider_share","dao_ft_fundation_share", "dao_ft_community_share", "dao_ft_public_share"],
                            [ftInsiderShare, ftFundationShare, ftCommunityShare,ftPublicShare],
                             100)

    }

    return { 
        errors, validateAccountField, validateNameField, validateDescriptionField,
        validateCouncilField, validateFtNameField,  validateFtIIDistributionField,
        validateFfSharesFields, validateFfSharesFieldsTogether
        //validateFtAmount,
    }
}