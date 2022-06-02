import { Account, Contract} from 'near-api-js';
import { DeprecatedError } from '../utils/errors';
import ContractService from './ContractService';

export default class WfProviderContract extends ContractService {

  constructor(account: Account, contractId: string) {
    super(new Contract(account, contractId, {
      viewMethods: [
        'wf_templates',
        'wf_template',
        'wf_template_fn_calls',
        'wf_template_standard_fncalls',
        'standard_fn_call_metadata',
        'fncall_metadata',
        'standard_fncalls',
        'default_wf_add',
        'wf_basic_package',
      ],
      changeMethods: [
      ],
    }));
  }

  /*****************
    *    Views      *
    ****************/

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
     throw new DeprecatedError('DefaultWfAdd is deprecated')
    // return this.contract.default_wf_add();
  }

  /**
   * Default basic package
   * @return [Template, FnCallId, ObjectMetadata[], TemplateSettings[]]
   */
   async wfBasicPackage() {
    return this.contract.wf_basic_package();
  }
}
