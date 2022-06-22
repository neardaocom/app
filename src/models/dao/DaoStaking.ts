import StakingContractService from "../nearBlockchain/StakingContractService";
import FtContractService from "../nearBlockchain/FtContractService";
import NearUtils from "../nearBlockchain/Utils";
import { Staking, StakingDelegation, StakingUserToDelegate, StakingWallet } from "./types/staking";
import { UserInfoStaking } from "../nearBlockchain/types/staking";
import loIsNil from "lodash/isNil"
import loSum from "lodash/sum"
import NumberHelper from "../utils/NumberHelper";

export default class DaoStaking {
    private id: string;
    private stakingService: StakingContractService;
    private ftService: FtContractService;

    constructor(id: string, stakingService: StakingContractService, ftService: FtContractService) {
        this.id = id
        this.stakingService = stakingService
        this.ftService = ftService
    }

    async registerToken(tokenAccountId: string, nearDeposit: number = 1): Promise<void> {
        return this.stakingService
            .storageDeposit(this.id, true, 50, nearDeposit)
            .registerNewDao(this.id, tokenAccountId, 50, 1)
            .actionsRun()
    }

    async stakeRegister(): Promise<void> {
        return this.stakingService
            .registerInDao(this.id, 50, 0.155)
            .actionsRun()
    }

    async stake(delegateId: string, amount: number): Promise<void> {
        return this.ftService
            .ftTranserCall(this.stakingService.getContractId(), NearUtils.amountToDecimals(amount.toString(), 24), null, JSON.stringify({dao_id: this.id, delegate_id: delegateId}), 100, NearUtils.oneYoctoNear)
            .actionsRun()
    }

    async delegate(delegateId: string, amount: number): Promise<void> {
        return this.stakingService
            .delegateOwned(this.id, delegateId, NearUtils.amountToDecimals(amount.toString(), 24), 50)
            .actionsRun()
    }

    /**
     * Delegate owned amount from account to account
     * @param delegateFromId From account
     * @param delegateId To account
     * @param amount amount
     * @returns Provise
     */
    async predelegate(delegateFromId: string, delegateId: string, amount: number): Promise<void> {
        return this.stakingService
            .undelegate(this.id, delegateFromId, NearUtils.amountToDecimals(amount.toString(), 24), 50)
            .delegateOwned(this.id, delegateId, NearUtils.amountToDecimals(amount.toString(), 24), 50)
            .actionsRun()
    }

    async undelegate(delegateId: string, amount: number): Promise<void> {
        return this.stakingService
            .undelegate(this.id, delegateId, NearUtils.amountToDecimals(amount.toString(), 24), 50)
            .actionsRun()
    }

    async forward(delegateId: string): Promise<void> {
        return this.stakingService
            .delegate(this.id, delegateId, 100)
            .actionsRun()
    }

    async withdraw(delegateId: string, amount: number): Promise<void> {
        return this.stakingService
            .undelegate(this.id, delegateId, NearUtils.amountToDecimals(amount.toString(), 24), 50)
            .withdraw(this.id, NearUtils.amountToDecimals(amount.toString(), 24), 100)
            .actionsRun()
    }

    async unregistred(): Promise<void> {
        return this.stakingService
            .unregisterInDao(this.id, 100)
            .actionsRun()
    }

    async load(dataChain: any[], totalSupplyChain: string, ftDecimals: number, walletId?: string): Promise<Staking> {
        let wallet: StakingWallet | null = null
        let walletInfo: UserInfoStaking | null = null
        // let walletInfo: object | null = null
        const usersToDelegate: StakingUserToDelegate[] = []

        dataChain.forEach((user, index) => {
            //console.log(user)
            usersToDelegate.push({
                id: index,
                accountId: user[0],
                bio: null,
                tag: null, // TODO: Add from groups
                votesCasted: user[1].delegators.length,
                voteAmount: NumberHelper.parseNumber(NearUtils.amountFromDecimals(user[1].delegated_vote_amount.toString() || '0', ftDecimals)),
                value: index,
                text: user[0]
            })

            if (user[0] === walletId) {
                walletInfo = user[1]
            }
        })

        if (loIsNil(walletInfo) === false) {
            // const userStaked = await this.stakingService.daoFtBalanceOf(this.id, walletId!)
            const delegations: StakingDelegation[] = (walletInfo!.delegated_amounts || []).filter((item) => true || item[0] !== walletId).map((item, index) => ({id: index + 1, accountId: item[0], voteAmount: NumberHelper.parseNumber(NearUtils.amountFromDecimals(item[1], ftDecimals))}))
            const delegationsVoteAmountSum = loSum(delegations.filter((item) => item.accountId !== walletId!).map((item) => item.voteAmount))

            // compute delegators
            const delegators: StakingDelegation[] = []
            dataChain.filter((item) => item[0] !== walletId).forEach((user) => {
                user[1].delegated_amounts.filter((item) => item[0] === walletId).forEach((item) => {
                    delegators.push({
                        id: delegators.length,
                        accountId: user[0],
                        voteAmount: NumberHelper.parseNumber(NearUtils.amountFromDecimals(item[1].toString() || '0', ftDecimals)),
                    })
                })
            })
            const delegatorsAmount = loSum(delegators.map((item) => item.voteAmount)) || 0

            // console.log(walletInfo, typeof walletInfo)
            wallet = {
                staked: NumberHelper.parseNumber(NearUtils.amountFromDecimals(walletInfo!.vote_amount, ftDecimals)), // userStaked
                voteAmount: NumberHelper.parseNumber(NearUtils.amountFromDecimals(walletInfo!.delegated_vote_amount || '0', ftDecimals)), 
                delegatedVoteAmount: delegationsVoteAmountSum,
                delegations,
                delegators,
                delegatorsAmount,
            }
        }

        const totalStaked = NumberHelper.parseNumber(NearUtils.amountFromDecimals(totalSupplyChain, ftDecimals))
        const totalVoteAmount: number = loSum(usersToDelegate.map((item) => item.voteAmount)) || 0
        const walletFtBalance: string | null = walletId ? await this.ftService.ftBalanceOf(walletId) : null
        const walletFtAmount = NumberHelper.parseNumber(NearUtils.amountFromDecimals(walletFtBalance || '0', ftDecimals))

        return {
            totalStaked,
            totalVoteAmount,
            walletFtAmount,
            wallet,
            usersToDelegate,
        }
    }
}