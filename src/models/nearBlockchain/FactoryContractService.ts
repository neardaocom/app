import { Account, Contract} from 'near-api-js';
import { factoryDaoList } from '../../../tests/fixtures/dao'
export default class FactoryContractService {
  private contract: Contract & any;

  constructor(account: Account, contractId: string) {
    this.contract = new Contract(account, contractId, {
      viewMethods: [
        'get_dao_list',
        'get_dao_info',
        'get_tags',
        'get_stats',
        'version_hash'
      ],
      changeMethods: [
        'create',
        'add_tags',
      ],
    });
  }

  /**
   * DAO List
   * @returns Promise
   */
  async getDaoList(from: number = 0, limit: number = 100) {
    //return factoryDaoList(); // TODO: local
    return this.contract.get_dao_list({from_index: from, limit: limit});
  }

  /**
   * Get tags
   * @returns Promise
   */
  async getTags() {
    //return ['dao']; // TODO: local
    return this.contract.get_tags();
  }

  /**
   * Get dao info
   * 
   * @returns Promise
   */
  async getDaoInfo(daoId: string) {
    return this.contract.get_dao_info({account: daoId});
  }

  /**
   * Get dao stats
   * 
   * @returns Promise
   */
  async getDaoStats() {
    return this.contract.get_stats();
  }

  /**
   * Get newest version hash of contract
   * 
   * @returns Promise
   */
  async getNewestVersionHash(version: number = 0) {
    return this.contract.version_hash({version: version});
  }

  /**
   * Create DAO by factory
   * 
   * @return Promise
   */
  async create(args: any, gas: string, yoctoNear: string) {
    return this.contract.create(args, gas, yoctoNear)
  }
}
