import { Account, Contract} from 'near-api-js';

export default class SkywardFinance {
  private contract: Contract & any;

  constructor(account: Account, contractId: string) {
    this.contract = new Contract(account, contractId, {
      viewMethods: [
        'get_sales',
        'get_sales_by_id',
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
  async getSales() {
    return this.contract.get_sales();
  }

  /**
   * Get list of DAO sales by IDs
   * 
   * @param IDs
   * @returns Promise List of sales
   */
   async getSalesById(ids: number[]) {
    return this.contract.get_sales_by_id({sale_ids: ids});
  }
}