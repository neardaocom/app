import TransformerInterface from "@/models/interfaces/Transformer.interface";
import { CodeValue } from "@/models/utils/types/generics";
import ProposalHelper from "../ProposalHelper";
import loUnion from "lodash/union"
import loIsArray from "lodash/isArray"

export default class ProposalInputsTransformer implements TransformerInterface {

    transform(value: any): CodeValue[] {
        let inputs: CodeValue[] = []

        if (loIsArray(value)) {
            value.forEach((activity) => {
                // constants
                if (activity?.constants) {
                    inputs = loUnion(inputs, ProposalHelper.transformInputs(activity.constants))
                    // console.log(activity?.constants, inputs)
                }
                // action constants
                if (activity?.actions_constants) {
                    activity.actions_constants.forEach((item) => {
                        inputs = loUnion(inputs, ProposalHelper.transformInputs(item))
                        // console.log(item, inputs)
                    })
                }
            })
        }
        return inputs
    }
}