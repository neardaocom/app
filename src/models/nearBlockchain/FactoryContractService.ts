import { Account, Contract} from 'near-api-js';
import { factoryDaoList } from '../../../tests/fixtures/dao'
import { DaoInfo } from './types/dao';
export default class FactoryContractService {
  private contract: Contract & any;

  constructor(account: Account, contractId: string) {
    this.contract = new Contract(account, contractId, {
      viewMethods: [
        'get_dao_list',
        'get_tags',
        // 'get_dao_info', // TODO: Check API
        // 'get_stats', // TODO: Check API
        // 'version_hash' // TODO: Check API
      ],
      changeMethods: [
        'create',
        // 'add_tags', // TODO: Check API
      ],
    });
  }

  /**
   * DAO List
   * @returns Promise
   */
  async getDaoList(from: number = 0, limit: number = 100): Promise<[string, DaoInfo][]> {
    //return factoryDaoList(); // TODO: local
    return this.contract.get_dao_list({from_index: from, limit: limit});
  }

  /**
   * Get tags
   * @returns Promise
   */
  async getTags(): Promise<string[]> {
    //return ['dao']; // TODO: local
    return this.contract.get_tags();
  }

///**
// * Get newest version hash of contract
// * 
// * @returns Promise
// */
//async getNewestVersionHash(version: number = 0) {
//  return this.contract.version_hash({version: version});
//}

  /**
   * Create DAO by factory
   * 
   * @return Promise
   */
  async create(args: any, gas: string, yoctoNear: string) {
    return this.contract.create(args, gas, yoctoNear)
  }
}
