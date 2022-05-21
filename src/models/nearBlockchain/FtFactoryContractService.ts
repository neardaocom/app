import { Account, Contract} from 'near-api-js';

export default class FtFactoryContractService {
  private contract: Contract & any;

  constructor(account: Account, contractId: string) {
    this.contract = new Contract(account, contractId, {
      viewMethods: [
        'accounts',
      ],
      changeMethods: [
        'create',
      ],
    });
  }

  /**
   * Accounts List
   * @returns Promise
   */
  async getAccounts(): Promise<string[]> {
    //return factoryDaoList(); // TODO: local
    return this.contract.accounts({});
  }

  /**
   * Create Token by factory
   * 
   * @return Promise
   */
  async create(name: string, args: string, gas: string, yoctoNear: string): Promise<any> {
    console.log(name, args)
    return this.contract.create({name, args}, gas, yoctoNear)
  }
}
