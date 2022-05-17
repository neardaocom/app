import lodashFind from "lodash/find"
import moment from "moment";
import { IDValue, CodeValue, Interval } from "./types/generics";

export default class GenericsHelper {

    static getValueById(items: IDValue[], id: number): string | undefined {
        const item: IDValue | undefined = lodashFind(items, {id: id})
        return item ? item.value : undefined;
    }

    static createIDValue(items: string[]): IDValue[] {
        return items.map((value, index) => ({ id: index, value: value}));
    }
    static createIDValueFromObject(value: object): IDValue[] {
        return Object.keys(value).map((key, index) => ({ id: index, value: value[key.toString()]}));
    }
    

    static getIdByValue(items: IDValue[], value: string): number | undefined {
        const item: IDValue | undefined = lodashFind(items, {value: value})
        return item ? item.id : undefined;
    }

    static getValueByCode(items: CodeValue[], id: string): string | undefined {
        const item: CodeValue | undefined | any = lodashFind(items, {code: id}) // TODO: Remove any
        return item ? item.value : undefined;
    }

    static addInterval(value: Date, interval: Interval): Date {
        return moment(value).add(interval).toDate();
    }

    static subtractInterval(value: Date, interval: Interval): Date {
        return moment(value).subtract(interval).toDate();
    }
}