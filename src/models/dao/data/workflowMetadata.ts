import { WFMetaTemplate, WFData } from "@/models/dao/types/workflow"
import GenericsHelper from "@/models/utils/GenericsHelper"
import ObjectHelper from "@/models/utils/ObjectHelper"
import loToNumber from "lodash/toNumber";

export const templateBasicPkg: WFMetaTemplate = {
    id: 0,
    code: 'basic_pkg1',
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
                                    u64: loToNumber(GenericsHelper.getValueByCode(data.inputs, 'id'))
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

export const templateReward: WFMetaTemplate = {
    id: 9,
    code: 'reward2',
    constants: [],
    inputs: [],
    activities: [
        {
            id: 1,
            args: (data: WFData) => {
                return [{
                    action: {
                        dao_action: 'reward_add'
                    },
                    values: {
                      map: {}
                    }
                }]
            },
            log: (args: any) => {
                return {
                }
            },
        },
    ],
    actions: [],
}

export const templateLock: WFMetaTemplate = {
    id: 6,
    code: 'lock1',
    constants: [],
    inputs: [],
    activities: [
        {
            id: 1,
            args: (data: WFData) => {
                return [{
                    action: {
                        dao_action: 'treasury_add_partition'
                    },
                    values: {
                      map: {}
                    }
                }]
            },
            log: (args: any) => {
                return {
                }
            },
        },
    ],
    actions: [],
}

export const workflowMetadata: Record<string, WFMetaTemplate> = {
    'basic_pkg1': templateBasicPkg,
    'wf_add': templateWfAdd,
    'reward2': templateReward,
    'lock1': templateLock,
}