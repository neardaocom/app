import loFind from "lodash/find";
import loToString from "lodash/toString";
import loGet from "lodash/get";
import loIsEqual from "lodash/isEqual";
import { SelectOption } from "./types/SelectOption";

export default class CollectionHelper {

    static findParam(data: any, filter: object, param: string[]): string | undefined {
        const file = loFind(data, filter)
        return file ? loToString(loGet(file, param)) : undefined
    }

    static findDeep<T extends object>(data: T, path: string[], value: any): T[keyof T] | undefined {
        return loFind(data, (item): boolean => loIsEqual(loGet(item, path), value)) // loMatchesProperty(path, value)
    }

    static toOptions(list: object[], textPath: string[], valuePath: string[]): SelectOption[] {
        return list.map((item) => {
            return {text: loGet(item, textPath) || null, value: loGet(item, valuePath) || null}
        })
    }
}