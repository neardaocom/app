import { DAO } from "./types/dao";
import ProposalBuilder from "./ProposalBuilder";
import NearUtils from "../nearBlockchain/Utils";
import DaoUtils from "../dao/Utils";
import DaoContractService from "../nearBlockchain/DaoContractService";

export default class DaoRewards {
    private service: DaoContractService;

    constructor(service: DaoContractService) {
        this.service = service
    }

    async createSalary(dao: DAO, groupId: number, amountNear: number | null, amountToken: number | null, timeUnit: number, lockId: number, startAt: Date, endAt?: Date) {
        const templateReward = DaoUtils.getTemplateByCode(dao, 'reward2')

        const builder = new ProposalBuilder()
        builder.addTemplateId(templateReward.id)
        builder.addTemplateSettingsId(0)
        builder.addActivity()
        builder.addActivityActionConstantNumber('partition_id', lockId)
        builder.addActivityActionConstantNumber('time_valid_from', NearUtils.dateToChain(startAt))
        builder.addActivityActionConstantNumber('time_valid_to', (endAt) ? NearUtils.dateToChain(endAt) : NearUtils.dateIninity)
        if (amountNear && amountToken) {
            builder.addActivityActionConstantString("reward_amounts.0.type", "near")
            builder.addActivityActionConstantBigNumber("reward_amounts.0.amount", NearUtils.nearToYocto(amountNear))
            builder.addActivityActionConstantString("reward_amounts.1.type", "ft")
            builder.addActivityActionConstantBigNumber("reward_amounts.1.amount", NearUtils.amountToDecimals(amountToken.toString(), 24))
            builder.addActivityActionConstantString("reward_amounts.1.ft_account_id", dao.settings.token_id)
            builder.addActivityActionConstantNumber("reward_amounts.1.decimals", 24)
        } else if (amountNear) {
            builder.addActivityActionConstantString("reward_amounts.0.type", "near")
            builder.addActivityActionConstantBigNumber("reward_amounts.0.amount", NearUtils.nearToYocto(amountNear))
        } else if (amountToken) {
            builder.addActivityActionConstantString("reward_amounts.0.type", "ft")
            builder.addActivityActionConstantBigNumber("reward_amounts.0.amount", NearUtils.amountToDecimals(amountToken.toString(), 24))
            builder.addActivityActionConstantString("reward_amounts.0.ft_account_id", dao.settings.token_id)
            builder.addActivityActionConstantNumber("reward_amounts.0.decimals", 24)
        }
        builder.addActivityActionConstantNumber("type.wage.unit_seconds", timeUnit)
        builder.addActivityActionConstantNumber("group_id", groupId)
        builder.addActivityActionConstantNumber("role_id", 0)
        builder.addActivity()
        builder.addActivity()

        console.log(builder.create())

        // return this.service.proposalCreate(builder.create(), NearUtils.toTGas(10), NearUtils.nearToYocto(1))
    }
}