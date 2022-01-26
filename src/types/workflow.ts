export type WFInput = {
    code: string;
    name: string;
    value: string;
}

export type WFAction = {
    name: string;
    smartContractMethod: string;
}

export type WFActivity = {
    id: number;
    name: string;
    code: string;
    rank: number;
    smartContractId: string;
    txHash?: string;
    txSignedAt?: Date;
    txSigner?: String;
    inputs: WFInput[];
    actions: WFAction[];
}

export type WFInstance = {
    id: number;
    name: string; // template
    code: string;
    state: string;
    inputs: WFInput[];
    activitiesNext: WFActivity[];
    activitiesLog: WFActivity[];
    ends: string[];
    search: string;
}