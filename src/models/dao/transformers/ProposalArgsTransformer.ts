import TransformerInterface from "@/models/interfaces/Transformer.interface";
import loToNumber from "lodash/toNumber"
import loToString from "lodash/toString"
import loGet from "lodash/get"
import loFind from "lodash/find"
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
        //console.log(value)
        const template = loGet(this.templates, [value.templateId])

        let values: Record<string, unknown> = {}
        // console.log(proposal, templateCode)
        switch (template.code) {
            case 'wf_near_send':
                values = {
                    receiverId: GenericsHelper.getValueByCode(value.inputs, 'receiverId') ?? '',
                    amount: NearUtils.yoctoToNear(GenericsHelper.getValueByCode(value.inputs, 'amount') ?? ''),
                }
                break;
            case 'wf_treasury_send_ft':
                values = {
                    receiverId: GenericsHelper.getValueByCode(value.inputs, 'receiverId') ?? '',
                    amount: GenericsHelper.getValueByCode(value.inputs, 'amount') ?? '',
                }
                break;
            case 'wf_add': {
                    const templateId = loToNumber(GenericsHelper.getValueByCode(value.inputs, 'workflow_id'))
                    const providerId = loToString(GenericsHelper.getValueByCode(value.inputs, 'provider_id'))
                    const templateMetaItem = loFind(this.templatesMeta, { id: templateId })
                    //console.log(templateId, providerId, templateMetaItem)
                    values = {
                        providerId,
                        templateId,
                        template: templateMetaItem?.name,
                    }
                }
                break;
            case 'wf_media_add': {
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
                break;
            }
            case 'wf_bounty':
                values = {
                    title: GenericsHelper.getValueByCode(value.inputs, 'title') ?? '',
                    amount: NearUtils.yoctoToNear(GenericsHelper.getValueByCode(value.inputs, 'amount') ?? ''),
                    deposit: NearUtils.yoctoToNear(GenericsHelper.getValueByCode(value.inputs, 'deposit') ?? ''),
                }
                break;
            case 'wf_skyward':
                values = {
                    amount: this.n(loToNumber(GenericsHelper.getValueByCode(value.inputs, 'amount') ?? '-amount-')),
                    title: GenericsHelper.getValueByCode(value.inputs, 'title') ?? '-SALE-',
                    tokenId: GenericsHelper.getValueByCode(value.inputs, 'tokenId') ?? '-tokenId-',
                    startAt: this.d(DateHelper.parseNanoseconds(GenericsHelper.getValueByCode(value.inputs, 'startAt') ?? 0)),
                }
                break;
            default:
                break;
        }

        return values;
    }
}