export type ItemKey = { key: string; };
export type ParamRef = { ref: string; };
export type ParamConfig = { path: string[]; };
export type ParamValue = { value: string; };

export type Param = ParamRef | ParamConfig | ParamValue;

export type Type = 'Class' | 'Factory';

export type Item = {
    key: ItemKey;
    path: string;
    constructor: boolean;
    constructorParams: Param[];
    instance?: Object;
};
