import { Account, Contract} from 'near-api-js';
import { FungibleTokenMetadata, Settings, InitDistribution, StorageBalance, StorageBalanceBounds } from "./types/ft";
import ContractService from './ContractService';

export default class FtContractService extends ContractService {

  constructor(account: Account, contractId: string) {
    super(new Contract(account, contractId, {
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
    }));
  }

  /*****************
   *    Change     *
   ****************/

  /**
   * FT Transfer
   * 
   * @return this
   */
   ftTranser(receiverId: string, amount: string, memo: string|null, tGas: number): this {
     this.actionsAdd('ft_transfer', {receiver_id: receiverId, amount, memo}, tGas)
     return this
  }

  /**
   * FT Transfer Call
   * 
   * @return this
   */
   ftTranserCall(receiverId: string, amount: string, memo: string|null, msg: string, tGas: number, nearDeposit: number | string): this {
     // console.log({receiver_id: receiverId, amount, memo, msg})
     this.actionsAdd('ft_transfer_call', {receiver_id: receiverId, amount: amount, memo, msg}, tGas, nearDeposit)
     return this
   }

   /**
   * FT On transfer
   * 
   * @return this
   */
    ftOnTransfer(senderId: string, amount: string, msg: string, tGas: number, nearDeposit: number): this {
       this.actionsAdd('ft_on_transfer', {sender_id: senderId, amount, msg}, tGas, nearDeposit)
       return this
    }

  /**
   * Change settings
   * 
   * @return this
   */
   changeSettings(ownerId: string, totalSupply: string, metadata: FungibleTokenMetadata, settings: Settings|null, initDistribution: InitDistribution[], tGas: number, nearDeposit: number): this {
     this.actionsAdd('change_settings', {owner_id: ownerId, total_supply: totalSupply, metadata, settings, init_distribution: initDistribution}, tGas, nearDeposit)
     return this
  }

  /**
   * Mint new FT
   * 
   * @return this
   */
   mintNewFt(amount: string, msg: string|null, tGas: number, nearDeposit: number): this {
     this.actionsAdd('change_settings', {amount, msg}, tGas, nearDeposit)
     return this
  }

  /**
   * Payable method that receives an attached deposit of Ⓝ for a given account.
   * 
   * @return this
   */
   storageDeposit(accountId: string|null, registrationOnly: boolean|null, tGas: number, nearDeposit: number): this {
     this.actionsAdd('change_settings', {account_id: accountId, registration_only: registrationOnly}, tGas, nearDeposit)
     return this
  }

  /**
   * Withdraw specified amount of available Ⓝ for predecessor account.
   * 
   * @return this
   */
   storageWithdraw(amount: string|null, tGas: number): this {
     this.actionsAdd('storage_withdraw', {amount}, tGas)
     return this
  }

  /**
   * Unregisters the predecessor account and returns the storage NEAR deposit.
   * 
   * @return this
   */
   storageUnregister(force: boolean|null, tGas: number): this {
     this.actionsAdd('storage_unregister', {force}, tGas)
     return this
  }

  /*****************
 *    Views      *
 ****************/

  /**
   * Total supply
   * @returns this
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
