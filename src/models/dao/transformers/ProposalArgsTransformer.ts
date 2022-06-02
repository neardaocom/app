import TransformerInterface from "@/models/interfaces/Transformer.interface";
import loToNumber from "lodash/toNumber"
import loToString from "lodash/toString"
import loGet from "lodash/get"
import loFind from "lodash/find"
import loAssign from "lodash/assign"
import { WFTemplate } from "../types/workflow";
import NearUtils from "@/models/nearBlockchain/Utils";
import DateHelper from "@/models/utils/DateHelper";
import GenericsHelper from "@/models/utils/GenericsHelper";
import { MarketTemplate } from "../types/market";

export default class ProposalArgsTransformer implements TransformerInterface {
    private templates: Record<number, WFTemplate>;
    private templatesMeta: MarketTemplate[];
    private t: Function;
    private d: Function;
    private n: Function;

    constructor(
        templates: Record<number, WFTemplate>,
        templatesMeta: MarketTemplate[],
        t: Function,
        d: Function,
        n: Function
    ) {
        this.templates = templates
        this.templatesMeta = templatesMeta
        this.t = t
        this.d = d
        this.n = n
    }

    // static getArgs(value: DAOProposal, templateCode: string, t: Function, d: Function, n: Function):  {
    transform(value: any): Record<string, unknown> {
        const values: Record<string, unknown> = {}
        //console.log(value)
        
        const template = loGet(this.templates, [value.templateId])

        // constants
        loAssign(values, GenericsHelper.createObjectFromCodeValue(value.constants))
        // inputs
        loAssign(values, GenericsHelper.createObjectFromCodeValue(value.inputs))

        // console.log(proposal, templateCode)
        switch (template.code) {
            case 'basic_pkg1': {
                    switch (value.workflowScenarioId.toString()) {
                        case '1': {
                                const templateId = loToNumber(GenericsHelper.getValueByCode(value.inputs, 'id'))
                                const templateMetaItem = loFind(this.templatesMeta, { id: templateId })
                                //console.log(templateId, providerId, templateMetaItem)
                                loAssign(values, {
                                    templateId,
                                    template: templateMetaItem?.name,
                                })
                            }
                            break;
                        case '2': {
                                // TODO: Content?
                                /*
                                values = value.content?.Media as Record<string, unknown> ?? {}
                                if (loGet(value, ['content', 'Media', 'media_type', 'Link']) !== undefined) {
                                    values.source = loGet(value, ['content', 'Media', 'media_type', 'Link'])
                                }
                                if (loGet(value, ['content', 'Media', 'media_type', 'Text']) !== undefined) {
                                    values.source = loGet(value, ['content', 'Media', 'media_type', 'Text'])
                                }
                                */
                            }
                            break;
                        default:
                            break;
                    }
                }
                break;
            default:
                break;
        }

        return values;
    }
}