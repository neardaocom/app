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
            voteAmount: value.vote_amount,
            delegatedAmounts: value.delegated_amounts,
            delegatedVoteAmount: value.delegated_voteAmount,
            delegators: value.delegators
        };
        return data
    }
}