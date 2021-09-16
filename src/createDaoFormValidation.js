import { reactive } from "@vue/reactivity";
import useValidators from '@/validators'

const errors = reactive({});
const { isEmpty, isRootAccount, lengthBetween, maxLength, isNumber, maxValue, valueBetween, sumMaxValue, isCouncilRootAccounts, isAlphanumericUpperecase /*minLength*/ } = useValidators()

export default function createDaoFormValidation() {

    const validateAccountField = (fieldName, fieldValue) => {
        errors[fieldName] = !fieldValue ? isEmpty(fieldName, fieldValue) : isRootAccount(fieldName, fieldValue)
    }

    const validateNameField = (fieldName, fieldValue) => {
        errors[fieldName] = !fieldValue ? isEmpty(fieldName, fieldValue) : lengthBetween(fieldName, fieldValue, 3, 64)
    }

    const validateDescriptionField = (fieldName, fieldValue) => {
        errors[fieldName] = maxLength(fieldName, fieldValue, 3000)
    }

    const validateCouncilField = (fieldName, fieldValue) => {
        let notRoot = isCouncilRootAccounts(fieldName, fieldValue)
        errors[fieldName] = notRoot ? notRoot : maxLength(fieldName, fieldValue, 3000)
    }

    const validateFtNameField = (fieldName, fieldValue) => {
        let message = lengthBetween(fieldName, fieldValue, 3, 64)
        if(isEmpty(fieldName, fieldValue) !== ''){
            message = isEmpty(fieldName, fieldValue)
        }
        else if (isAlphanumericUpperecase(fieldName, fieldValue) !== '' ){
            message = isAlphanumericUpperecase(fieldName, fieldValue)
        }
        errors[fieldName] = message
    }

    const validateFtAmountField = (fieldName, fieldValue) => {
        let isNum = isNumber(fieldName, fieldValue)
        errors[fieldName] = isNum === "" ? valueBetween(fieldName, fieldValue, 1, 1_000_000_000) : isNum
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
            [ftFundationShare, ftCommunityShare,ftPublicShare],
             100)
        fieldNames.forEach(fieldName => {          
            errors[fieldName] = error
        })
    }

    const validateVoteSpamThresholdField = (fieldName, fieldValue ,max) => {
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

    const validateVoteApproveThresholdField = (fieldName, fieldValue, max) => {
        let isNum = isNumber(fieldName, fieldValue)
        errors[fieldName] = isNum ? isNum  :  maxValue(fieldName, fieldValue, max)
    }

    return { 
        errors, validateAccountField, validateNameField, validateDescriptionField,
        validateCouncilField, validateFtNameField, validateFtAmountField, validateFtIIDistributionField,
        validateFfSharesFields, validateFfSharesFieldsTogether, validateVoteSpamThresholdField,
        validateVoteDurationDaysField, validateVoteDurationHoursField,  validateVoteQuorumField,
        validateVoteApproveThresholdField,
    }
}