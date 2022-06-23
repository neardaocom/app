import { DAO } from "./types/dao";
import ProposalBuilder from "./ProposalBuilder";
import NearUtils from "../nearBlockchain/Utils";
import { RewardPricelist } from "./types/rewards";
import ServicePool from "./ServicePool";
import { Interval } from "../utils/types/generics";

export default class DaoSkyward {
    private servicePool: ServicePool

    constructor(servicePool: ServicePool) {
        this.servicePool = servicePool
    }

    async createAuction(dao: DAO, title: string, amount: number, startAt: Date, duration: Interval, url: string) {
        const builder = new ProposalBuilder(this.servicePool.getWfProvider(dao.settings.workflow_provider), dao.templates)
        builder.addTemplateByCode('skyward1')
        builder.addTemplateSettingsId(0)
        builder.addProposeSettingsScenario(1)
        builder.addProposeSettingsConstantString('offered_token', dao.settings.token_id)
        builder.addProposeSettingsConstantBigNumber('offered_amount', NearUtils.amountToDecimals(amount.toString(), 24))
        builder.addProposeSettingsConstantString('sale.title', title)
        builder.addProposeSettingsConstantString('sale.url', url)
        builder.addProposeSettingsStorageKey('skyward1')
        builder.addActivityEmpty()
        builder.addActivityEmpty()
        builder.addActivityEmpty()
        builder.addActivityEmpty()
        builder.addActivity()
        builder.addActivityActionConstantNumber(0, 'duration', NearUtils.durationToChain(duration))
        builder.addActivityActionConstantBigNumber(0, 'start_time', NearUtils.dateToChain(startAt).toString())

        const createArgs = await builder.create()

        console.log(createArgs)

        return this.servicePool.getContract(dao.wallet).proposalCreate(createArgs, 10, 1).actionsRun()
    }

    static getList(dao: DAO, type: string): RewardPricelist[] {
        return dao.rewardsPricelists.filter((item) => item.type === type)
    }
}