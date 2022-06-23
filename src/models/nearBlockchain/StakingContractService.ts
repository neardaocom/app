import { Account, Contract } from 'near-api-js';
import { User } from './types/staking';
import ContractService from './ContractService';

export default class StakingContractService extends ContractService {

   constructor(account: Account, contractId: string) {
      super(new Contract(account, contractId, {
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
         viewMethods: [
            'dao_ft_total_supply',
            'dao_ft_balance_of',
            'dao_get_user',
            'dao_user_list',
            'storage_balance_bounds',
            'storage_balance_of',
         ],
      }));
   }

   /*****************
    *    Change     *
    ****************/

   /**
    * Inits contract
    * 
    * @return void
    */
   new(registerId: string, tGas: number): this {
      this.actionsAdd('new', { registrar_id: registerId }, tGas)
      return this
   }

   /**
    * Requires deposit for storage
    * Must be called before "register_in_dao"
    * If dao is already registered and registration_only is false, then provided deposit is added to its storage deposit
    * 
    * @return void
    */
   storageDeposit(accountId: string | null, registrationOnly: boolean | null, tGas: number, nearDeposit: number): this {
      this.actionsAdd('storage_deposit', { account_id: accountId, registration_only: registrationOnly }, tGas, nearDeposit);
      return this
   }

   /**
    * Registers dao in staking service
    * Only registrar can call this function
    * 
    * @return void
    */
   registerNewDao(daoId: string, voteTokenId: string, tGas: number, nearDeposit: number): this {
      this.actionsAdd('register_new_dao', { dao_id: daoId, vote_token_id: voteTokenId }, tGas, nearDeposit);
      return this
   }

   /**
    * Registers caller in dao
    * Requires reversible deposit
    * 
    * @return void
    */
   registerInDao(daoId: string, tGas: number, nearDeposit: number): this {
      this.actionsAdd('register_in_dao', { dao_id: daoId }, tGas, nearDeposit);
      return this
   }

   /**
    * Delegates caller's amount vote tokens to delegate in the dao
    * Delegate must be registered in the dao
    * 
    * @return void
    */
   delegateOwned(daoId: string, delegateId: string, amount: string, tGas: number): this {
      this.actionsAdd('delegate_owned', { dao_id: daoId, delegate_id: delegateId, amount: amount }, tGas);
      return this
   }

   /**
    * Delegates all delegated tokens to delegate ~ Forwarding
    * Delegate must be registered in the dao
    * 
    * @return void
    */
   delegate(daoId: string, delegateId: string, tGas: number): this {
      this.actionsAdd('delegate', { dao_id: daoId, delegate_id: delegateId }, tGas);
      return this
   }

   /**
    * Undelegates amount from delegate back to delegator
    * 
    * @return void
    */
   undelegate(daoId: string, delegateId: string, amount: string, tGas: number): this {
      this.actionsAdd('undelegate', { dao_id: daoId, delegate_id: delegateId, amount: amount }, tGas);
      return this
   }

   /**
    * Withdraws free amount of staked vote tokens from dao back to caller
    * 
    * @return void
    */
   withdraw(daoId: string, amount: string, tGas: number): this {
      this.actionsAdd('withdraw', { dao_id: daoId, amount: amount }, tGas);
      return this
   }

   /**
    * Unregister caller in dao if he has zero owned vote tokens and zero delegated vote tokens
    * Returns register deposit
    * 
    * @return void
    */
   unregisterInDao(daoId: string, tGas: number): this {
      this.actionsAdd('unregister_in_dao', { dao_id: daoId }, tGas);
      return this
   }

   /**
    * Returns provided amount or all available amount (if null) of NEAR paid for storage
    * Panics if amount is greater than available
    * 
    * @return void
    */
   storageWithdraw(amount: string | null, tGas: number): this {
      this.actionsAdd('storage_withdraw', { amount: amount }, tGas);
      return this
   }

   /**
    * Unregisters caller (dao) from staking service
    * Returns all storage deposit
    * Dao is required to have zero registered users
    *! Force is not currently supported
    * 
    * @return void
    */
   storageUnregister(force: boolean | null, tGas: number): this {
      this.actionsAdd('storage_unregister', { force: force }, tGas);
      return this
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
