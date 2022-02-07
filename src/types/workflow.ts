import { DAORights, DAOVoteLevel } from "@/types/dao";

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
    id: number;
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
    constants: WFAttribute[];
    attributes: WFAttribute[];
    activities: WFActivity[];
    transactions: WFTransition[];
    startActivityIds: number[];
    endActivityIds: number[];
    search: string;
    settings: WFSettings[];
}

export type WFSettingsActivity = {
    activityId: number;
    rights: DAORights[];
}

export type WFSettings = {
    id: number;
    constants: WFInput[];
    proposeRights: DAORights[];
    voteRight: DAORights;
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
    templateId: number;
    settingsId: number;
    state: string;
    inputs: WFInput[];
    activityNextIds: number[];
    activityLogs: WFInstanceActivity[];
    search: string;
}