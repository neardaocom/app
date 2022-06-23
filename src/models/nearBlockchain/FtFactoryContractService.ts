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

  /*****************
   *    Change     *
   ****************/

  /**
   * Create Token by factory
   * 
   * @return this
   */
   create(name: string, args: string, tGas: number, nearDeposit: number | string): this {
    this.actionsAdd('create', {name, args}, tGas, nearDeposit)
    return this
  }

  /*****************
 *    Views      *
 ****************/

  /**
   * Accounts List
   * @returns Promise
   */
  async accounts(): Promise<string[]> {
    //return factoryDaoList(); // TODO: local
    return this.contract.accounts({});
  }
}
