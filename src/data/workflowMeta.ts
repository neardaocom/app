import { WFMetaTemplate, WFData } from "@/types/workflow"
import { getValueByCode } from "@/utils/generics"
import { first } from "@/utils/object"
import { nearToYocto, yoctoToNear } from "@/utils/near"
import loToNumber from "lodash/toNumber";
import { templateMetas } from "@/data/workflow";

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
        {
            code: 'near_send',
            form: {
                component: 'WfNearSendNearSend',
                schema: (data: WFData) => {
                    return {
                        amount: 'required|strIsNumber|strNumMin:0|strNumMax:' + yoctoToNear((getValueByCode(data.inputs, 'amount')) ?? '1000000.0')
                    }
                },
            },
        },
    ],
    actions: [
        {
            id: 0,
            args: (data: WFData) => {
                return {
                    "proposal_id": data.proposalId,
                    "receiver_id": getValueByCode(data.inputs, 'receiverId'),
                    "amount": nearToYocto(loToNumber(data.form.amount)),
                }
            },
            log: (args: any) => {
                return {
                    "receiver_id": first(args[0][0]),
                    "amount": (first(args[0][1])) ? yoctoToNear(first(args[0][1])) : undefined,
                }
            },
            gas: 100,
            deposit: 0,
        },
    ],
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

export const templateMetaSendFt: WFMetaTemplate = {
    id: 3,
    code: 'wf_treasury_send_ft',
    constants: [
        { code: 'amountLimit', bindId: 0 },
    ],
    inputs: [
        { code: 'receiverId', bindId: 0 },
        { code: 'amount', bindId: 1 },
    ],
    activities: [],
    actions: [],
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

export const templateMetaSkyward: WFMetaTemplate = {
    id: 7,
    code: 'wf_skyward',
    constants: [
        { code: 'amountLimit', bindId: 0 },
    ],
    inputs: [
        { code: 'amount', bindId: 2 },
    ],
    activities: [
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
    ],
    actions: [
        {
            id: 0,
            args: (data: WFData) => {
                return [
                    [ { String: data.form.tokenId } ],
                ]
            },
            argsCollection: (data: WFData) => {
                return []
            },
            log: (args: any) => {
                return {
                    tokenId: first(args[0][0]),
                }
            },
            gas: 200,
            deposit: 0,
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
            gas: 100,
            deposit: 0,
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
            gas: 100,
            deposit: 0,
        },
        { // self - ft_transfer_call
            id: 3,
            args: (data: WFData) => {
                return [[{String: "test"}]]
            },
            argsCollection: (data: WFData) => {
                return []
            },
            log: (args: any) => {
                return {}
            },
            gas: 100,
            deposit: 0,
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

export const templateMetaAddWorkflow: WFMetaTemplate = {
    id: 1,
    code: 'wf_add',
    constants: [
    ],
    inputs: [
        { code: 'templateId', bindId: 0 },
    ],
    activities: [],
    actions: [
        {
            id: 0,
            args: (data: WFData) => {
                return {
                    "proposal_id": data.proposalId,
                    "workflow_id": getValueByCode(data.inputs, 'templateId'),
                }
            },
            log: (args: any) => {
                return {
                    "templateId": first(args[0][0]),
                }
            },
            gas: 300,
            deposit: 0,
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
    ],
    activities: [],
    actions: [
        {
            id: 0,
            args: (data: WFData) => {
                return {
                    "proposal_id": data.proposalId,
                    "workflow_id": getValueByCode(data.inputs, 'templateId'),
                }
            },
            log: (args: any) => {
                return {
                    "templateId": first(args[0][0]),
                }
            },
            gas: 200,
            deposit: 0,
        },
    ],
}