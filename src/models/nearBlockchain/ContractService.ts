import { Contract, transactions } from 'near-api-js';
import Utils from "./Utils";
import BN from 'bn.js';
import { cloneDeep } from 'lodash';

export default class ContractService {
  protected contract: Contract & any;

  /**
   * Transaction list
   */
  protected actions: any[]

  constructor(contract: Contract) {
    this.contract = contract
    this.actions = []
  }

  /**
   * Contract ID
   * @returns string
   */
  getContractId(): string {
    return this.contract.contractId
  }

  actionsAdd(methodName: string, args: any, tGas: number, nearDeposit?: number | string) {
    this.actions.push(
      transactions.functionCall(methodName, Buffer.from(JSON.stringify(args)), new BN(Utils.toTGas(tGas)), new BN(Utils.nearToYocto(nearDeposit || 0)))
    )
  }

  actionsReset() {
    this.actions = []
  }

  async actionsRun(): Promise<void> {
    const actionsList = cloneDeep(this.actions)
    this.actionsReset()

    return this.contract.account.signAndSendTransaction({
      receiverId: this.getContractId(),
      actions: actionsList,
    });
  }
}