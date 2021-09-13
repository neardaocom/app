import { reactive } from "@vue/reactivity";
import useValidators from '@/validators'

const errors = reactive({});
const { isEmpty, isRootAccount, lengthbetween, maxLength, isNumber, maxValue, sumMaxValue, isCouncilRootAccounts /*minLength*/ } = useValidators()

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
        let notRoot = isCouncilRootAccounts(fieldName, fieldValue)
        errors[fieldName] = notRoot ? notRoot : maxLength(fieldName, fieldValue, 3000)
    }

    const validateFtNameField = (fieldName, fieldValue) => {
        errors[fieldName] = isEmpty(fieldName, fieldValue)
    }

    const validateFtAmountField = (fieldName, fieldValue) => {
        errors[fieldName] = isNumber(fieldName, fieldValue)
    }

    const validateFtIIDistributionField = (fieldName, fieldValue, ftAmount) => {
        let isNum = isNumber(fieldName, fieldValue)
        errors[fieldName] = isNum ? isNum  :  maxValue(fieldName, fieldValue, ftAmount)
    }

    const validateFfSharesFields = (fieldName, fieldValue) => {
        errors[fieldName] = isNumber(fieldName, fieldValue)
    }

    
    const validateFfSharesFieldsTogether = (fieldNames,  ftInsiderShare, ftFundationShare, ftCommunityShare, ftPublicShare) => {
        let error = sumMaxValue(
            ["dao_ft_insider_share","dao_ft_fundation_share", "dao_ft_community_share", "dao_ft_public_share"],
            [ftInsiderShare, ftFundationShare, ftCommunityShare,ftPublicShare],
             100)
        fieldNames.forEach(fieldName => {            
            errors[fieldName] = error
        })
    }

    const validateVoteSpamTresholdField = (fieldName, fieldValue ,max) => {
        let isNum = isNumber(fieldName, fieldValue)
        errors[fieldName] = isNum ? isNum  :  maxValue(fieldName, fieldValue, max)
    }

    const validateVoteDurationDaysField = (fieldName, fieldValue) => {
        errors[fieldName] = isNumber(fieldName, fieldValue)
    }

    const validateVoteDurationHoursField = (fieldName, fieldValue) => {
        errors[fieldName] = isNumber(fieldName, fieldValue)
    }

    const validateVoteQuorumField = (fieldName, fieldValue, max) => {
        let isNum = isNumber(fieldName, fieldValue)
        errors[fieldName] = isNum ? isNum  :  maxValue(fieldName, fieldValue, max)
    }

    const validateVoteApproveTreshholdField = (fieldName, fieldValue, max) => {
        let isNum = isNumber(fieldName, fieldValue)
        errors[fieldName] = isNum ? isNum  :  maxValue(fieldName, fieldValue, max)
    }

    return { 
        errors, validateAccountField, validateNameField, validateDescriptionField,
        validateCouncilField, validateFtNameField, validateFtAmountField, validateFtIIDistributionField,
        validateFfSharesFields, validateFfSharesFieldsTogether, validateVoteSpamTresholdField,
        validateVoteDurationDaysField, validateVoteDurationHoursField,  validateVoteQuorumField,
        validateVoteApproveTreshholdField,
    }
}