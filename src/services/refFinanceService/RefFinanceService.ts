import { Contract, Account } from "near-api-js";

export default class RefFinanceService {
    private contract: Contract & any;

    constructor(account: Account, contractId: string) {
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
}
