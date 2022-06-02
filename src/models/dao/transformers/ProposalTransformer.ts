import TransformerInterface from "@/models/interfaces/Transformer.interface";
import { DAOProposal } from "../types/dao";
import NearUtils from "@/models/nearBlockchain/Utils";
import { CodeValue } from "@/models/utils/types/generics";
import loGet from "lodash/get"
import ProposalConstantsTransformer from "./ProposalConstantsTransformer";
import ProposalInputsTransformer from "./ProposalInputsTransformer";

export default class ProposalTransformer implements TransformerInterface {

    private constantsTransformer: TransformerInterface;
    private inputsTransformer: TransformerInterface;

    constructor() {
        this.constantsTransformer = new ProposalConstantsTransformer()
        this.inputsTransformer = new ProposalInputsTransformer()
    }

    transform(value: any): DAOProposal {
        console.log(value)

        const proposalConstants: CodeValue[] = this.constantsTransformer.transform(value[2].constants)

        const proposalInputs: CodeValue[] = this.inputsTransformer.transform(value[2].activity_constants)

        return {
            id: value[0],
            created: NearUtils.dateFromChain(value[1].current.created),
            createdBy: value[1].current.created_by,
            end: NearUtils.dateFromChain(value[1].current.end),
            description: value[1].current.desc,
            votes: value[1].current.votes,
            state: value[1].current.state,
            templateId: value[1].current.workflow_id,
            settingsId: value[1].current.workflow_settings_id,
            workflowScenarioId: loGet(value[2], ['constants', 'map', 's', 'u64']) || 1,
            constants: proposalConstants,
            inputs: proposalInputs,
            storageKey: value[2].storage_key,
        }
    }
}