import { Ref } from "vue";
import loGet from "lodash/get";
import loSet from "lodash/set";

export default class Register {
    private list = {}

    set(key: string, service: Ref) {
        loSet(this.list, [key], service)
    }

    get(key: string): Ref | undefined {
        return loGet(this.list, [key]);
    }

    count() {
        return Object.keys(this.list).length
    }

    getList() {
        return this.list
    }
}