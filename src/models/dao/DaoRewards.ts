import { DAO } from "./types/dao";
import ProposalBuilder from "./ProposalBuilder";
import NearUtils from "../nearBlockchain/Utils";
import DaoUtils from "../dao/Utils";
import DaoContractService from "../nearBlockchain/DaoContractService";
import WfProviderContractService from "../nearBlockchain/WfProviderContractService";

export default class DaoRewards {
    private daoService: DaoContractService;
    private wfProviderService: WfProviderContractService;

    constructor(daoService: DaoContractService, wfProviderService: WfProviderContractService) {
        this.daoService = daoService
        this.wfProviderService = wfProviderService
    }

    async createSalary(dao: DAO, groupId: number, amountNear: number | null, amountToken: number | null, timeUnit: number, lockId: number, startAt: Date, endAt?: Date) {
        const templateReward = DaoUtils.getTemplateByCode(dao, 'reward2')

        const builder = new ProposalBuilder(this.wfProviderService)
        builder.addTemplateId(templateReward.id)
        builder.addTemplateSettingsId(0)
        builder.addActivity()
        builder.addActivityActionConstantNumber('partition_id', lockId)
        builder.addActivityActionConstantNumber('time_valid_from', NearUtils.dateToChain(startAt))
        builder.addActivityActionConstantNumber('time_valid_to', (endAt) ? NearUtils.dateToChain(endAt) : NearUtils.dateIninity)
        if (amountNear && amountToken) {
            builder.addActivityActionConstantString("reward_amounts.0.0.near", "")
            builder.addActivityActionConstantBigNumber("reward_amounts.0.1", NearUtils.nearToYocto(amountNear))
            builder.addActivityActionConstantString("reward_amounts.1.0.ft", "")
            builder.addActivityActionConstantString("reward_amounts.1.0.ft.account_id", dao.settings.token_id)
            builder.addActivityActionConstantNumber("reward_amounts.1.0.ft.decimals", 24)
            builder.addActivityActionConstantBigNumber("reward_amounts.1.1", NearUtils.amountToDecimals(amountToken.toString(), 24))
        } else if (amountNear) {
            builder.addActivityActionConstantString("reward_amounts.0.0.near", "")
            builder.addActivityActionConstantBigNumber("reward_amounts.0.1", NearUtils.nearToYocto(amountNear))
        } else if (amountToken) {
            builder.addActivityActionConstantString("reward_amounts.0.0.ft", "")
            builder.addActivityActionConstantString("reward_amounts.0.0.ft.account_id", dao.settings.token_id)
            builder.addActivityActionConstantNumber("reward_amounts.0.0.ft.decimals", 24)
            builder.addActivityActionConstantBigNumber("reward_amounts.0.1", NearUtils.amountToDecimals(amountToken.toString(), 24))
        }
        builder.addActivityActionConstantNumber("type.wage.unit_seconds", timeUnit)
        builder.addActivityActionConstantNumber("group_id", groupId)
        builder.addActivityActionConstantNumber("role_id", 0)
        builder.addActivity()
        builder.addActivity()

        const createArgs = await builder.create()

        console.log(createArgs)

        return this.daoService.proposalCreate(createArgs, NearUtils.toTGas(10), NearUtils.nearToYocto(1))
    }
}