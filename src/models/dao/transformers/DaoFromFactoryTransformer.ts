import TransformerInterface from "../../interfaces/Transformer.interface";
import loToInteger from "lodash/toInteger";
import { ListItemDto } from "../types/admin";
import StringHelper from "../../utils/StringHelper";
import NearUtils from "../../nearBlockchain/Utils";

export default class DaoFromFactoryTransformer implements TransformerInterface {
    private t: Function;
    private n: Function;
    private tags: string[];

    constructor(t: Function, n: Function, tags: string[]) {
        this.t = t;
        this.n = n;
        this.tags = tags;
    }

    transform(value: any, params: any) {
        const data: ListItemDto =  {
            id: value[0],
            index: params.index,
            name: value[1].name,
            created: NearUtils.dateFromChain(value[1].founded_s),
            walletId: value[0],
            description: value[1].description,
            location: undefined, // value[1].lang,
            ftName: value[1].ft_name,
            ftAmount: this.n(value[1].ft_amount),
            tags: value[1].tags.map((tag: any) => this.tags[loToInteger(tag)]),
            search: '',
        };
        data.search = [
            StringHelper.toSearch(data.id),
            StringHelper.toSearch(data.name),
            StringHelper.toSearch(data.description),
            StringHelper.toSearch(data.ftName ?? ''),
        ].concat(data.tags.map((tag: any) => StringHelper.toSearch(tag))).join('-');

        return data
    }
}