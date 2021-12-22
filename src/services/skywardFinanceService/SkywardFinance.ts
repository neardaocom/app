import { Account, Contract} from 'near-api-js';

export default class SkywardFinance {
  private contract: Contract & any;

  constructor(account: Account, contractId: string) {
    this.contract = new Contract(account, contractId, {
      viewMethods: [
        'get_sales',
      ],
      changeMethods: [
      ],
    });
  }

  /**
   * Get list of DAO sales
   * 
   * @param ownerId Account ID of DAO 
   * @returns Promise List of sales
   */
  async getSales(accountId: string) {
    return this.contract.get_sales({account_id: accountId});
  }
}