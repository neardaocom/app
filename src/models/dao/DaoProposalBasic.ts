import ServicePool from "./ServicePool";
import { MarketTemplate } from "./types/market";
import MarketTemplateFromProviderTransformer from "./transformers/MarketTemplateFromProviderTransformer";
import { DAO, DAORights } from "./types/dao";
import ProposalBuilder from "./ProposalBuilder";
import NearUtils from "../nearBlockchain/Utils";
import MediaBuilder from "./MediaBuilder";
import IpfsService from "../interfaces/IpfsService.interface";
import DaoResource from "./DaoResource";
import { Media } from "../nearBlockchain/types/resource";
import { ValidationError } from "../utils/errors";
import loGet from 'lodash/get'

export default class DaoProposalBasic {
    private wfProviderAccountId: string;
    private servicePool: ServicePool;
    private resource: DaoResource;

    constructor(wfProviderAccountId: string, servicePool: ServicePool, ipfsService: IpfsService) {
        this.wfProviderAccountId = wfProviderAccountId
        this.servicePool = servicePool
        this.resource = new DaoResource(ipfsService)
    }

    async nearSend(dao: DAO, receiverId: string, amount: number, description: string) {
        const proposalDesc = await this.resource.storeProposalDescription(dao, description)

        const builder = new ProposalBuilder(this.servicePool.getWfProvider(this.wfProviderAccountId), dao.templates)
        builder.addDescription(proposalDesc)
        builder.addTemplateByCode('basic_pkg1')
        builder.addTemplateSettingsId(0)
        builder.addProposeSettingsScenario(3)
        builder.addActivityEmpty()
        builder.addActivityEmpty()
        builder.addActivity(1)
        builder.addActivityActionConstantString(0, 'receiver_id', receiverId)
        builder.addActivityActionConstantString(0, 'amount', NearUtils.nearToYocto(amount))
        builder.addActivityEmpty()
        const createArgs = await builder.create()

        console.log(createArgs)

        return this.servicePool.getContract(dao.wallet).proposalCreate(createArgs, 50, 1).actionsRun()
    }

    async tokenSend(dao: DAO, receiverId: string, amount: number, description: string) {
        const proposalDesc = await this.resource.storeProposalDescription(dao, description)

        const builder = new ProposalBuilder(this.servicePool.getWfProvider(this.wfProviderAccountId), dao.templates)
        builder.addDescription(proposalDesc)
        builder.addTemplateByCode('basic_pkg1')
        builder.addTemplateSettingsId(0)
        builder.addProposeSettingsScenario(4)
        builder.addActivityEmpty()
        builder.addActivityEmpty()
        builder.addActivityEmpty()
        builder.addActivity(1)
        builder.addActivityActionConstantString(0, 'token_id', dao.settings.token_id)
        builder.addActivityActionConstantString(0, 'receiver_id', receiverId)
        builder.addActivityActionConstantString(0, 'amount', NearUtils.nearToYocto(amount))
        const createArgs = await builder.create()

        console.log(createArgs)

        return this.servicePool.getContract(dao.wallet).proposalCreate(createArgs, 50, 1).actionsRun()
    }

    async mediaAdd(
        dao: DAO, name: string, category: string, version: string, description: string
        , fileType: string, filePlain: string|null, fileUrl: string|null, fileHtml: string|null, filePdf: File[]|null
    ) {
        const proposalDesc = await this.resource.storeProposalDescription(dao, description)
        const mediaType = await this.resource.storeFile(dao, name, category, version, fileType, filePlain, fileUrl, fileHtml, filePdf)

        const builder = new ProposalBuilder(this.servicePool.getWfProvider(this.wfProviderAccountId), dao.templates)
        builder.addDescription(proposalDesc)
        builder.addTemplateByCode('basic_pkg1')
        builder.addTemplateSettingsId(0)
        builder.addProposeSettingsScenario(2)
        builder.addActivityEmpty()
        builder.addActivity(1)
        builder.addActivityActionConstantString(0, 'name', name)
        builder.addActivityActionConstantString(0, 'category', category)
        builder.addActivityActionConstantString(0, 'version', version)
        builder.addActivityActionConstantBoolean(0, 'valid', true)
        builder.addActivityActionConstantNumbers(0, 'tags', [])
        switch (fileType) {
            case 'plain': {
                    builder.addActivityActionConstantString(0, 'type.text', loGet(mediaType, ['type', 'text']))
                }
                break;
            case 'url': {
                    builder.addActivityActionConstantString(0, 'type.link', loGet(mediaType, ['type', 'link']))
                }
                break;
            case 'html': {
                    builder.addActivityActionConstantString(0, 'type.cid.cid', loGet(mediaType, ['type', 'cid', 'cid']))
                    builder.addActivityActionConstantString(0, 'type.cid.mimetype', loGet(mediaType, ['type', 'cid', 'mimetype']))
                    builder.addActivityActionConstantString(0, 'type.cid.ipfs', loGet(mediaType, ['type', 'cid', 'ipfs']))
                }
                break;
            case 'pdf': {
                    builder.addActivityActionConstantString(0, 'type.cid.cid', loGet(mediaType, ['type', 'cid', 'cid']))
                    builder.addActivityActionConstantString(0, 'type.cid.mimetype', loGet(mediaType, ['type', 'cid', 'mimetype']))
                    builder.addActivityActionConstantString(0, 'type.cid.ipfs', loGet(mediaType, ['type', 'cid', 'ipfs']))
                }
                break;
            default:
                break;
        }

        builder.addActivityEmpty()
        builder.addActivityEmpty()
        const createArgs = await builder.create()

        //console.log(createArgs)

        return this.servicePool.getContract(dao.wallet).proposalCreate(createArgs, 50, 1).actionsRun()
    }


}