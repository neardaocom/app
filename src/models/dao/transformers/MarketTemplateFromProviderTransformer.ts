import TransformerInterface from "../../interfaces/Transformer.interface";
import StringHelper from "../../utils/StringHelper";
import loToString from "lodash/toString"

export default class MarketTemplateFromProviderTransformer implements TransformerInterface {
    private t: Function;

    constructor(t: Function) {
        this.t = t;
    }

    transform(value: any, params: any) {
        // console.log(value)
        const installedCodes: string[] = params.installedCodes || []
        return {
            id: value.id,
            version: loToString(value.version),
            code: value.code,
            name: this.t('wf_templ_' + value.code),
            status: this.t('' + (installedCodes.includes(value.code) ? 'installed' : 'buy')),
            search: [StringHelper.toSearch(this.t('wf_templ_' + value.code)), StringHelper.toSearch(this.t('workflow'))].join('-'),
        }
    }
}