import { WFActivity, WFAttribute, WFTemplate, WFTransition } from "@/types/workflow";
import lodashFind from "lodash/find";
import lodashFindIndex from "lodash/findIndex";
import lodashGet from "lodash/get";
import lodashSet from "lodash/set";

export const getActivityById = (instance: WFTemplate, id: number): WFActivity | undefined => lodashFind(instance.activities, {'id': id});

export const getStartActivities = (instance: WFTemplate): WFActivity[] => {
    const activities: WFActivity[] = [];

    instance.startActivityIds.map((id: number) => getActivityById(instance, id)).forEach((item: WFActivity | undefined) => {
        if (item !== undefined) activities.push(item)
    })

    return activities;
}

export const getEndActivities = (instance: WFTemplate): WFActivity[] => {
    const activities: WFActivity[] = [];

    instance.endActivityIds.map((id: number) => getActivityById(instance, id)).forEach((item: WFActivity | undefined) => {
        if (item !== undefined) activities.push(item)
    })

    return activities;
}

export type WFTransitionFrom = {
    fromId: number;
    from: WFActivity;
    tos: WFActivity[];
}

export const getTransitions = (instance: WFTemplate): WFTransitionFrom[] => {
    const transFrom: WFTransitionFrom[] = []
    let activityFrom: WFActivity | undefined = undefined
    let activityTo: WFActivity | undefined = undefined
    let transFromItem: WFTransitionFrom | undefined = undefined

    instance.transactions.forEach((item: WFTransition) => {
        activityFrom = getActivityById(instance, item.fromId)
        if (activityFrom === undefined) throw new Error(`Activity[${item.fromId}] not found`);
        activityTo = getActivityById(instance, item.toId)
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