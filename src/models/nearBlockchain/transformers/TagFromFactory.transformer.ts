import TransformerInterface from "@/models/interfaces/Transformer.interface";
import loToString from "lodash/toString";

export default class TagFromFactory implements TransformerInterface {
    private t: Function;

    constructor(t: Function) {
        this.t = t;
    }

    transform(value: any, params: any) {
        return this.t('default.' + loToString(value))
    }
}