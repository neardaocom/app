import { Account, Near } from 'near-api-js';

export default class NearAccountService {
  private account: Account;

  constructor(account: Account) {
    this.account = account;
  }

  /**
   * Get state
   * 
   * @return Promise
   */
  async getState() {
    //return { amount: '24000000000000000000000000' } // TODO: local
    return this.account.state();
  }
}
