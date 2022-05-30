import { DAO } from "./types/dao";
import ProposalBuilder from "./ProposalBuilder";
import NearUtils from "../nearBlockchain/Utils";
import DaoUtils from "../dao/Utils";
import { Reward, RewardPricelist } from "./types/rewards";
import RewardsClaimableTransformer from "./transformers/RewardsClaimableTransformer";
import FtMetadataLoader from "../ft/FtMetadataLoader";
import ServicePool from "./ServicePool";
import loGet from 'lodash/get'
import RewardsHelper from "./RewardsHelper";
import { DaoAsset } from "./types/asset";
import DaoAssetToChainAssetTransformer from "./transformers/DaoAssetToChainAssetTransformer";

export default class DaoRewards {
    private servicePool: ServicePool

    constructor(servicePool: ServicePool) {
        this.servicePool = servicePool
    }

    async createSalary(dao: DAO, groupId: number, amountNear: number | null, amountToken: number | null, timeUnit: number, lockId: number, startAt: Date, endAt?: Date) {
        const templateReward = DaoUtils.getTemplateByCode(dao, 'reward2')

        const builder = new ProposalBuilder(this.servicePool.getWfProvider(dao.settings.workflow_provider))
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

        return this.servicePool.getContract(dao.wallet).proposalCreate(createArgs, NearUtils.toTGas(10), NearUtils.nearToYocto(1))
    }

    static getList(dao: DAO, type: string): RewardPricelist[] {
        return dao.rewardsPricelists.filter((item) => item.type === type)
    }

    async loadClaimable(accountId: string, dao: DAO, ftMetadataLoader: FtMetadataLoader): Promise<Reward[]> {
        let list: Reward[] = []
        // TODO: account not in rewards
        if (accountId) {
            // console.log('Claimable reward loading...')
            const dataChain = await Promise.all([
                this.servicePool.getContract(dao.wallet).wallet(accountId),
                this.servicePool.getContract(dao.wallet).claimableRewards(accountId),
            ]).catch((e) => {
                console.log(e)
                // throw new Error(`DataChain not loaded: ${e}`);
            })
            // console.log(dataChain)
            const transformer = new RewardsClaimableTransformer(dao.rewardsPricelists, dao.treasuryLocks, ftMetadataLoader)
            list = await transformer.transform({
                rewards: loGet(dataChain, [0, 'rewards']) || [],
                claimable_rewards: loGet(dataChain, [1, 'claimable_rewards']) || [],
                failed_withdraws: loGet(dataChain, [0, 'failed_withdraws']) || [],
            })
        }
        return list
    }

    static recomputeCounting(rewards: Reward[]|null) {
        // console.log('Claimable reward counting...')
        rewards?.forEach((reward) => {
            reward.amounts.forEach((amount) => {
                amount.amountCounting = RewardsHelper.getAmountCounting(amount)
            })
        })
    }

    /**
     * Withdraw rewards
     * @returns Promise
     */
    async withdraw(daoAccountId: string, asset: DaoAsset, rewardIds: number[]) {
        const transformer = new DaoAssetToChainAssetTransformer()
        return this.servicePool.getContract(daoAccountId).withdrawRewards(rewardIds, transformer.transform(asset), NearUtils.toTGas(100))
    }
}