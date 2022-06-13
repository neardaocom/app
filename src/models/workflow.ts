import { WFAction, WFActionFunctionCall, WFActionCall, WFActivity, WFAttribute, WFData, WFInstance, WFInstanceLog, WFSettings, WFTemplate, WFTransition, WFMetaTemplate, WFInstanceLogDTO, WFMetaForm } from "@/models/dao/types/workflow";
import { CodeValue, Translate } from "@/models/utils/types/generics";
import loFind from "lodash/find";
import loFindIndex from "lodash/findIndex";
import loGet from "lodash/get";
import loSet from "lodash/set";
import loLast from "lodash/last";
import loToNumber from "lodash/toNumber"
import loMerge from "lodash/merge"
import ArrayHelper from "@/models/utils/ArrayHelper";
import { TransactionAction } from "@/models/nearBlockchain/types/blockchain";
import NearService from "@/models/services/nearService/NearService";
import { DAORights } from "@/models/dao/types/dao";
import { templateMetas } from "@/data/workflow";

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

// vote to DaoProposal
export const getTemplate = (templates: Record<number, WFTemplate>, id: number): WFTemplate | undefined => {
    return loFind(templates, {'id': id});
}

export const getTemplateByCode = (templates: Record<number, WFTemplate>, code: string): WFTemplate | undefined => {
    return loFind(templates, {'code': code});
}
// vote to DaoProposal
export const getSettings = (template: WFTemplate, settingsId: number): WFSettings | undefined => {
    return loFind(template.settings, {'id': settingsId});
}

export const getLastActivity = (instance: WFInstance): WFInstanceLog | undefined => {
    return loLast(instance.activityLogs);
}

// vote to DaoProposal
export const canFinish = (instance: WFInstance, template: WFTemplate): boolean => {
    // console.log('canFinish', instance, template)
    return instance.state === 'Running' && (instance.activityLastId !== undefined) ? template.endActivityIds.includes(instance.activityLastId) : false;
}

export const settingsConstantsToTranslate = (template: WFTemplate, settingsId: number): Translate => {
    // const settings: WFSettings | undefined = getSettings(template, settingsId)
    // const params: Record<string, unknown> = (settings) ? ArrayHelper.convertArrayOfObjectToObject(settings.constants, 'code', 'value') : {}
    // console.log(settings, params)
    // return {key: 'wf_templ_' + template.code + '_constants', params: params}
    return {key: 'wf_templ_' + template.code + '_description', params: {}}
}

export const metaGetActivityForm = (templateCode: string, activityCode: string): WFMetaForm | undefined => {
    //return loFind(loGet(templateMetas, [templateCode])?.activities, {code: activityCode})?.form
    return undefined
}

// move to DaoProposal
export const getActivityRights = (settings: WFSettings, activity: WFActivity): DAORights[] => {
    return settings.activityRights[activity.actionIds[0]]
}

// vote to DaoProposal
export const getNextActivities = (template: WFTemplate, actionLastId: number | undefined): WFActivity[] => {
    const activities: WFActivity[] = []
    if (actionLastId === undefined) { // at start
        template.startActivityIds.forEach((actionId) => {
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

    // template.actions.filter((action) => template.activities[activityId].actionIds.includes(action.id)).forEach((action) => actions.push(action))

    return actions
}