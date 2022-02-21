import { Contract, Account } from "near-api-js";
import { GeneralTokenService } from "@/services/generalTokenService";

export default class RefFinanceService {
    private contract: Contract & any;

    constructor(account: Account & any, contractId: string) {
      this.contract = new Contract(account, contractId, {
        viewMethods: [
          'get_pool',
          'get_pools',
          'get_whitelisted_tokens',
          'get_pool_shares',
          'get_deposits',
          'get_user_whitelisted_tokens'
        ],
        changeMethods: [
        ],
      });
    }

  /**
   * Get pool by ID
   * 
   * @param poolId Pool ID on Ref Finance 
   * @returns Promise pool 
   */
   async getPool(poolId: number) {
    return this.contract.get_pool({"pool_id": poolId});
  }

    /**
   * Get deposits of Dao on Ref Finanace
   * 
   * @param accountId
   * @returns Promise deposits of Dao on Ref Finance
   */
     async getDeposits(accountId: string) {
      return this.contract.get_deposits({"account_id": accountId});
    }

      /**
   * Get pool shares of given account
   * 
   * @param poolId
   * @param accountId
   * @returns Promise Pool shares of given account
   */
   async getPoolShares(poolId: number, accountId: string) {
    return this.contract.get_pool_shares({"pool_id": poolId, "account_id": accountId});
  }

}
