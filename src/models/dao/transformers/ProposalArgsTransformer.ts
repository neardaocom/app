import TransformerInterface from "@/models/interfaces/Transformer.interface";
import loToNumber from "lodash/toNumber"
import loToString from "lodash/toString"
import loGet from "lodash/get"
import loSet from "lodash/set"
import loFind from "lodash/find"
import loAssign from "lodash/assign"
import { WFTemplate } from "../types/workflow";
import NearUtils from "@/models/nearBlockchain/Utils";
import DateHelper from "@/models/utils/DateHelper";
import GenericsHelper from "@/models/utils/GenericsHelper";
import { MarketTemplate } from "../types/market";
import { DAODocs, DAODocsFile, DAODocsFileType } from "../types/docs";
import { ResourceType, ResourceTypeText } from "@/models/nearBlockchain/types/resource";
import ProposalResourceTransformer from "./ProposalResourceTransformer";
import NumberHelper from "@/models/utils/NumberHelper";

export default class ProposalArgsTransformer implements TransformerInterface {
    private templates: Record<number, WFTemplate>;
    private templatesMeta: MarketTemplate[];
    private docs: DAODocs;
    private t: Function;
    private d: Function;
    private n: Function;
    private proposalResourceTransformer: TransformerInterface;


    constructor(
        templates: Record<number, WFTemplate>,
        templatesMeta: MarketTemplate[],
        docs: DAODocs,
        t: Function,
        d: Function,
        n: Function
    ) {
        this.templates = templates
        this.templatesMeta = templatesMeta
        this.docs = docs
        this.t = t
        this.d = d
        this.n = n
        this.proposalResourceTransformer = new ProposalResourceTransformer()
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
                                let resource = loFind(this.docs.files, {category: values.category, name: values.name, version: values.version})
                                if (!resource){
                                    resource = this.proposalResourceTransformer.transform(values)
                                }
                                loAssign(values, {
                                    resource
                                })
                            }
                            break;
                        case '3': {
                                loSet(values, ['amount'], NearUtils.amountFromDecimals(loToString(values.amount) || '0', 24))
                            }
                            break;
                        case '4': {
                                loSet(values, ['amount'], NearUtils.amountFromDecimals(loToString(values.amount) || '0', 24))
                            }
                            break;
                        default:
                            break;
                    }
                }
                break;
            case 'reward2': {
                    switch (value.workflowScenarioId.toString()) {
                        case '1': {
                                null;
                            }
                            break;
                        case '2': {
                                null;
                            }
                            break;
                        default:
                            break;
                    }
                }
                break;
            case 'skyward1': {
                    switch (value.workflowScenarioId.toString()) {
                        case '1': {
                                loSet(values, ['title'], loGet(values, ['sale.title']))
                                loSet(values, ['startAt'], this.d(NearUtils.dateFromChain(NumberHelper.parseNumber((values.start_time as string) || '0'))))
                                loSet(values, ['amount'], this.n(NumberHelper.parseNumber(NearUtils.amountFromDecimals((values.offered_amount as string), 24))))
                                loSet(values, ['tokenId'], loGet(values, ['sale.token_id']))
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