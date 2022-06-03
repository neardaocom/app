import IpfsService from "../interfaces/IpfsService.interface";
import { Media, ResourceType } from "../nearBlockchain/types/resource";
import Resource from "../resource/Resource";
import { DAO } from "./types/dao";
import loMax from 'lodash/max'
import { ValidationError } from "../utils/errors";


export default class DaoResource {

    protected resource: Resource
    private t: Function;

    constructor(ipfsService: IpfsService, t: Function) {
        this.resource = new Resource(ipfsService)
        this.t = t
    }

    async storeDescription(dao: DAO, description: string): Promise<ResourceType|null> {
        const maxProposalId = loMax(dao.proposals.map((proposal) => proposal.id))
        return this.resource.storeHtml(
            description,
            '[' + dao.wallet + '][' + ((maxProposalId) ? maxProposalId + 1 : '-') + '] Proposal desc.'
        )
    }

    async storeFile(dao: DAO, name: string, category: string, type: string, plain: string|null, url: string|null, html: string|null, pdf: File[]|null): Promise<ResourceType|null> {
        let resourceType: ResourceType | null = null
        switch (type) {
            case 'plain': {
                    if (!plain) {
                        throw new ValidationError('Plain is empty');
                    }
                    resourceType = await this.resource.storeText(plain)
                }
                break;
            case 'url': {
                    if (!url) {
                        throw new ValidationError('URL is empty');
                    }
                    resourceType = await this.resource.storeLink(url)
                }
                break;
            case 'html': {
                    if (!html) {
                        throw new ValidationError('HTML is empty');
                    }
                    resourceType = await this.resource.storeHtml(html, '[' + dao.wallet + '][' + category + '] Resource: ' + name + '')
                }
                break;
            case 'pdf': {
                    if (!pdf) {
                        throw new ValidationError('PDF is empty');
                    }
                    resourceType = await this.resource.storePdf(pdf, '[' + dao.wallet + '][' + category + '] Resource: ' + name + '')
                }
                break;
            default:
                break;
        }
        return resourceType
    }
}