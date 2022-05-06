import StakingContractService from "./services/StakingContractService";
import { StorageBalance, StorageBalanceBounds } from "./types/storageManagement";
import { UserInfoStaking } from "./types/staking"
import TransformerInterface from "../interfaces/Transformer.interface";
  
export default class Staking {
    // staking contract
    service: StakingContractService;
  
    constructor(service: StakingContractService) {
      this.service = service;
    }
  
    /*****************
    *    Change     *
    ****************/

   /**
    * Inits contract
    * 
    * @return Promise
    */
   async new(registerId :string, gas: string): Promise<void> {
      // ?? gas defined here or in parrams
      return this.service.new(registerId, gas)
   }

   /**
    * Requires deposit for storage
    * Must be called before "register_in_dao"
    * If dao is already registered and registration_only is false, then provided deposit is added to its storage deposit
    * 
    * @return Promise
    */
   async storageDeposit(accountId: string|null, registrationOnly: boolean|null,  gas: string): Promise<StorageBalance> {
      return this.service.storageDeposit(accountId, registrationOnly, gas);
   }

   /**
    * Registers dao in staking service
    * Only registrar can call this function
    * 
    * @return Promise
    */
   async registerNewDao(daoId: string, voteTokenId: string, gas: string): Promise<void> {
      return this.service.registerNewDao(daoId, voteTokenId, gas);
   }

   /**
    * Registers caller in dao
    * Requires reversible deposit
    * 
    * @return Promise
    */
   async registerInDao(daoId: string, gas: string): Promise<void> {
      return this.service.registerInDao(daoId, gas);
   }

   /**
    * Delegates caller's amount vote tokens to delegate in the dao
    * Delegate must be registered in the dao
    * 
    * @return Promise
    */
   async delegateOwned( daoId: string, delegateId: string, amount: string, gas: string): Promise<void> {
      return this.service.delegateOwned(daoId, delegateId, amount, gas);
   }

   /**
    * Delegates all delegated tokens to delegate
    * Delegate must be registered in the dao
    * 
    * @return Promise
    */
   async delegate(daoId: string, delegateId: string, amount: string, gas: string): Promise<void> {
      return this.service.delegate(daoId, delegateId, amount, gas);
   }

   /**
    * Undelegates amount from delegate back to delegator
    * 
    * @return Promise
    */
   async undelegate(daoId: string, delegateId: string, amount: string, gas: string): Promise<void> {
      return this.service.undelegate(daoId, delegateId, amount, gas);
   }

   /**
    * Withdraws free amount of staked vote tokens from dao back to caller
    * 
    * @return Promise
    */
    async withdraw(daoId: string, amount: string, gas: string): Promise<void> {
      return this.service.withdraw(daoId, amount, gas);
   }

   /**
    * Unregister caller in dao if he has zero owned vote tokens and zero delegated vote tokens
    * Returns register deposit
    * 
    * @return Promise
    */
    async unregisterInDao(daoId: string, gas: string): Promise<void> {
      return this.service.unregisterInDao(daoId, gas);
   }

   /**
    * Returns provided amount or all available amount (if null) of NEAR paid for storage
    * Panics if amount is greater than available
    * 
    * @return Promise
    */
    async storageWithdraw(amount: string|null, gas: string): Promise<StorageBalance> {
      return this.service.storageWithdraw(amount, gas);
   }

   /**
    * Unregisters caller (dao) from staking service
    * Returns all storage deposit
    * Dao is required to have zero registered users
    *! Force is not currently supported
    * 
    * @return Promise
    */
    async storageUnregister(force: boolean|null, gas: string): Promise<boolean> {
      return this.service.storageUnregister(force, gas);
   }


   /*****************
    *    Views      *
    ****************/


   /**
    * Returns total amount of staked vote tokens in the dao
    * 
    * @return Promise - total amount of staked vote tokens in the dao
    */
   async daoFtTotalSupply(daoId: string): Promise<string> {
      return this.service.daoFtTotalSupply(daoId);
   }

   /**
    * Returns total amount of staked vote tokens by the user in the dao
    * 
    * @return Promise - total amount of staked vote tokens by the user in the dao
    */
   async daoFtBalanceOf(daoId: string, accountId: string): Promise<string> {
      return this.service.daoFtBalanceOf(daoId, accountId);
   }

   /**
    * Returns information about user
    * 
    * @return Promise - information about user
    */
   async daoGetUser(daoId: string, accountId: string, transformer: TransformerInterface): Promise<UserInfoStaking> {
      const userInfo = await this.service.daoGetUser(daoId, accountId);
      return transformer.transform(userInfo, {})
   }

   /**
    * Returns minimum and maximum allowed balance amounts to interact with this
    * 
    * @return Promise - bounds of dao
    */
   async storageBalanceBounds(): Promise<StorageBalanceBounds> {
      return this.service.storageBalanceBounds();
   }

   /**
    * Returns the total and available balance. Must panic if `account_id` is invalid.
    * 
    * @return Promise - total and available balance.
    */
   async storageBalanceOf(accountId: string): Promise<StorageBalance|null> {
      return this.service.storageBalanceOf(accountId);
   }
}