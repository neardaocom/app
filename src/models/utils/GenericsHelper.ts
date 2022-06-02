import loFind from "lodash/find"
import loSet from "lodash/set"
import moment from "moment";
import { IDValue, CodeValue, Interval } from "./types/generics";

export default class GenericsHelper {

    static getValueById(items: IDValue[], id: number): string | undefined {
        const item: IDValue | undefined = loFind(items, {id: id})
        return item ? item.value : undefined;
    }

    static createIDValue(items: string[]): IDValue[] {
        return items.map((value, index) => ({ id: index, value: value}));
    }

    static createIDValueFromObject(value: object): IDValue[] {
        return Object.keys(value).map((key, index) => ({ id: index, value: value[key.toString()]}));
    }

    static createCodeValueFromObject(value: object): CodeValue[] {
        return Object.keys(value).map((key) => ({ code: key, value: value[key]}));
    }

    static createObjectFromCodeValue(items: CodeValue[]): Record<string, unknown> {
        const createdObject: Record<string, unknown> = {}
        items.forEach((item) => {
            loSet(createdObject, [item.code], item.value)
        })
        return createdObject
    }

    static getIdByValue(items: IDValue[], value: string): number | undefined {
        const item: IDValue | undefined = loFind(items, {value: value})
        return item ? item.id : undefined;
    }

    static getValueByCode(items: CodeValue[], id: string): string | undefined {
        const item: CodeValue | undefined | any = loFind(items, {code: id}) // TODO: Remove any
        return item ? item.value : undefined;
    }

    static addInterval(value: Date, interval: Interval): Date {
        return moment(value).add(interval).toDate();
    }

    static subtractInterval(value: Date, interval: Interval): Date {
        return moment(value).subtract(interval).toDate();
    }
}