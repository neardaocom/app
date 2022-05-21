import { WalletConnection, transactions } from "near-api-js";
import { TransactionAction } from "./types/blockchain";
import Utils from "./Utils";
import BN from 'bn.js';

export default class WalletTransaction {
    private wallet: WalletConnection;
    private actions: TransactionAction[]

    constructor(wallet: WalletConnection) {
        this.wallet = wallet
        this.actions = []
    }

    reset() {
        this.actions = []
    }

    addAction(methodName: string, args: any, tGas: number, nearDeposit: number) {
        this.actions.push({methodName, args, tGas, nearDeposit})
    }

    async run(contractId: string) {
        const account:any = this.wallet.account()

        return account.signAndSendTransaction({
            receiverId: contractId,
            actions: this.actions.map((action:  TransactionAction) => 
                transactions.functionCall(action.methodName, Buffer.from(JSON.stringify(action.args)), new BN(Utils.toTGas(action.tGas)), new BN(Utils.nearToYocto(action.nearDeposit)))
            )
        });
      }
}