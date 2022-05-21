import { Staking } from "@/models/dao/types/staking";
import moment from "moment";

export const noneStaking = (): Staking => ({
   totalStaked: 0,
   userInfo: null,
   usersToDelegate: []
})

export const basicStaking = (): Staking => ({
   totalStaked: 100_000,
   userInfo: {
      staked: 358,
      delegated: 148,
      delegatedAmounts: [   
         {id: 1, accountId: "jake.near", amount: 100},
         {id: 1, accountId: "mike.near", amount: 48},
      ],
      delegators: ["petr.near", "kuba.near"],
   },
   usersToDelegate: [
      {id: 1, accountId: "jake.near", bio: null, tag: null, votesCasted: 23},
      {id: 1, accountId: "mike.near", bio: "bio", tag: "Advisor", votesCasted: 45},
   ],
})
