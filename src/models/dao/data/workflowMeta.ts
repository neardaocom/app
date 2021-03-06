import { WFMetaTemplate, WFData } from "@/models/dao/types/workflow"
import GenericsHelper from "@/models/utils/GenericsHelper"
import ObjectHelper from "@/models/utils/ObjectHelper"
import NearUtils from "@/models/nearBlockchain/Utils"
import loToNumber from "lodash/toNumber";

export const templateMetaAddWorkflow: WFMetaTemplate = {
    id: 1,
    code: 'wf_add',
    constants: [
    ],
    inputs: [
        { code: 'templateId', bindId: 0 },
    ],
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
    actions: [
        {
            id: 0,
            args: (data: WFData) => {
                return {
                    "proposal_id": data.proposalId,
                    "workflow_id": GenericsHelper.getValueByCode(data.inputs, 'templateId'),
                }
            },
            log: (args: any) => {
                return {
                    "templateId": ObjectHelper.first(args[0][0]),
                }
            },
            gas: (data?: WFData): Number => {
                return 300
            },
            deposit: (data?: WFData): Number => {
                return 0
            },
        },
    ],
}

export const templateMetaWfNearSend: WFMetaTemplate = {
    id: 2,
    code: 'wf_near_send',
    constants: [
        { code: 'amountLimit', bindId: 0 },
    ],
    inputs: [
        { code: 'receiverId', bindId: 0 },
        { code: 'amount', bindId: 1 },
    ],
    activities: [
        //{
        //    code: 'near_send',
        //    form: {
        //        component: 'WfNearSendNearSend',
        //        schema: (data: WFData) => {
        //            return {
        //                amount: 'required|strIsNumber|strNumMin:0|strNumMax:' + NearUtils.yoctoToNear((GenericsHelper.getValueByCode(data.inputs, 'amount')) ?? '1000000.0')
        //            }
        //        },
        //    },
        //},
    ],
    actions: [
        {
            id: 0,
            args: (data: WFData) => {
                return {
                    "proposal_id": data.proposalId,
                    "receiver_id": GenericsHelper.getValueByCode(data.inputs, 'receiverId'),
                    "amount": NearUtils.nearToYocto(loToNumber(data.form.amount)),
                }
            },
            log: (args: any) => {
                return {
                    "receiver_id": ObjectHelper.first(args[0][0]),
                    "amount": (ObjectHelper.first(args[0][1])) ? NearUtils.yoctoToNear(ObjectHelper.first(args[0][1])) : undefined,
                }
            },
            gas: (data?: WFData): Number => {
                return 100
            },
            deposit: (data?: WFData): Number => {
                return 0
            },
        },
    ],
}


export const templateMetaSendFt: WFMetaTemplate = {
    id: 3,
    code: 'wf_treasury_send_ft',
    constants: [
        { code: 'amountLimit', bindId: 0 },
    ],
    inputs: [
        { code: 'ftAccountId', bindId: 0},
        { code: 'receiverId', bindId: 1},
        { code: 'amount', bindId: 2 },
    ],
    activities: [
        //{
        //    code: 'treasury_send_ft',
        //    form: {
        //        component: 'WfTreasurySendFtTreasurySendFt',
        //        schema: (data: WFData) => {
        //            return {
        //                amount: 'required|strIsNumber|strNumMin:0|strNumMax:' + (GenericsHelper.getValueByCode(data.inputs, 'amount') ?? '1000000.0')
        //            }
        //        },
        //   },
        //},
    ],
    actions: [
        {
            id: 0,
            args: (data: WFData) => {
                return {
                    "proposal_id": data.proposalId,
                    "ft_account_id": GenericsHelper.getValueByCode(data.inputs, 'ftAccountId'),
                    "receiver_id": GenericsHelper.getValueByCode(data.inputs, 'receiverId'),
                    "amount": data.form.amount,
                }
            },
            log: (args: any) => {
                return {
                }
            },
            gas: (data?: WFData): Number => {
                return 100
            },
            deposit: (data?: WFData): Number => {
                return 0
            },
        },
    ],
}

export const templateMetaGroupAddMember: WFMetaTemplate = {
    id: 4,
    code: 'wf_group_members_add',
    constants: [
    ],
    inputs: [
        { code: 'accountId', bindId: 0 },
        { code: 'groupId', bindId: 1 },
        { code: 'roles', bindId: 2 },
    ],
    activities: [],
    actions: [],
}

export const templateMetaFtUnlockDistribute: WFMetaTemplate = {
    id: 5,
    code: 'wf_ft_distribute',
    constants: [
        { code: 'groupIds', bindId: 0 },
        { code: 'amountLimit', bindId: 1 },
    ],
    inputs: [
        { code: 'groupId', bindId: 0 },
        { code: 'amount', bindId: 1 },
        { code: 'accountIds', bindId: 2 },
    ],
    activities: [],
    actions: [],
}

export const templateMetaMediaAdd: WFMetaTemplate = {
    id: 6,
    code: 'wf_media_add',
    constants: [
    ],
    inputs: [
        { code: 'name', bindId: 0 },
        { code: 'category', bindId: 1 },
        { code: 'type', bindId: 2 },
        { code: 'version', bindId: 3 },
        { code: 'tags', bindId: 4 },
        { code: 'cid', bindId: 5 },
        { code: 'link', bindId: 6 },
    ],
    activities: [
        //{
        //    code: 'media_add',
        //    form: {
        //        component: '',
        //        schema: (data: WFData) => {
        //            return {}
        //        },
        //    },
        //},
    ],
    actions: [
        {
            id: 0,
            args: (data: WFData) => {
                return {
                    "proposal_id": data.proposalId
                }
            },
            log: (args: any) => {
                return {}
            },
            gas: (data?: WFData): Number => {
                return 100
            },
            deposit: (data?: WFData): Number => {
                return 0
            },
        },
    ],
}

export const templateMetaSkyward: WFMetaTemplate = {
    id: 7,
    code: 'wf_skyward',
    constants: [
    ],
    inputs: [
        { code: 'tokenId', bindId: 0 },
        { code: 'amount', bindId: 1 },
        { code: 'title', bindId: 2 },
        { code: 'url', bindId: 3 },
        { code: 'startAt', bindId: 4 },
        { code: 'duration', bindId: 5 },
    ],
    activities: [
        /*
        {
            code: 'register_tokens',
            form: {
                component: 'WfSkywardRegisterTokens',
                schema: (data: WFData) => {
                    return {
                        tokenId: 'required'
                    }
                },
            },
        },
        */
    ],
    actions: [
        {
            id: 0,
            args: (data: WFData) => {
                return [
                    [ { String: GenericsHelper.getValueByCode(data.inputs, 'tokenId') } ],
                ]
            },
            argsCollection: (data: WFData) => {
                return []
            },
            log: (args: any) => {
                return {
                    tokenId: ObjectHelper.first(args[0][0]),
                }
            },
            gas: (data?: WFData): Number => {
                return 200
            },
            deposit: (data?: WFData): Number => {
                return 0
            },
        },
        { // self - storage_depost
            id: 1,
            args: (data: WFData) => {
                return [[]]
            },
            argsCollection: (data: WFData) => {
                return []
            },
            log: (args: any) => {
                return {}
            },
            gas: (data: WFData) => {
                return 140
            },
            deposit: (data?: WFData): Number => {
                return 0
            },
        },
        { // wrap.testnet - storage_depost
            id: 2,
            args: (data: WFData) => {
                return [[]]
            },
            argsCollection: (data: WFData) => {
                return []
            },
            log: (args: any) => {
                return {}
            },
            gas: (data: WFData) => {
                return 140
            },
            deposit: (data?: WFData): Number => {
                return 0
            },
        },
        { // self - ft_transfer_call
            id: 3,
            args: (data: WFData) => {
                return [[{String: "unknown"}]]
            },
            argsCollection: (data: WFData) => {
                return []
            },
            log: (args: any) => {
                return {}
            },
            gas: (data?: WFData): Number => {
                return 200
            },
            deposit: (data?: WFData): Number => {
                return 0
            },
        },
        { // sale_create
            id: 4,
            args: (data: WFData) => {
                return [
                    [
                      "Null"
                    ],
                    [
                      { String: GenericsHelper.getValueByCode(data.inputs, 'title') },
                      { String: GenericsHelper.getValueByCode(data.inputs, 'url') },
                      { String: data.daoId },
                      "Null",
                      { String: GenericsHelper.getValueByCode(data.inputs, 'tokenId') },
                      { U64: GenericsHelper.getValueByCode(data.inputs, 'startAt') },
                      { U64: GenericsHelper.getValueByCode(data.inputs, 'duration') },
                    ]
                ]
            },
            argsCollection: (data: WFData) => {
                return [
                    [
                        { String: data.daoId },
                        { U128: GenericsHelper.getValueByCode(data.inputs, 'amount') },
                        "Null",
                    ]
                ]
            },
            log: (args: any) => {
                return {}
            },
            gas: (data?: WFData): Number => {
                return 200
            },
            deposit: (data?: WFData): Number => {
                return 0
            },
        },
    ],
}


export const templateMetaBounty: WFMetaTemplate = {
    id: 8,
    code: 'wf_bounty',
    constants: [
    ],
    inputs: [
        { code: 'amount', bindId: 0 },
        { code: 'deposit', bindId: 1 },
        { code: 'title', bindId: 2 },
    ],
    activities: [],
    actions: [
        { // event_checkin
            id: 0,
            args: (data: WFData) => {
                return {
                    "proposal_id": data.proposalId,
                    "code": "checkin",
                    "args": [],
                }
            },
            log: (args: any) => {
                return {}
            },
            gas: (data?: WFData): Number => {
                return 100
            },
            deposit: (data?: WFData): Number => {
                return NearUtils.yoctoToNear(GenericsHelper.getValueByCode(data?.inputs ?? [], 'deposit') ?? '0')
            },
        },
        { // event_unrealized
            id: 1,
            args: (data: WFData) => {
                return {
                    "proposal_id": data.proposalId,
                    "code": "unrealized",
                    "args": [],
                }
            },
            log: (args: any) => {
                return {}
            },
            gas: (data?: WFData): Number => {
                return 100
            },
            deposit: (data?: WFData): Number => {
                return 0
            },
        },
        { // event_approve
            id: 2,
            args: (data: WFData) => {
                return {
                    "proposal_id": data.proposalId,
                    "code": "approve",
                    "args": [
                        { "Bool": true }
                    ],
                }
            },
            log: (args: any) => {
                return {}
            },
            gas: (data?: WFData): Number => {
                return 100
            },
            deposit: (data?: WFData): Number => {
                return 0
            },
        },
        { // event_done
            id: 3,
            args: (data: WFData) => {
                return {
                    "proposal_id": data.proposalId,
                    "code": "done",
                    "args": [
                        { "String": "heres some link" }
                    ],
                }
            },
            log: (args: any) => {
                return {}
            },
            gas: (data?: WFData): Number => {
                return 100
            },
            deposit: (data?: WFData): Number => {
                return 0
            },
        },
        { // event_done_approve
            id: 4,
            args: (data: WFData) => {
                return {
                    "proposal_id": data.proposalId,
                    "code": "done_approve",
                    "args": [
                        { "String": "All good - 5/5" }
                    ],
                }
            },
            log: (args: any) => {
                return {}
            },
            gas: (data?: WFData): Number => {
                return 100
            },
            deposit: (data?: WFData): Number => {
                return 0
            },
        },
        { // near_send
            id: 5,
            args: (data: WFData) => {
                return {
                    "proposal_id": data.proposalId,
                    "receiver_id": ObjectHelper.first(data.storage[0]),
                    "amount": GenericsHelper.getValueByCode(data?.inputs ?? [], 'amount') ?? '0',
                }
            },
            log: (args: any) => {
                return {}
            },
            gas: (data?: WFData): Number => {
                return 100
            },
            deposit: (data?: WFData): Number => {
                return 0
            },
        },
    ],
}



export const templateMetaGeneral: WFMetaTemplate = {
    id: 0,
    code: '',
    constants: [
    ],
    inputs: [
        { code: 'title', bindId: 0 },
        { code: 'cid', bindId: 1 },
    ],
    activities: [],
    actions: [],
}

export const templateMetaPayout: WFMetaTemplate = {
    id: 0,
    code: 'payout',
    constants: [
        { code: 'amountLimit', bindId: 0 },
        { code: 'tokenLimit', bindId: 1 },
    ],
    inputs: [
        { code: 'receiverId', bindId: 0 },
        { code: 'nearAmount', bindId: 1 },
        { code: 'tokenAmount', bindId: 2 },
    ],
    activities: [],
    actions: []
}

export const templateMetaGroupRemoveMember: WFMetaTemplate = {
    id: 0,
    code: '',
    constants: [
    ],
    inputs: [
        { code: 'accountId', bindId: 0 },
        { code: 'groupId', bindId: 1 },
    ],
    activities: [],
    actions: [],
}

export const templateMetaMediaInvalid: WFMetaTemplate = {
    id: 0,
    code: '',
    constants: [
    ],
    inputs: [
        { code: 'id', bindId: 0 },
    ],
    activities: [],
    actions: [],
}

export const templateMetas: Record<string, WFMetaTemplate> = {
    'wf_add': templateMetaAddWorkflow,
    'wf_skyward': templateMetaSkyward,
    'wf_send_near': templateMetaWfNearSend,
    'wf_bounty': templateMetaBounty,
    'wf_treasury_send_ft': templateMetaSendFt,
    'wf_near_send': templateMetaWfNearSend,
    'wf_media_add': templateMetaMediaAdd,
    'groupAddMember': templateMetaGroupAddMember,
    'groupRemoveMember': templateMetaGroupRemoveMember,
    'mediaInvalid': templateMetaMediaInvalid,
    'FtNulockDistribute': templateMetaFtUnlockDistribute,
    'general': templateMetaGeneral,
    'addWorkflow': templateMetaAddWorkflow,
}