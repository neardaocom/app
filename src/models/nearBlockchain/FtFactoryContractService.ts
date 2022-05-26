import { Account, Contract} from 'near-api-js';
import ContractService from './ContractService';

export default class FtFactoryContractService extends ContractService {

  constructor(account: Account, contractId: string) {
    super(new Contract(account, contractId, {
      viewMethods: [
        'accounts',
      ],
      changeMethods: [
        'create',
      ],
    }));
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
    return this.contract.create({name, args}, gas, yoctoNear)
  }
}
