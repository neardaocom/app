import StakingContractService from "../nearBlockchain/StakingContractService";
import FtContractService from "../nearBlockchain/FtContractService";
import { WalletConnection } from "near-api-js";
import WalletTransaction from "../nearBlockchain/WalletTransaction";
import NearUtils from "../nearBlockchain/Utils";

export default class DaoStaking {
    private id: string;
    private stakingService: StakingContractService;
    private ftService: FtContractService;
    private wallet: WalletConnection;

    constructor(id: string, stakingService: StakingContractService, ftService: FtContractService, wallet: WalletConnection) {
        this.id = id
        this.stakingService = stakingService
        this.ftService = ftService
        this.wallet = wallet
    }

    async registerToken(tokenAccountId: string, nearDeposit: number = 1) {
        const walletTransaction = new WalletTransaction(this.wallet)
        walletTransaction.addAction('storage_deposit', {account_id: this.id, registration_only: true}, 50, nearDeposit)
        walletTransaction.addAction('register_new_dao', {dao_id: this.id, vote_token_id: tokenAccountId}, 50, 0)
        await walletTransaction.run(this.stakingService.getContractId())
    }

    async stakeRegister() {
        this.stakingService.registerInDao(this.id, NearUtils.toTGas(50), NearUtils.nearToYocto(0.155))
    }

    async stake(amount: number) {
        this.ftService.ftTranserCall(this.stakingService.getContractId(), NearUtils.amountToDecimals(amount.toString(), 24), null, "{\"dao_id\":\"" + this.id + "\"}", NearUtils.toTGas(50), '1')
    }

    async delegate(delegateId: string, amount: number) {
        this.stakingService.delegateOwned(this.id, delegateId, NearUtils.amountToDecimals(amount.toString(), 24), NearUtils.toTGas(50))
    }

    async undelegate(delegateId: string, amount: number) {
        this.stakingService.delegateOwned(this.id, delegateId, NearUtils.amountToDecimals(amount.toString(), 24), NearUtils.toTGas(50))
    }

    async forward(delegateId: string) {
        this.stakingService.delegate(this.id, delegateId, NearUtils.toTGas(100))
    }

    async withdraw(amount: number) {
        this.stakingService.withdraw(this.id, NearUtils.amountToDecimals(amount.toString(), 24), NearUtils.toTGas(100))
    }


}