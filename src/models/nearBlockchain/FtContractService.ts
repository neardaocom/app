import { Account, Contract} from 'near-api-js';
import { FungibleTokenMetadata, Settings, InitDistribution, StorageBalance, StorageBalanceBounds } from "./types/ft";

export default class FtContractService {
  private contract: Contract & any;

  constructor(account: Account, contractId: string) {
    this.contract = new Contract(account, contractId, {
      viewMethods: [
        'ft_total_supply',
        'ft_balance_of',
        'ft_balances_of',
        'ft_metadata',
        'settings',
        'storage_balance_bounds',
        'storage_balance_of',
      ],
      changeMethods: [
        'ft_transfer',
        'ft_transfer_call',
        'ft_on_transfer',
        'new',
        'change_settings',
        'mint_new_ft',
        'storage_deposit',
        'storage_withdraw',
        'storage_unregister',
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
   * Metadata
   * @returns Promise
   */
   async ftMetadata(): Promise<FungibleTokenMetadata> {
    return this.contract.ft_metadata();
  }

  /**
   * Settings
   * @returns Promise
   */
   async settings(): Promise<Settings> {
    return this.contract.settings();
  }

  /**
   * FT Transfer
   * 
   * @return Promise
   */
  async ftTranser(receiverId: string, amount: string, memo: string|null, gas: string) {
    return this.contract.ft_transfer({receiver_id: receiverId, amount, memo}, gas)
  }

  /**
   * FT Transfer Call
   * 
   * @return Promise
   */
   async ftTranserCall(receiverId: string, amount: string, memo: string|null, msg: string, gas: string, yoctoNear: string) {
     console.log({receiver_id: receiverId, amount, memo, msg})
    return this.contract.ft_transfer_call({receiver_id: receiverId, amount: amount.toString(), memo, msg}, gas, yoctoNear)
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

  /**
   * Payable method that receives an attached deposit of Ⓝ for a given account.
   * 
   * @return Promise
   */
   async storageDeposit(accountId: string|null, registrationOnly: boolean|null, gas: string, yoctoNear: string): Promise<StorageBalance> {
    return this.contract.change_settings({account_id: accountId, registration_only: registrationOnly}, gas, yoctoNear)
  }

  /**
   * Withdraw specified amount of available Ⓝ for predecessor account.
   * 
   * @return Promise
   */
   async storageWithdraw(amount: string|null, gas: string): Promise<StorageBalance> {
    return this.contract.storage_withdraw({amount}, gas)
  }

  /**
   * Unregisters the predecessor account and returns the storage NEAR deposit.
   * 
   * @return Promise
   */
   async storageUnregister(force: boolean|null, gas: string): Promise<boolean> {
    return this.contract.storage_unregister({force}, gas)
  }

  /**
   * Returns minimum and maximum allowed balance amounts to interact with this contract. See StorageBalanceBounds.
   * 
   * @return Promise
   */
   async storageBalanceBounds(): Promise<StorageBalanceBounds> {
    return this.contract.storage_balance_bounds()
  }

  /**
   * Returns the StorageBalance structure of the valid `account_id` provided. Must panic if `account_id` is invalid.
   * 
   * @return Promise
   */
   async storageBalanceOf(accountId: string): Promise<StorageBalance|null> {
    return this.contract.storage_balance_of({account_id: accountId})
  }
}
