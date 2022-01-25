import { Contract, Account} from "near-api-js";

export default class GeneralTokenService {
  private contract: Contract & any;

  constructor(account: Account, contractId: string) {
    this.contract = new Contract(account, contractId, {
      viewMethods: [
        'ft_metadata'
      ],
      changeMethods: [
      ],
    });
  }


  async getFtMetadata(){
    return this.contract.ft_metadata()
  }

}