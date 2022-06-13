import IpfsService from "../interfaces/IpfsService.interface";
import { ResourceType, ResourceTypeCid, ResourceTypeLink, ResourceTypeText } from "../nearBlockchain/types/resource";
import Resource from "../resource/Resource";
import { DAO } from "./types/dao";
import { DAODocs, DAODocsFile, DAODocsFileType, DAOFile } from "./types/docs";
import loMax from 'lodash/max'
import { ValidationError } from "../utils/errors";
import DaoFilesTransformer from "./transformers/DaoFilesTransformer";


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

    async fetch(file: DAODocsFile): Promise<string | undefined> {
        let value: string | undefined = undefined

        switch (file.type) {
            case DAODocsFileType.url:
                value = await this.resource.retriveLink(file.value as ResourceTypeLink)
                break;
            case DAODocsFileType.plain: {
                value = await this.resource.retriveText(file.value as ResourceTypeText)
                break;
            }
            case DAODocsFileType.html: {
                value = await this.resource.retriveHtml(file.value as ResourceTypeCid)
                break;
            }
            case DAODocsFileType.binaryPdf: {
                value = await this.resource.retrivePdf(file.value as ResourceTypeCid)
                break;
            }
            default:
                throw new Error("Unsupported scenario: " + file.type);
        }
        return value
    }

    list(daoDocs: DAODocs): DAOFile[] {
        const transformer = new DaoFilesTransformer(daoDocs.categories, daoDocs.tags)

        return transformer.transform(daoDocs.files)
    }
}