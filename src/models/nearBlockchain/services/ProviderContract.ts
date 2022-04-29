import { Account, Contract} from 'near-api-js';

export default class ProviderContract {
  private contract: Contract & any;

  constructor(account: Account, contractId: string) {
    this.contract = new Contract(account, contractId, {
      viewMethods: [
        'wf_templates',
        'wf_template',
        'wf_template_fncalls',
        'fncall_metadata',
      ],
      changeMethods: [
      ],
    });
  }

  /**
   * Provider: List
   */
   async list() {
    return this.contract.wf_templates();
  }

  /**
   * Provider: Get
   */
   async get(id: number) {
    return this.contract.wf_template({id: id});
  }
}
