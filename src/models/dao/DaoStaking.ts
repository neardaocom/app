import StakingContractService from "../nearBlockchain/StakingContractService";
import FtContractService from "../nearBlockchain/FtContractService";
import NearUtils from "../nearBlockchain/Utils";

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
}