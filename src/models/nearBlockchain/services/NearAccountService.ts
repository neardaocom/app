import { Account, Near } from 'near-api-js';

export default class NearAccount {
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
    return this.account.state();
  }
}
