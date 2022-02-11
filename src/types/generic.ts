import lodashFind from "lodash/find";

export type IDValue = {
    id: number;
    value: string | undefined;
}

export type CodeValue = {
    code: string;
    value: string | undefined;
}

export const getValueById = (items: IDValue[], id: number): string | undefined => {
    const item: IDValue | undefined = lodashFind(items, {id: id})
    return item ? item.value : undefined;
};

export const getIdByValue = (items: IDValue[], value: string): number | undefined => {
    const item: IDValue | undefined = lodashFind(items, {value: value})
    return item ? item.id : undefined;
};

export const getValueByCode = (items: CodeValue[], id: number): string | undefined => {
    const item: CodeValue | undefined | any = lodashFind(items, {code: id}) // TODO: Remove any
    return item ? item.value : undefined;
};

export type Translate = {
    key: string;
    params: Record<string, unknown>;
}