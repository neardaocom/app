import { DAO } from "./types/dao";
import ProposalBuilder from "./ProposalBuilder";
import NearUtils from "../nearBlockchain/Utils";
import DaoUtils from "../dao/Utils";
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
        const templateLock = DaoUtils.getTemplateByCode(dao, 'lock1')

        const builder = new ProposalBuilder(this.wfProviderService)
        builder.addTemplateId(templateLock.id)
        builder.addTemplateSettingsId(0)
        builder.addActivity()
        builder.addActivityActionConstantString("name", name)
        if (amountNear && amountToken) {
            builder.addActivityActionConstantString("assets.0.asset_id.near", "")
            builder.addActivityActionConstantNumber("assets.0.unlocking.amount_init_unlock", amountNear)
            builder.addActivityActionConstantString("assets.1.asset_id.ft", "")
            builder.addActivityActionConstantString("assets.1.asset_id.ft.account_id", dao.settings.token_id)
            builder.addActivityActionConstantNumber("assets.1.asset_id.ft.decimals", 24)
            builder.addActivityActionConstantNumber("assets.1.unlocking.amount_init_unlock", amountToken)
        } else if (amountNear) {
            builder.addActivityActionConstantString("assets.0.asset_id.near", "")
            builder.addActivityActionConstantNumber("assets.0.unlocking.amount_init_unlock", amountNear)
        } else if (amountToken) {
            builder.addActivityActionConstantString("assets.0.asset_id.ft", "")
            builder.addActivityActionConstantString("assets.0.asset_id.ft.account_id", dao.settings.token_id)
            builder.addActivityActionConstantNumber("assets.0.asset_id.ft.decimals", 24)
            builder.addActivityActionConstantNumber("assets.0.unlocking.amount_init_unlock", amountToken)
        }
        builder.addActivity()
        builder.addActivity()

        const createArgs = await builder.create()

        console.log(createArgs)

        return this.daoService.proposalCreate(createArgs, 10, 1).actionsRun()
    }

    async unlock(lockId: number) {
        return this.daoService.unlockPartitionAssets(lockId, 50).actionsRun()
    }
}