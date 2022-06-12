import { DAO } from "./types/dao";
import ProposalBuilder from "./ProposalBuilder";
import DaoContractService from "../nearBlockchain/DaoContractService";
import WfProviderContractService from "../nearBlockchain/WfProviderContractService";

export default class DaoTreasury {
    private daoService: DaoContractService;
    private wfProviderService: WfProviderContractService;

    constructor(daoService: DaoContractService, wfProviderService: WfProviderContractService) {
        this.daoService = daoService
        this.wfProviderService = wfProviderService
    }

    async createLockSimple(dao: DAO, name: string, amountNear: number | null, amountToken: number | null) {
        const builder = new ProposalBuilder(this.wfProviderService, dao.templates)
        builder.addTemplateByCode('lock1')
        builder.addTemplateSettingsId(0)
        builder.addProposeSettingsScenario(1)
        builder.addActivity()
        builder.addActivityActionConstantString(0, "name", name)
        if (amountNear && amountToken) {
            builder.addActivityActionConstantString(0, "assets.0.asset_id.near", "")
            builder.addActivityActionConstantNumber(0, "assets.0.unlocking.amount_init_unlock", amountNear)
            builder.addActivityActionConstantString(0, "assets.1.asset_id.ft", "")
            builder.addActivityActionConstantString(0, "assets.1.asset_id.ft.account_id", dao.settings.token_id)
            builder.addActivityActionConstantNumber(0, "assets.1.asset_id.ft.decimals", 24)
            builder.addActivityActionConstantNumber(0, "assets.1.unlocking.amount_init_unlock", amountToken)
        } else if (amountNear) {
            builder.addActivityActionConstantString(0, "assets.0.asset_id.near", "")
            builder.addActivityActionConstantNumber(0, "assets.0.unlocking.amount_init_unlock", amountNear)
        } else if (amountToken) {
            builder.addActivityActionConstantString(0, "assets.0.asset_id.ft", "")
            builder.addActivityActionConstantString(0, "assets.0.asset_id.ft.account_id", dao.settings.token_id)
            builder.addActivityActionConstantNumber(0, "assets.0.asset_id.ft.decimals", 24)
            builder.addActivityActionConstantNumber(0, "assets.0.unlocking.amount_init_unlock", amountToken)
        }
        builder.addActivityEmpty()

        const createArgs = await builder.create()

        console.log(createArgs)

        return this.daoService.proposalCreate(createArgs, 10, 1).actionsRun()
    }

    async unlock(lockId: number) {
        return this.daoService.unlockPartitionAssets(lockId, 50).actionsRun()
    }
}