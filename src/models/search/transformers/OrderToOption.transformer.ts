import TransformerInterface from "../../interfaces/Transformer.interface";
import { SelectOption } from "../../utils/types/SelectOption";

export default class OrderToOption implements TransformerInterface {
    private t: Function;

    constructor(t: Function) {
        this.t = t;
    }

    transform(value: any, params: any): SelectOption {
        return { text: this.t(value.translateKey), value: value.code };
    }
}