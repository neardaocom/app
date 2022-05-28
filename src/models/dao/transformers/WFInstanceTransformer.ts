import TransformerInterface from "@/models/interfaces/Transformer.interface";
import { DAOProposal } from "../types/dao";
import NearUtils from "@/models/nearBlockchain/Utils";
import { CodeValue } from "@/models/utils/types/generics";
import { WFInstance, WFInstanceLog, WFTemplate } from "../types/workflow";
import ProposalHelper from "../ProposalHelper";
import StringHelper from "@/models/utils/StringHelper";

export default class WFInstanceTransformer implements TransformerInterface {
    private templates: Record<number, WFTemplate>;

    constructor(templates: Record<number, WFTemplate>) {
        this.templates = templates
    }

    transform(value: any): WFInstance {
        // console.log(value)

        const proposalConstants: CodeValue[] = []
            //proposalConstants = templateMeta?.constants.map((attr) => {
            //    return { code: attr.code, value: loGet(proposalSettings?.constants, [attr.bindId])?.value}
            //}) ?? []
    
        const proposalInputs: CodeValue[] = ProposalHelper.transformInputs(value[2].constants)
    
        const activityLogs: WFInstanceLog[] = []

        value[4]?.forEach((log, index) => {
                //console.log('Log', log)
            activityLogs.push({
                id: index,
                activityId: log.activity_id,
                actionId: log.action_id,
                txSigner: log.caller,
                txSignedAt: NearUtils.dateFromChain(log.timestamp_sec),
                args: NearUtils.parseObjectFromArray(log.user_inputs),
            })
        })
            
        return {
            id: value[0],
            templateId: value[3].template_id,
            settingsId: value[1].current.workflow_settings_id,
            state: value[3].state,
            storage: value[2].storage_key,
            inputs: proposalInputs,
            constants: proposalConstants,
            activityLastId: value[3].current_activity_id || 0,
            activityLogs: activityLogs,
            search: [StringHelper.toSearch('#' + value[0])].join('-'), // TODO: Complete seach: proposalTemplate?.search ?? '' 
        }
    }
}