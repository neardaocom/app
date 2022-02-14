import { WFAction, WFActionFunctionCall, WFActionCall, WFActivity, WFAttribute, WFData, WFInstance, WFInstanceAction, WFSettings, WFTemplate, WFTransition } from "@/types/workflow";
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

export const getLastActivity = (instance: WFInstance): WFInstanceAction | undefined => {
    return loLast(instance.actionLogs);
}

export const canFinish = (instance: WFInstance, templates: WFTemplate[]): boolean => {
    const last: WFInstanceAction | undefined = getLastActivity(instance);
    const template: WFTemplate | undefined = getTemplate(templates, instance.templateId)
    return (last && template) ? template.endActionIds.includes(last.actionId) : false;
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

export const getActionArgs = (action: WFActionCall, data: WFData): any => {
    let args: any = {proposal_id: data.proposalId}
    switch (action.method) {
        case 'treasury_send_near':
        case 'treasury_near_send':
            args = {
                "proposal_id": data.proposalId,
                "receiver_id": getValueByCode(data.proposal, 'receiverId'),
                "amount": nearToYocto(loToNumber(getValueByCode(data.proposal, 'amount'))),
            }
            break;
        default:
            break;
    }
    return args
}

export const runActivity = (activityCode: string, workflow: WFInstance, template: WFTemplate, settings: WFSettings, nearService: NearService, contractId: string, form: CodeValue[]) => {
    const actions: TransactionAction[] = []
    const activity = loFind(template.activities, {code: activityCode})
    console.log('Activity', activity?.code)

    const data: WFData = {
        proposalId: workflow.id,
        settings: [], //settings.constants,
        proposal: workflow.inputs,
        storageDao: [],
        storage: [],
        form: form,
    }

    /*
    activity!.actions.forEach((action: WFAction) => {
        console.log('Action', action, getActionArgs(action, data))
        if (activity!.smartContractId === "") { // smart contract
            actions.push({
                methodName: action.smartContractMethod,
                args: getActionArgs(action, data), // TODO: Generate args
                gas: action.gas, // TODO: Gas?
                deposit: action.deposit, // TODO: Deposit?
            })
        } else { // functional call
            actions.push({
                methodName: 'function_call',
                args: {
                    proposal_id: 0,
                    action_id: action.id,
                    action_arguments: {},
                    gas: action.gas,
                    deposit: action.deposit,
                }, // TODO: Generate args
                gas: 10, // TODO: Gas?
                deposit: 0, // TODO: Deposit?
            })
        }
        
        console.log('signAndSendTransactions', contractId, actions)
        // nearService.signAndSendTransactions(contractId, actions)
    })
    */
    //if (activity!.smartContractId === "") {

    //}
}