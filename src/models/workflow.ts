import { WFAction, WFActionFunctionCall, WFActionCall, WFActivity, WFAttribute, WFData, WFInstance, WFInstanceLog, WFSettings, WFTemplate, WFTransition } from "@/types/workflow";
import { CodeValue, Translate } from "@/types/generics";
import loFind from "lodash/find";
import loFindIndex from "lodash/findIndex";
import loGet from "lodash/get";
import loSet from "lodash/set";
import loLast from "lodash/last";
import { convertArrayOfObjectToObject } from "@/utils/array";
import { TransactionAction } from "@/types/blockchain";
import { nearToYocto } from "@/utils/near";
import { NearService } from "@/services/nearService";
import { getValueByCode } from "@/utils/generics"
import loToNumber from "lodash/toNumber"
import { DAORights } from "@/types/dao";
import { instances } from "@firebase/logger/dist/src/logger";

export const getActivityById = (template: WFTemplate, id: number): WFActivity | undefined => loFind(template.activities, {'id': id});

export const getStartActivities = (template: WFTemplate): WFActivity[] => {
    const activities: WFActivity[] = [];

    //template.startActivityIds.map((id: number) => getActivityById(template, id)).forEach((item: WFActivity | undefined) => {
    //    if (item !== undefined) activities.push(item)
    //})

    return activities;
}

export const getEndActivities = (template: WFTemplate): WFActivity[] => {
    const activities: WFActivity[] = [];

    //template.endActivityIds.map((id: number) => getActivityById(template, id)).forEach((item: WFActivity | undefined) => {
    //    if (item !== undefined) activities.push(item)
    //})

    return activities;
}

export type WFTransitionFrom = {
    fromId: number;
    from: WFActivity;
    tos: WFActivity[];
}

export const getTransitions = (template: WFTemplate): WFTransitionFrom[] => {
    const transFrom: WFTransitionFrom[] = []
    
    /*
    let activityFrom: WFActivity | undefined = undefined
    let activityTo: WFActivity | undefined = undefined
    let transFromItem: WFTransitionFrom | undefined = undefined
    template.transactions.forEach((item: WFTransition) => {
        activityFrom = getActivityById(template, item.fromId)
        if (activityFrom === undefined) throw new Error(`Activity[${item.fromId}] not found`);
        activityTo = getActivityById(template, item.toId)
        if (activityTo === undefined) throw new Error(`Activity[${item.toId}] not found`);
        
        transFromItem = loFind(transFrom, {'fromId': activityFrom.id})
        if (transFromItem !== undefined) {
            transFromItem.tos.push(activityTo)
        } else {
            transFrom.push({fromId: activityFrom.id, from: activityFrom, tos: [activityTo]})
        }
    })
    */

    return transFrom
}

export const getActivities = (template: WFTemplate, activityIds: number[]): WFActivity[] => {
    const activities: WFActivity[] = [];

    activityIds.map((id: number) => getActivityById(template, id)).forEach((item: WFActivity | undefined) => {
        if (item !== undefined) activities.push(item)
    })

    return activities;
}

export const getTemplate = (templates: WFTemplate[], id: number): WFTemplate | undefined => {
    return loFind(templates, {'id': id});
}

export const getSettings = (template: WFTemplate, settingsId: number): WFSettings | undefined => {
    return loFind(template.settings, {'id': settingsId});
}

export const getLastActivity = (instance: WFInstance): WFInstanceLog | undefined => {
    return loLast(instance.actionLogs);
}

export const canFinish = (instance: WFInstance, template: WFTemplate): boolean => {
    // console.log('canFinish', instance, template)
    return instance.state === 'Running' && (instance.actionLastId !== undefined) ? template.endActionIds.includes(instance.actionLastId) : false;
}

export const settingsConstantsToTranslate = (template: WFTemplate, settingsId: number): Translate => {
    // const settings: WFSettings | undefined = getSettings(template, settingsId)
    // const params: Record<string, unknown> = (settings) ? convertArrayOfObjectToObject(settings.constants, 'code', 'value') : {}
    // console.log(settings, params)
    // return {key: 'wf_templ_' + template.code + '_constants', params: params}
    return {key: 'wf_templ_' + template.code + '_constants', params: {}}
}

export const getActivityRights = (settings: WFSettings, activity: WFActivity): DAORights[] => {
    return settings.actionRights[activity.actionIds[0]].rights
}

export const getNextActivities = (template: WFTemplate, actionLastId: number | undefined): WFActivity[] => {
    const activities: WFActivity[] = []
    if (actionLastId === undefined) { // at start
        template.startActionIds.forEach((actionId) => {
            template.activities.filter((activity) => activity.actionIds[0] === actionId).forEach((activity) => activities.push(activity))
        })
    } else { // transition
        template.transactions[actionLastId]?.toIds.forEach((actionId) => {
            template.activities.filter((activity) => activity.actionIds[0] === actionId).forEach((activity) => activities.push(activity))
        })
    }

    return activities
}

export const getActionsOfActivity = (template: WFTemplate, activityId: number): WFAction[] => {
    const actions: WFAction[] = []

    template.actions.filter((action) => template.activities[activityId].actionIds.includes(action.id)).forEach((action) => actions.push(action))

    return actions
}

export const testik = (data: WFData) => { return {
    "proposal_id": data.proposalId,
    "receiver_id": getValueByCode(data.inputs, 'receiverId'),
    "amount": getValueByCode(data.inputs, 'amount'),
}}

export const mapovani = {
    testik: testik,
    druhej: (data: WFData) => { return {
        "proposal_id": data.proposalId,
        "receiver_id": getValueByCode(data.inputs, 'receiverId'),
        "amount": getValueByCode(data.inputs, 'amount'),
    }}
}

export const getActionCallArgs = (action: WFActionCall, data: WFData): any => {
    let args: any = {proposal_id: data.proposalId}
    switch (action.method) {
        case 'treasury_send_near':
        case 'treasury_near_send':
            args = {
                "proposal_id": data.proposalId,
                "receiver_id": getValueByCode(data.inputs, 'receiverId'),
                "amount": getValueByCode(data.inputs, 'amount'),
            }
            break;
        default:
            break;
    }
    return args
}

export const runActivity = (activityId: number, workflow: WFInstance, template: WFTemplate, settings: WFSettings, nearService: NearService, contractId: string, form: CodeValue[]) => {
    const actions: TransactionAction[] = []
    const data: WFData = {
        proposalId: workflow.id,
        constants: [], //settings.constants,
        inputs: workflow.inputs,
        storageDao: [],
        storage: [],
        form: form,
    }

    console.log('Activity', activityId, data)

    console.log('Mapovani', mapovani.testik(data), mapovani.druhej(data))


    getActionsOfActivity(template, activityId).forEach((action: WFAction) => {
        console.log('Action', (action as WFActionCall))
        
        if ((action as WFActionCall).method !== undefined) { // smart contract
            actions.push({
                methodName: (action as WFActionCall).method,
                args: getActionCallArgs(action as WFActionCall, data),
                gas: action.gas,
                deposit: action.deposit,
            })
        } else { // functional call
            actions.push({
                methodName: 'function_call',
                args: {
                    proposal_id: data.proposalId,
                    action_id: (action as WFActionFunctionCall).fncallId,
                    action_arguments: {}, // TODO: Generate
                    gas: (action as WFActionFunctionCall).fncallGas,
                    deposit: (action as WFActionFunctionCall).fncallDeposit,
                },
                gas: action.gas,
                deposit: action.deposit,
            })
        }
    })

    console.log('signAndSendTransactions', contractId, actions)
    // nearService.signAndSendTransactions(contractId, actions)
}