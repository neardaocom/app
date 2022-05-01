export type Validation = {
    valid: boolean;
    message?: string;
    params?: any;
};

export type ValidationParamsMin = {
    min: number;
};

export type ValidationParamsMax = {
    max: number;
};

export type ValidationParamsMinDate = {
    min: Date;
};

export type ValidationParamsMaxDate = {
    max: Date;
};