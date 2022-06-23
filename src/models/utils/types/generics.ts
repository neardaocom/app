
export type IDValue = {
    id: number;
    value: string | undefined;
}

export type CodeValue = {
    code: string;
    value: string | undefined;
}

export type Translate = {
    key: string;
    params: Record<string, unknown>;
}

/**
 * Comes form https://momentjs.com/docs/#/durations/
 */
export type Interval = {
    seconds?: number;
    minutes?: number;
    hours?: number;
    days?: number;
    weeks?: number;
    months?: number;
    years?: number;
}

export type DateFormated = {
    value: Date;
    date: string;
    time: string;
}