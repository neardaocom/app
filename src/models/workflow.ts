import { WFActivity, WFAttribute, WFInstance, WFInstanceActivity, WFSettings, WFTemplate, WFTransition } from "@/types/workflow";
import { Translate } from "@/types/generics";
import loFind from "lodash/find";
import loFindIndex from "lodash/findIndex";
import loGet from "lodash/get";
import loSet from "lodash/set";
import loLast from "lodash/last";
import { convertArrayOfObjectToObject } from "@/utils/array";
import { Action } from "@/types/blockchain";
import { nearToYocto } from "@/utils/near";

export const getActivityById = (template: WFTemplate, id: number): WFActivity | undefined => loFind(template.activities, {'id': id});

export const getStartActivities = (template: WFTemplate): WFActivity[] => {
    const activities: WFActivity[] = [];

    template.startActivityIds.map((id: number) => getActivityById(template, id)).forEach((item: WFActivity | undefined) => {
        if (item !== undefined) activities.push(item)
    })

    return activities;
}

export const getEndActivities = (template: WFTemplate): WFActivity[] => {
    const activities: WFActivity[] = [];

    template.endActivityIds.map((id: number) => getActivityById(template, id)).forEach((item: WFActivity | undefined) => {
        if (item !== undefined) activities.push(item)
    })

    return activities;
}

export type WFTransitionFrom = {
    fromId: number;
    from: WFActivity;
    tos: WFActivity[];
}

export const getTransitions = (template: WFTemplate): WFTransitionFrom[] => {
    const transFrom: WFTransitionFrom[] = []
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

export const getLastActivity = (instance: WFInstance): WFInstanceActivity | undefined => {
    return loLast(instance.activityLogs);
}

export const canFinish = (instance: WFInstance, templates: WFTemplate[]): boolean => {
    const last: WFInstanceActivity | undefined = getLastActivity(instance);
    const template: WFTemplate | undefined = getTemplate(templates, instance.templateId)
    return (last && template) ? template.endActivityIds.includes(last.activityId) : false;
}

export const settingsConstantsToTranslate = (template: WFTemplate, settingsId: number): Translate => {
    const settings: WFSettings | undefined = getSettings(template, settingsId)
    const params: Record<string, unknown> = (settings) ? convertArrayOfObjectToObject(settings.constants, 'code', 'value') : {}
    // console.log(settings, params)
    return {key: 'wf_templ_' + template.code + '_constants', params: params}
}

export const runActivity = (activityCode: string, template: WFTemplate, nearService: any, contractId: string) => {
    const actions: Action[] = []
    const activity = loFind(template.activities, {code: activityCode})
    console.log('Activity', activity?.code)

    activity!.actions.forEach((action) => {
        console.log('Action', action.smartContractMethod)
        if (activity!.smartContractId === "") { // smart contract
            actions.push({
                methodName: action.smartContractMethod,
                args: {}, // TODO: Generate args
                gas: 10, // TODO: Gas?
                deposit: 0, // TODO: Deposit?
            })
        } else { // functional call
            actions.push({
                methodName: 'function_call',
                args: {
                    proposal_id: 0,
                    action_id: action.smartContractMethod,
                    action_arguments: {},
                    deposit: 0, // yoctoNear
                    gas: 0,
                }, // TODO: Generate args
                gas: 10, // TODO: Gas?
                deposit: 0, // TODO: Deposit?
            })
        }
        
        console.log('signAndSendTransactions', contractId, actions)
        // nearService.signAndSendTransactions(contractId, actions)
    })

    //if (activity!.smartContractId === "") {

    //}
}