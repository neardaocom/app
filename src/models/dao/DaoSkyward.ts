import { DAO } from "./types/dao";
import ProposalBuilder from "./ProposalBuilder";
import NearUtils from "../nearBlockchain/Utils";
import ServicePool from "./ServicePool";
import { Interval } from "../utils/types/generics";
import DaoResource from "./DaoResource";
import IpfsService from "../interfaces/IpfsService.interface";
import NumberHelper from "../utils/NumberHelper";
import { Auction } from "../auction/types";
import DaoHelper from "./DaoHelper";
import SkywardFinance from "../nearBlockchain/SkywardFinanceService";
import { Config } from "@/config";
import AuctionTransformator from "../auction/AuctionTranformator";

export default class DaoSkyward {
    private servicePool: ServicePool
    private resource: DaoResource
    private config: Config

    constructor(servicePool: ServicePool, ipfsService: IpfsService, config: Config) {
        this.servicePool = servicePool
        this.resource = new DaoResource(ipfsService)
        this.config = config
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
        builder.addProposeSettingsStorageKey('skyward1-' + (dao.proposals.length + 1))
        builder.addActivityEmpty()
        builder.addActivityEmpty()
        builder.addActivityEmpty()
        builder.addActivity()
        builder.addActivityActionConstantBigNumber(0, 'start_time', NearUtils.dateToChainInNanoseconds(startAt))
        // 1656633600000000000
        // 1659348000000000000
        // 1659348000
        builder.addActivityActionConstantNumber(0, 'duration', NumberHelper.parseNumber(NearUtils.durationToChainInNanoseconds(duration)))
        // 604800000000000
        // 90000000000000
        // 86400

        const createArgs = await builder.create()

        console.log(createArgs)

        return this.servicePool.getContract(dao.wallet).proposalCreate(createArgs, 50, 1).actionsRun()
    }

    async getList(dao: DAO): Promise<Auction[]> {
        const list: Auction[] = []

        // get ids
        const auctionIds = DaoHelper.storageGetValues(dao.storage, 'skyward1', 'skyward_auction_id').map((value) => NumberHelper.parseNumber(value))

        // load data from chain
        const service = new SkywardFinance(this.servicePool.account, this.config.blockchain.skywardFinanceContract)
        const data = await service.getSalesById(auctionIds)

        // transform
        const transformer = new AuctionTransformator('skyward.finance')
        data.forEach((item) => {
            list.push(transformer.transform(item))
        })

        return list
    }
}