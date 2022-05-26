import { Contract } from 'near-api-js';

export default class ContractService {
    protected contract: Contract & any;

    constructor(contract: Contract) {
      this.contract = contract
    }
  
    /**
     * Contract ID
     * @returns string
     */
    getContractId(): string {
      return this.contract.contractId
    }
}