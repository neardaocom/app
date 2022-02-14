import { DAORights, DAOVoteLevel } from "@/types/dao";
import { CodeValue } from "./generics";


export type WFMetaAttribute = {
    code: string;
    bindId: number;
}

export type WFMetaActivity = {
    activityId: number;
    attributes: WFMetaAttribute[];
}

export type WFMetaTemplate = {
    settingsAttributes: WFMetaAttribute[];
    proposalAttributes: WFMetaAttribute[];
    activities: WFMetaActivity[];
};

export type WFAttribute = {
    code: string;
    name: string;
    default?: string;
    description?: string;
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
    gas: number; // TGas
    deposit: number; // Near
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
    constants: CodeValue[];
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
    inputs: CodeValue[];
}

export type WFInstance = {
    id: number;
    templateId: number;
    settingsId: number;
    state: string;
    inputs: CodeValue[];
    constants: CodeValue[];
    activityNextIds: number[];
    activityLogs: WFInstanceActivity[];
    search: string;
}

export type WFData = {
    proposalId: number;
    settings: CodeValue[];
    proposal: CodeValue[];
    storageDao: CodeValue[];
    storage: CodeValue[];
    form: CodeValue[];
}