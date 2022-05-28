import { WFMetaTemplate, WFData } from "@/models/dao/types/workflow"
import GenericsHelper from "@/models/utils/GenericsHelper"
import ObjectHelper from "@/models/utils/ObjectHelper"
import loToNumber from "lodash/toNumber";

export const templateWfAdd: WFMetaTemplate = {
    id: 1,
    code: 'wf_add',
    constants: [],
    inputs: [],
    activities: [
        {
            id: 1,
            args: (data: WFData) => {
                return [
                    {
                        action: {
                            fn_call: [
                                'workflow-provider.v1.neardao.testnet',
                                'wf_template'
                            ]
                        },
                        values: {
                            map: {
                                id: {
                                    u64: loToNumber(GenericsHelper.getValueByCode(data.inputs, 'workflow_id'))
                                }
                            }
                        }
                    }
                ]
            },
            log: (args: any) => {
                return {
                    "templateId": ObjectHelper.first(args[0][0]),
                }
            },
        },
    ],
    actions: [],
}

export const workflowMetadata: Record<string, WFMetaTemplate> = {
    'wf_add': templateWfAdd,
}