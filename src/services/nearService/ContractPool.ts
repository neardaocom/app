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
        'dao_config',
        'vote_policies',
        'version_hash'
      ],
      changeMethods: [
        'add_proposal',
        'vote',
        'finish_proposal',
        'add_doc_file',
        'invalide_file',
        'unlock_tokens',
        'download_new_version',
        'upgrade_self'
      ],
    });

    this.pool[contractId] = contract;

    return contract;
  }
}
