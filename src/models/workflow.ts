import { WFActivity, WFAttribute, WFInstance, WFInstanceActivity, WFTemplate, WFTransition } from "@/types/workflow";
import lodashFind from "lodash/find";
import lodashFindIndex from "lodash/findIndex";
import lodashGet from "lodash/get";
import lodashSet from "lodash/set";
import lodashLast from "lodash/last";

export const getActivityById = (template: WFTemplate, id: number): WFActivity | undefined => lodashFind(template.activities, {'id': id});

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
        
        transFromItem = lodashFind(transFrom, {'fromId': activityFrom.id})
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

export const getLastActivity = (instance: WFInstance): WFInstanceActivity | undefined => {
    return lodashLast(instance.activityLogs);
}

export const canFinish = (instance: WFInstance): boolean => {
    const last: WFInstanceActivity | undefined = getLastActivity(instance);
    return last ? instance.settings.template.endActivityIds.includes(last.activityId) : false;
}