import { Account, Contract } from 'near-api-js';
import { User } from './types/staking';

export default class StakingContract {
  private contract: Contract & any;

  constructor(account: Account, contractId: string) {
    this.contract = new Contract(account, contractId, {
      viewMethods: [
        'dao_ft_total_supply',
        'dao_ft_balance_of',
        'dao_get_user',
        'dao_user_list',
        'storage_balance_bounds',
        'storage_balance_of',
      ],
      changeMethods: [
        'new',
        'storage_deposit',
        'register_new_dao',
        'register_in_dao',
        'delegate_owned',
        'delegate',
        'undelegate',
        'withdraw',
        'unregister_in_dao',
        'storage_withdraw',
        'storage_unregister',
      ],
    });
  }


   /*****************
    *    Change     *
    ****************/

   /**
    * Inits contract
    * 
    * @return Promise
    */
   async new(registerId :string, gas: string) {
      return this.contract.new({ registrar_id: registerId }, gas)
   }

   /**
    * Requires deposit for storage
    * Must be called before "register_in_dao"
    * If dao is already registered and registration_only is false, then provided deposit is added to its storage deposit
    * 
    * @return Promise
    */
   async storageDeposit(accountId: string|null, registrationOnly: boolean|null,  gas: string, deposit: string) {
      return this.contract.storage_deposit({ account_id: accountId, registration_only: registrationOnly } , gas, deposit);
   }

   /**
    * Registers dao in staking service
    * Only registrar can call this function
    * 
    * @return Promise
    */
   async registerNewDao(daoId: string, voteTokenId: string, gas: string) {
      return this.contract.register_new_dao({ dao_id: daoId, vote_token_id: voteTokenId }, gas);
   }

   /**
    * Registers caller in dao
    * Requires reversible deposit
    * 
    * @return Promise
    */
   async registerInDao(daoId: string, gas: string, deposit: string) {
      return this.contract.register_in_dao({ dao_id: daoId }, gas, deposit);
   }

   /**
    * Delegates caller's amount vote tokens to delegate in the dao
    * Delegate must be registered in the dao
    * 
    * @return Promise
    */
   async delegateOwned( daoId: string, delegateId: string, amount: string, gas: string) {
      return this.contract.delegate_owned({ dao_id: daoId, delegate_id: delegateId, amount: amount }, gas);
   }

   /**
    * Delegates all delegated tokens to delegate
    * Delegate must be registered in the dao
    * 
    * @return Promise
    */
   async delegate(daoId: string, delegateId: string, amount: string, gas: string) {
      return this.contract.delegate({ dao_id: daoId, delegate_id: delegateId, amount: amount }, gas);
   }

   /**
    * Undelegates amount from delegate back to delegator
    * 
    * @return Promise
    */
   async undelegate(daoId: string, delegateId: string, amount: string, gas: string) {
      return this.contract.undelegate({ dao_id: daoId, delegate_id: delegateId, amount: amount }, gas);
   }

   /**
    * Withdraws free amount of staked vote tokens from dao back to caller
    * 
    * @return Promise
    */
    async withdraw(daoId: string, amount: string, gas: string) {
      return this.contract.withdraw({ dao_id: daoId, amount: amount }, gas);
   }

   /**
    * Unregister caller in dao if he has zero owned vote tokens and zero delegated vote tokens
    * Returns register deposit
    * 
    * @return Promise
    */
    async unregisterInDao(daoId: string, gas: string) {
      return this.contract.unregister_in_dao({ dao_id: daoId }, gas);
   }

   /**
    * Returns provided amount or all available amount (if null) of NEAR paid for storage
    * Panics if amount is greater than available
    * 
    * @return Promise
    */
    async storageWithdraw(amount: string|null, gas: string) {
      return this.contract.storage_withdraw({ amount: amount }, gas);
   }

   /**
    * Unregisters caller (dao) from staking service
    * Returns all storage deposit
    * Dao is required to have zero registered users
    *! Force is not currently supported
    * 
    * @return Promise
    */
    async storageUnregister(force: boolean|null, gas: string) {
      return this.contract.storage_unregister({ force: force }, gas);
   }


   /*****************
    *    Views      *
    ****************/


   /**
    * Returns total amount of staked vote tokens in the dao
    * 
    * @return Promise - total amount of staked vote tokens in the dao
    */
   async daoFtTotalSupply(daoId: string) {
      return this.contract.dao_ft_total_supply({ dao_id: daoId });
   }

   /**
    * Returns total amount of staked vote tokens by the user in the dao
    * 
    * @return Promise - total amount of staked vote tokens by the user in the dao
    */
   async daoFtBalanceOf(daoId: string, accountId: string) {
      return this.contract.dao_ft_balance_of({ dao_id: daoId, account_id: accountId });
   }

   /**
    * Returns information about user
    * 
    * @return Promise - information about user
    */
   async daoGetUser(daoId: string, accountId: string) {
      return this.contract.dao_get_user({ dao_id: daoId, account_id: accountId });
   }

   /**
    * Return all users registered in the dao
    * 
    * @return Promise
    */
    async daoUserList(daoId: string): Promise<[string, User]> {
      return this.contract.dao_user_list({ dao_id: daoId });
   }

   /**
    * Returns minimum and maximum allowed balance amounts to interact with this
    * 
    * @return Promise - bounds of dao
    */
   async storageBalanceBounds() {
      return this.contract.storage_balance_bounds();
   }

   /**
    * Returns the total and available balance. Must panic if `account_id` is invalid.
    * 
    * @return Promise - total and available balance.
    */
   async storageBalanceOf(accountId: string) {
      return this.contract.storage_balance_of({ account_id: accountId });
   }
}
