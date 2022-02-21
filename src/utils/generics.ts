import lodashFind from "lodash/find"
import { IDValue, CodeValue, Interval } from "@/types/generics";
import moment from "moment";

export const getValueById = (items: IDValue[], id: number): string | undefined => {
    const item: IDValue | undefined = lodashFind(items, {id: id})
    return item ? item.value : undefined;
};

export const getIdByValue = (items: IDValue[], value: string): number | undefined => {
    const item: IDValue | undefined = lodashFind(items, {value: value})
    return item ? item.id : undefined;
};

export const getValueByCode = (items: CodeValue[], id: string): string | undefined => {
    const item: CodeValue | undefined | any = lodashFind(items, {code: id}) // TODO: Remove any
    return item ? item.value : undefined;
};

export const addInterval = (value: Date, interval: Interval): Date => moment(value).add(interval).toDate();

export const subtractInterval = (value: Date, interval: Interval): Date => moment(value).subtract(interval).toDate();