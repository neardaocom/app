import TransformerInterface from "../../interfaces/Transformer.interface";
import { UserInfoStaking } from "../../nearBlockchain/types/staking"

export default class StakingTransformer implements TransformerInterface {
   //  private t: Function;
   //  private n: Function;

   //  constructor(t: Function, n: Function) {
   //      this.t = t;
   //      this.n = n;
   //  }

    transform(value: any, params: any) {
        const data: UserInfoStaking =  {
            vote_amount: value.vote_amount,
            delegated_amounts: value.delegated_amounts,
            delegated_vote_amount: value.delegated_vote_amount,
            delegators: value.delegators
        };
        return data
    }
}