import TransformerInterface from "@/models/interfaces/Transformer.interface";
import { DAOProposal } from "../types/dao";
import NearUtils from "@/models/nearBlockchain/Utils";
import { CodeValue } from "@/models/utils/types/generics";
import { WFTemplate } from "../types/workflow";
import ProposalHelper from "../ProposalHelper";

export default class ProposalTransformer implements TransformerInterface {
    private templates: Record<number, WFTemplate>;

    constructor(templates: Record<number, WFTemplate>) {
        this.templates = templates
    }

    transform(value: any): DAOProposal {
        // console.log(value)

        const proposalConstants: CodeValue[] = []
            //proposalConstants = templateMeta?.constants.map((attr) => {
            //    return { code: attr.code, value: loGet(proposalSettings?.constants, [attr.bindId])?.value}
            //}) ?? []
    
        const proposalInputs: CodeValue[] = ProposalHelper.transformInputs(value[2].constants)
    
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
            inputs: proposalInputs,
            storageKey: value[2].storage_key,
            constants: proposalConstants,
        }
    }
}