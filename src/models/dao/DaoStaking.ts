import StakingContractService from "../nearBlockchain/StakingContractService";
import { WalletConnection } from "near-api-js";
import WalletTransaction from "../nearBlockchain/WalletTransaction";

export default class DaoStaking {
    private id: String;
    private service: StakingContractService;
    private wallet: WalletConnection;

    constructor(id: string, service: StakingContractService, wallet: WalletConnection) {
        this.id = id
        this.service = service
        this.wallet = wallet
    }

    async registerToken(tokenAccountId: string, nearDeposit: number = 1) {
        const walletTransaction = new WalletTransaction(this.wallet)
        walletTransaction.addAction('storage_deposit', {account_id: this.id, registration_only: true}, 50, nearDeposit)
        walletTransaction.addAction('register_new_dao', {dao_id: this.id, vote_token_id: tokenAccountId}, 50, 0)
        await walletTransaction.run(this.service.getContractId())
    }
}