import TransformerInterface from "@/models/interfaces/Transformer.interface";
import { DAOVotingResults } from "../types/dao";
import loIsArray from "lodash/isArray";
import Decimal from "decimal.js";
import NearUtils from "../../nearBlockchain/Utils";

export default class VotingResultsTransformer implements TransformerInterface {

    constructor() {
    }

    transform(value: any): DAOVotingResults | undefined {
        return (loIsArray(value) && value.length === 4) ? {
            amount: new Decimal(NearUtils.amountFromDecimals(value[0], 24)).toNumber(),
            yes: new Decimal(NearUtils.amountFromDecimals(value[2], 24)).toNumber(),
            no: new Decimal(NearUtils.amountFromDecimals(value[3], 24)).toNumber(),
        } : undefined
    }
}