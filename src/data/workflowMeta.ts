import { WFMetaTemplate, WFData } from "@/types/workflow"
import { getValueByCode } from "@/utils/generics"
import { first } from "@/utils/object"
import { nearToYocto, yoctoToNear } from "@/utils/near"
import loToNumber from "lodash/toNumber";

export const templateMetaWfSendNear: WFMetaTemplate = {
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
        },
    ],
}


export const templateMetaPayout: WFMetaTemplate = {
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
    constants: [
    ],
    inputs: [
        { code: 'id', bindId: 0 },
    ],
    activities: [],
    actions: [],
}

export const templateMetaFtUnlockDistribute: WFMetaTemplate = {
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
    constants: [
        { code: 'amountLimit', bindId: 0 },
    ],
    inputs: [
        { code: 'title', bindId: 0 },
        { code: 'amount', bindId: 1 },
        { code: 'tokenId', bindId: 2 },
        { code: 'startAt', bindId: 3 },
        { code: 'duration', bindId: 4 },
    ],
    activities: [],
    actions: [],
}

export const templateMetaGeneral: WFMetaTemplate = {
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
    constants: [
    ],
    inputs: [
        { code: 'templateId', bindId: 0 },
        { code: 'settings...', bindId: 1 },
    ],
    activities: [],
    actions: [],
}