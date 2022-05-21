import { Account, Contract} from 'near-api-js';

export default class WfProviderContract {
  private contract: Contract & any;

  constructor(account: Account, contractId: string) {
    this.contract = new Contract(account, contractId, {
      viewMethods: [
        'wf_templates',
        'wf_template',
        'wf_template_fn_calls',
        'wf_template_standard_fncalls',
        'standard_fn_call_metadata',
        'fncall_metadata',
        'standard_fncalls',
        'default_wf_add',
      ],
      changeMethods: [
      ],
    });
  }

  /**
   * List of templates
   * @return Metadata[]
   */
  async wfTemplates() {
    return this.contract.wf_templates();
  }

  /**
   * Get template
   * @return TemplateData
   */
  async wfTemplate(id: number) {
    return this.contract.wf_template({id});
  }

  /**
   * Get fn calls
   * @return FnCallId[]
   */
  async wfTemplateFnCalls(id: number) {
    return this.contract.wf_template_fn_calls({id});
  }

  /**
   * Get standard fncalls
   * @return FnCallId[]
   */
   async wfTemplateStandartFncalls(id: number) {
    return this.contract.wf_template_standard_fncalls({id});
  }

  /**
   * List of standard fn call metadata
   * @return Metadata[]
   */
   async standardFnCallMetadata() {
    return this.contract.standard_fn_call_metadata();
  }

  /**
   * Fncall metadata
   * @return Metadata[]
   */
  async fncallMetadata(id: number) {
    return this.contract.fncall_metadata({id});
  }

  /**
   * Standard Fncalls
   * @return [string,Metadata]
   */
  async standardFncalls() {
    return this.contract.standard_fncalls();
  }

  /**
   * Default wf_add
   * @return [Template, FnCallId, ObjectMetadata[], TemplateSettings[]]
   */
   async defaultWfAdd() {
    return this.contract.default_wf_add();
  }
}
