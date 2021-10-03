import { Contract} from 'near-api-js';

export class ContractPool {
  account;
  pool = {};

  constructor(account) {
    this.account = account;
  }

  get(contractId) {
    if (this.pool[contractId]) {
      return this.pool[contractId];
    }

    const contract = new Contract(this.account, contractId, {
      viewMethods: [
        'statistics_ft',
        'statistics_members',
        'registred_user_count',
        'proposal',
        'proposals',
        'ft_balance_of',
        'ft_total_supply',
        'ft_metadata',
        'dao_fees',
        'payments',
        'doc_files',
      ],
      changeMethods: [
        'add_proposal',
        'vote',
        'finish_proposal'
      ],
    });

    this.pool[contractId] = contract;

    return contract;
  }
}
