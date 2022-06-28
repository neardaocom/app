import { DAO } from "./types/dao";
import ProposalBuilder from "./ProposalBuilder";
import NearUtils from "../nearBlockchain/Utils";
import { RewardPricelist } from "./types/rewards";
import ServicePool from "./ServicePool";
import { Interval } from "../utils/types/generics";
import { SkywardFinance } from "../services/skywardFinanceService";
import DaoResource from "./DaoResource";
import IpfsService from "../interfaces/IpfsService.interface";

export default class DaoSkyward {
    private servicePool: ServicePool
    private resource: DaoResource

    constructor(servicePool: ServicePool, ipfsService: IpfsService) {
        this.servicePool = servicePool
        this.resource = new DaoResource(ipfsService)
    }

    async createProposal(dao: DAO, title: string, amount: number, tokenId: string, startAt: Date, duration: Interval, url: string, description: string) {
        const proposalDesc = await this.resource.storeProposalDescription(dao, description)

        const builder = new ProposalBuilder(this.servicePool.getWfProvider(dao.settings.workflow_provider), dao.templates)
        builder.addDescription(proposalDesc)
        builder.addTemplateByCode('skyward1')
        builder.addTemplateSettingsId(0)
        builder.addProposeSettingsScenario(1)
        builder.addProposeSettingsConstantString('offered_token', dao.settings.token_id)
        builder.addProposeSettingsConstantBigNumber('offered_amount', NearUtils.amountToDecimals(amount.toString(), 24))
        builder.addProposeSettingsConstantString('sale.title', title)
        builder.addProposeSettingsConstantString('sale.url', url)
        builder.addProposeSettingsConstantString('sale.token_id', tokenId)
        builder.addProposeSettingsStorageKey('skyward1')
        builder.addActivityEmpty()
        builder.addActivityEmpty()
        builder.addActivityEmpty()
        builder.addActivity()
        builder.addActivityActionConstantBigNumber(0, 'start_time', NearUtils.dateToChain(startAt).toString())
        builder.addActivityActionConstantNumber(0, 'duration', NearUtils.durationToChain(duration))

        const createArgs = await builder.create()

        console.log(createArgs)

        return this.servicePool.getContract(dao.wallet).proposalCreate(createArgs, 50, 1).actionsRun()
    }

    //static getList(dao: DAO): RewardPricelist[] {
    //    const service = new SkywardFinance(this.servicePool.account, dao.)
    //    return this.servicedao.rewardsPricelists.filter((item) => item.type === type)
    //}
}