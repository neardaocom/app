import { Account, Contract} from 'near-api-js';
import _ from "lodash"

export class ContractPool {
  private account: Account;
  private pool: { [key: string]: Contract } = {};

  constructor(account: Account) {
    this.account = account;
  }

  get(contractId: string): Contract & any {
    if (this.pool[contractId]) {
      return this.pool[contractId];
    }

    const contract = new Contract(this.account, contractId, {
      viewMethods: [
        'wf_templates',
        'wf_instance',
        'groups',
        'tags',
        'media_list',
        'proposals',
        'dao_settings',
        'stats',
        'ft_metadata',
        'storage_buckets', // storage keys
        'storage_bucket_data_all', // storage data
        'ft_balance_of',
      ],
      changeMethods: [
        'propose',
        'vote',
        'finish_proposal',
      ],
    });

    this.pool[contractId] = contract;

    return contract;
  }
}
