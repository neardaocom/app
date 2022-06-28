import TransformerInterface from "@/models/interfaces/Transformer.interface";
import { DAOProposal } from "../types/dao";
import NearUtils from "@/models/nearBlockchain/Utils";
import { CodeValue } from "@/models/utils/types/generics";
import loGet from "lodash/get"
import ProposalConstantsTransformer from "./ProposalConstantsTransformer";
import ProposalInputsTransformer from "./ProposalInputsTransformer";
import VotingResultsTransformer from "./VotingResultsTransformer";

export default class ProposalTransformer implements TransformerInterface {

    private constantsTransformer: TransformerInterface;
    private inputsTransformer: TransformerInterface;
    private votingResultsTransformer: TransformerInterface;

    constructor() {
        this.constantsTransformer = new ProposalConstantsTransformer()
        this.inputsTransformer = new ProposalInputsTransformer()
        this.votingResultsTransformer = new VotingResultsTransformer()
    }

    transform(value: any): DAOProposal {
        //console.log(value)

        const proposalConstants: CodeValue[] = this.constantsTransformer.transform(value[2].constants)

        const proposalInputs: CodeValue[] = this.inputsTransformer.transform(value[2].activity_constants)

        return {
            id: value[0],
            created: NearUtils.dateFromChain(value[1].v1.created),
            createdBy: value[1].v1.created_by,
            end: NearUtils.dateFromChain(value[1].v1.end),
            description: value[1].v1.desc,
            votes: value[1].v1.votes,
            votingResults: this.votingResultsTransformer.transform(value[1].v1.voting_results),
            state: value[1].v1.state,
            templateId: value[1].v1.workflow_id,
            settingsId: value[1].v1.workflow_settings_id,
            workflowScenarioId: loGet(value[2], ['constants', 'map', 's', 'u64']) || 1,
            constants: proposalConstants,
            inputs: proposalInputs,
            storageKey: value[2].storage_key,
        }
    }
}