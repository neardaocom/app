import { WFAction, WFActionFunctionCall, WFActionCall, WFActivity, WFAttribute, WFData, WFInstance, WFInstanceLog, WFSettings, WFTemplate, WFTransition, WFMetaTemplate, WFInstanceLogDTO, WFMetaForm } from "@/types/workflow";
import { CodeValue, Translate } from "@/types/generics";
import loFind from "lodash/find";
import loFindIndex from "lodash/findIndex";
import loGet from "lodash/get";
import loSet from "lodash/set";
import loLast from "lodash/last";
import loToNumber from "lodash/toNumber"
import loMerge from "lodash/merge"
import { convertArrayOfObjectToObject } from "@/utils/array";
import { TransactionAction } from "@/types/blockchain";
import { nearToYocto } from "@/utils/near";
import { NearService } from "@/services/nearService";
import { getValueByCode } from "@/utils/generics"
import { DAORights } from "@/types/dao";
import { instances } from "@firebase/logger/dist/src/logger";
import { templateMeta } from "@/data/workflow";

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

export const metaGetActivityForm = (templateCode: string, activityCode: string): WFMetaForm | undefined => {
    return loFind(loGet(templateMeta, [templateCode])?.activities, {code: activityCode})?.form
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

export const runActivity = (activityCode: string, workflow: WFInstance, template: WFTemplate, settings: WFSettings, nearService: NearService, contractId: string, data: WFData) => {
    const activity: WFActivity | undefined = loFind(template.activities, {code: activityCode})

    const actions: TransactionAction[] = []

    const meta: WFMetaTemplate = loGet(templateMeta, [template.code])

    // console.log('Activity', activityId, data)

    getActionsOfActivity(template, activity!.id).forEach((action: WFAction) => {
        // console.log('Action', (action as WFActionCall))
        
        if ((action as WFActionCall).method !== undefined) { // smart contract
            actions.push({
                methodName: (action as WFActionCall).method,
                args: meta.actions[action.id].args(data),
                gas: action.gas,
                deposit: action.deposit,
            })
        } else { // functional call
            actions.push({
                methodName: 'function_call',
                args: {
                    proposal_id: data.proposalId,
                    action_id: (action as WFActionFunctionCall).fncallId,
                    action_arguments: meta.actions[action.id].args(data),
                    gas: (action as WFActionFunctionCall).fncallGas,
                    deposit: (action as WFActionFunctionCall).fncallDeposit,
                },
                gas: action.gas,
                deposit: action.deposit,
            })
        }
    })

    console.log('signAndSendTransactions', contractId, actions)
    nearService.signAndSendTransactions(contractId, actions)
}


export const transformLogs = (logs: WFInstanceLog[], template: WFTemplate): WFInstanceLogDTO[] => {
    const list: WFInstanceLogDTO[] = []
    let item: WFInstanceLogDTO | undefined = undefined
    let action: WFAction | undefined = undefined
    let activity: WFActivity | undefined = undefined
    logs.forEach((log) => {
        // get action
        action = template.actions[log.actionId]
        activity = template.activities[action.activityId]

        // detect activity change
        if (
            (action?.activityId ?? null) === activity.id // activityId not changed
            &&
            action.id !== activity.actionIds[0] // action is not the first
            &&
            log.txSigner === item?.txSigner // signers equal
        ) { // add action
            item!.actions.push(action)
            item!.logs.push(log)
            item!.args = loMerge(item!.args, log.args)
        } else { // new
            if (item !== undefined) list.push(item)
            activity = template.activities[action.activityId]
            item = {
                activity: activity,
                txSigner: log.txSigner,
                txSignedAt: log.txSignedAt,
                actions: [action],
                logs: [log],
                args: log.args
            }
        }
    })

    if (item !== undefined) list.push(item)

    return list
}