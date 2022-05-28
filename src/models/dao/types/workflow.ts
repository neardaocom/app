import { DAORights, DAOVoteLevel } from "@/models/dao/types/dao";
import { CodeValue } from "../../utils/types/generics";


export type WFMetaAttribute = {
    code: string;
    bindId: number;
}

export type WFMetaAction = {
    id: number;
    args: Function;
    argsCollection?: Function;
    log: Function;
    gas: Function; // TGas
    deposit: Function; // Near
}

export type WFMetaForm = {
    component: string;
    schema: Function;
}

export type WFMetaActivity = {
    id: number;
    args: Function;
    log: Function;
}

export type WFMetaTemplate = {
    id: number;
    code: string;
    constants: WFMetaAttribute[];
    inputs: WFMetaAttribute[];
    activities: WFMetaActivity[];
    actions: WFMetaAction[];
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


export type WFActionFunctionCall = {
    id: number;
    activityId: number;
    gas: Function; // TGas
    deposit: Function; // Near
    fncallReceiver: string;
    fncallMethod: string;
    fncallGas: number; // TGas
    fncallDeposit: number; // Near
}

export type WFActionCall = {
    id: number;
    activityId: number;
    gas: Function; // TGas
    deposit: Function; // Near
    method: string;
}

export type WFAction = WFActionCall | WFActionFunctionCall

export type WFActivity = {
    id: number;
    code: string;
    automatic?: boolean;
    actionIds: number[];
    attributes: WFAttribute[];
}

export type WFTransition = {
    id: number;
    toIds: number[];
}

export type WFTemplate = {
    id: number;
    code: string;
    name: string;
    version: string;
    autoExecute: boolean;
    needStorage: boolean;
    activities: WFActivity[];
    // actions: WFAction[];
    transactions: WFTransition[];
    startActivityIds: number[];
    endActivityIds: number[];
    settings: WFSettings[];
    search?: string;
    // constants: WFAttribute[];
    // attributes: WFAttribute[];
}

export type WFSettingsAction = {
    actionId: number;
    rights: DAORights[];
}

export type WFSettings = {
    id: number;
    proposeRights: DAORights[];
    voteRight: DAORights;
    voteLevel: DAOVoteLevel;
    activityRights: Record<number, DAORights[]>;
    constants: CodeValue[];
}

export type WFInstanceLog = {
    id: number;
    activityId: number;
    activity?: WFActivity | null;
    actionId?: number;
    txHash?: string;
    txBlock?: string;
    txSigner: String;
    txSignedAt: Date;
    args: Record<string, unknown>;
}

export type WFInstance = {
    id: number;
    templateId: number;
    settingsId: number;
    state: string;
    storage: string;
    inputs: CodeValue[];
    constants: CodeValue[];
    activityLastId: number;
    activityLogs: WFInstanceLog[];
    search: string;
}

export type WFData = {
    daoId: string;
    proposalId: number;
    constants: CodeValue[];
    inputs: CodeValue[];
    storageDao: CodeValue[];
    storage: CodeValue[];
    form: Record<string, unknown>;
}

export type WFInstanceLogDTO = {
    activity: WFActivity;
    txSigner: String;
    txSignedAt: Date;
    actions: WFAction[];
    logs: WFInstanceLog[];
    args: Record<string, unknown>;
}