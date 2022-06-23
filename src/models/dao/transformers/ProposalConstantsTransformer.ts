import TransformerInterface from "@/models/interfaces/Transformer.interface";
import { CodeValue } from "@/models/utils/types/generics";
import ProposalHelper from "../ProposalHelper";

export default class ProposalConstantsTransformer implements TransformerInterface {

    transform(value: any): CodeValue[] {
        return (value) ? ProposalHelper.transformInputs(value) : []
    }
}