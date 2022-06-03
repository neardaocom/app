import ServicePool from "./ServicePool";
import { MarketTemplate } from "./types/market";
import MarketTemplateFromProviderTransformer from "./transformers/MarketTemplateFromProviderTransformer";
import { DAO, DAORights } from "./types/dao";
import ProposalBuilder from "./ProposalBuilder";
import NearUtils from "../nearBlockchain/Utils";
import MediaBuilder from "./MediaBuilder";
import IpfsService from "../interfaces/IpfsService.interface";
import DaoResource from "./DaoResource";

export default class DaoProposalBasic {
    private wfProviderAccountId: string;
    private servicePool: ServicePool;
    private resource: DaoResource;

    constructor(wfProviderAccountId: string, servicePool: ServicePool, ipfsService: IpfsService, t: Function) {
        this.wfProviderAccountId = wfProviderAccountId
        this.servicePool = servicePool
        this.resource = new DaoResource(ipfsService, t)
    }

    async nearSend(dao: DAO, receiverId: string, amount: number, description: string) {
        const proposalDesc = await this.resource.storeDescription(dao, description)

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
        const proposalDesc = await this.resource.storeDescription(dao, description)

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


}