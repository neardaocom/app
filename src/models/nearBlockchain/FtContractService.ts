import { Account, Contract} from 'near-api-js';
import { FungibleTokenMetadata, Settings, InitDistribution } from "./types/ft";

export default class FtContractService {
  private contract: Contract & any;

  constructor(account: Account, contractId: string) {
    this.contract = new Contract(account, contractId, {
      viewMethods: [
        'ft_total_supply',
        'ft_balance_of',
        'ft_balances_of',
        'settings',
      ],
      changeMethods: [
        'ft_transfer',
        'ft_transfer_call',
        'ft_on_transfer',
        'new',
        'change_settings',
        'mint_new_ft',
      ],
    });
  }

  /**
   * Total supply
   * @returns Promise
   */
  async ftTotalSupply() {
    return this.contract.ft_total_supply();
  }

  /**
   * Balance Of Account
   * @returns Promise
   */
   async ftBalanceOf(accountId: string) {
    return this.contract.ft_balance_of({account_id: accountId});
  }

  /**
   * Balance Of Accounts
   * @returns Promise
   */
   async ftBalancesOf(accountIds: string[]) {
    return this.contract.ft_balances_of({account_ids: accountIds});
  }

  /**
   * Settings
   * @returns Promise
   */
   async settings() {
    return this.contract.settings();
  }

  /**
   * FT Transfer
   * 
   * @return Promise
   */
  async ftTranser(receiverId: string, amount: string, memo: string|null, gas: string, yoctoNear: string) {
    return this.contract.ft_transfer({receiver_id: receiverId, amount, memo}, gas, yoctoNear)
  }

  /**
   * FT Transfer Call
   * 
   * @return Promise
   */
   async ftTranserCall(receiverId: string, amount: string, memo: string|null, msg: string, gas: string, yoctoNear: string) {
    return this.contract.ft_transfer_call({receiver_id: receiverId, amount, memo, msg}, gas, yoctoNear)
   }

   /**
   * FT On transfer
   * 
   * @return Promise
   */
    async ftOnTransfer(senderId: string, amount: string, msg: string, gas: string, yoctoNear: string) {
      return this.contract.ft_on_transfer({sender_id: senderId, amount, msg}, gas, yoctoNear)
    }

  /**
   * Change settings
   * 
   * @return Promise
   */
   async changeSettings(ownerId: string, totalSupply: string, metadata: FungibleTokenMetadata, settings: Settings|null, initDistribution: InitDistribution[], gas: string, yoctoNear: string) {
    return this.contract.change_settings({owner_id: ownerId, total_supply: totalSupply, metadata, settings, init_distribution: initDistribution}, gas, yoctoNear)
  }

  /**
   * Mint new FT
   * 
   * @return Promise
   */
   async mintNewFt(amount: string, msg: string|null, gas: string, yoctoNear: string) {
    return this.contract.change_settings({amount, msg}, gas, yoctoNear)
  }
}
