import { DAORights, DAOVoteLevel } from "@/types/dao";
import { CodeValue } from "./generics";


export type WFMetaAttribute = {
    code: string;
    bindId: number;
}

export type WFMetaAction = {
    id: number;
    args: Function;
}

export type WFMetaActivity = {
    activityCode: string;
    form: WFMetaAttribute[];
}

export type WFMetaTemplate = {
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
    gas: number; // TGas
    deposit: number; // Near
    fncallId: number;
    fncallGas: number; // TGas
    fncallDeposit: number; // Near
}

export type WFActionCall = {
    id: number;
    activityId: number;
    gas: number; // TGas
    deposit: number; // Near
    method: string;
}

export type WFAction = WFActionCall | WFActionFunctionCall

export type WFActivity = {
    id: number;
    code: string;
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
    version: string;
    actions: WFAction[];
    activities: WFActivity[];
    transactions: WFTransition[];
    startActionIds: number[];
    endActionIds: number[];
    search: string;
    settings: WFSettings[];
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
    actionRights: WFSettingsAction[];
    // constants: CodeValue[];
}

export type WFInstanceLog = {
    id: number;
    actionId: number;
    txHash?: string;
    txBlock?: string;
    txSigner: String;
    txSignedAt: Date;
    args: CodeValue[];
}

export type WFInstance = {
    id: number;
    templateId: number;
    settingsId: number;
    state: string;
    storage: string;
    inputs: CodeValue[];
    constants: CodeValue[];
    actionLastId: number | undefined;
    actionLogs: WFInstanceLog[];
    search: string;
}

export type WFData = {
    proposalId: number;
    constants: CodeValue[];
    inputs: CodeValue[];
    storageDao: CodeValue[];
    storage: CodeValue[];
    form: CodeValue[];
}

export type WFInstanceLogDTO = {
    activity: WFActivity;
    actions: WFAction[];
    proposal: CodeValue[];
    storageDao: CodeValue[];
    storage: CodeValue[];
    form: CodeValue[];
}