import { DAORight, DAOVoteLevel } from "@/types/dao";

export type WFAttribute = {
    code: string;
    name: string;
    default?: string;
    description?: string;
}

export type WFInput = {
    code: string;
    value: string;
}

export type WFExpression = {
    id: number;
    type: string;
    value: string;
}

export type WFAction = {
    name: string;
    code: string;
    smartContractMethod: string;
}

export type WFActivity = {
    id: number;
    name: string;
    code: string;
    smartContractId?: string;
    attributes: WFAttribute[];
    actions: WFAction[];
}

export type WFTransition = {
    id: number;
    fromId: number;
    toId: number;
}

export type WFTemplate = {
    id: number;
    name: string;
    version: string;
    code: string;
    attributes: WFAttribute[];
    activities: WFActivity[];
    transactions: WFTransition[];
    startActivityIds: number[];
    endActivityIds: number[];
    search: text;
}

export type WFSettingsActivity = {
    activityId: number;
    rights: DAORight[];
}

export type WFSettings = {
    id: number;
    template: WFTemplate;
    inputs: WFInput[];
    proposeRights: DAORight[];
    voteRight: DAORight;
    voteLevel: DAOVoteLevel;
    activities: WFSettingsActivity[];
}

export type WFInstanceActivity = {
    id: number;
    activityId: number;
    rank: number;
    txHash: string;
    txSigner: String;
    txSignedAt: Date;
    inputs: WFInput[];
}

export type WFInstance = {
    id: number;
    settings: WFSettings;
    state: string;
    inputs: WFInput[];
    activityNextIds: number[];
    activityLogs: WFInstanceActivity[];
    search: string;
}