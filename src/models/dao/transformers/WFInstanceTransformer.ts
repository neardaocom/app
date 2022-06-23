import TransformerInterface from "@/models/interfaces/Transformer.interface";
import NearUtils from "@/models/nearBlockchain/Utils";
import { CodeValue } from "@/models/utils/types/generics";
import { WFInstance, WFInstanceLog } from "../types/workflow";
import StringHelper from "@/models/utils/StringHelper";
import ProposalConstantsTransformer from "./ProposalConstantsTransformer";
import ProposalInputsTransformer from "./ProposalInputsTransformer";
import loGet from "lodash/get"

export default class WFInstanceTransformer implements TransformerInterface {

    private constantsTransformer: TransformerInterface;
    private inputsTransformer: TransformerInterface;

    constructor() {
        this.constantsTransformer = new ProposalConstantsTransformer()
        this.inputsTransformer = new ProposalInputsTransformer()
    }

    transform(value: any): WFInstance {
        // console.log(value)

        const proposalConstants: CodeValue[] = this.constantsTransformer.transform(value[2].constants)

        const proposalInputs: CodeValue[] = this.inputsTransformer.transform(value[2].activity_constants)

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
            settingsId: value[1].v1.workflow_settings_id,
            workflowScenarioId: loGet(value[2], ['constants', 'map', 's', 'u64']) || 1,
            state: value[3].state,
            storage: value[2].storage_key,
            constants: proposalConstants,
            inputs: proposalInputs,
            activityLastId: value[3].current_activity_id || 0,
            activityLogs: activityLogs,
            search: [StringHelper.toSearch('#' + value[0])].join('-'), // TODO: Complete seach: proposalTemplate?.search ?? '' 
        }
    }
}