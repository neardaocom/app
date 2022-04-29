import lodashFind from "lodash/find";
import lodashToString from "lodash/toString";
import lodashGet from "lodash/get";

export default class CollectionHelper {

    static findParam(data: any, filter: object, param: string[]): string | undefined {
        const file = lodashFind(data, filter)
        return file ? lodashToString(lodashGet(file, param)) : undefined
    }
}