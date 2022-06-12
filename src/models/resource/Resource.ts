import ResourceTypeBuilder from "./ResourceTypeBuilder"
import IpfsService from "../interfaces/IpfsService.interface"
import { ResourceType, ResourceTypeCid, ResourceTypeLink, ResourceTypeText } from "../nearBlockchain/types/resource"
import IpfsUtils from "../services/ipfs/IpfsUtils"
import StringHelper from "../utils/StringHelper"
import { DAODocsFile, DAODocsFileType } from "../dao/types/dao"
import loToString from "lodash/toString"
import loGet from "lodash/get"

export default class Resource {

    protected ipfsService: IpfsService

    constructor(ipfsService: IpfsService) {
        this.ipfsService = ipfsService
    }

    async storeHtml(html: string, ipfsName: string): Promise<ResourceType | null> {
        let resourceTypeBuiler: ResourceTypeBuilder | null = null

        if (StringHelper.getWords(html).length > 0) {
            const files = IpfsUtils.makeFileFromHtml(html, ipfsName)
            const cid = await this.ipfsService.store(files, ipfsName)
            resourceTypeBuiler = new ResourceTypeBuilder()
            resourceTypeBuiler.addCid(cid, this.ipfsService.getSourceName(), 'text/html')
        }

        return resourceTypeBuiler?.create() || null
    }

    async storePdf(pdf: File[], ipfsName: string): Promise<ResourceType> {
        const resourceTypeBuiler = new ResourceTypeBuilder()
        const cid = await this.ipfsService.store(pdf, ipfsName)
        resourceTypeBuiler.addCid(cid, this.ipfsService.getSourceName(), 'application/pdf')
        return resourceTypeBuiler.create()
    }

    async storeLink(link: string): Promise<ResourceType> {
        const resourceTypeBuiler = new ResourceTypeBuilder()
        resourceTypeBuiler.addLink(link)
        return resourceTypeBuiler.create()
    }

    async storeText(text: string): Promise<ResourceType> {
        const resourceTypeBuiler = new ResourceTypeBuilder()
        resourceTypeBuiler.addText(text)
        return resourceTypeBuiler.create()
    }

    async retriveHtml(resource: ResourceTypeCid): Promise<string | undefined> {
        const fetched: any = await this.ipfsService.retrieve(loGet(resource, ['cid', 'cid']))
        return fetched[0].text()
    }

    async retrivePdf(resource: ResourceTypeCid): Promise<string | undefined> {
        const fetched: any = await this.ipfsService.retrieve(loGet(resource, ['cid', 'cid']))
        return URL.createObjectURL(fetched[0])
    }

    async retriveLink(resource: ResourceTypeLink): Promise<string | undefined> {
        return loGet(resource, ['link'])
    }

    async retriveText(resource: ResourceTypeText): Promise<string | undefined> {
        return loGet(resource, ['text'])
    }
}