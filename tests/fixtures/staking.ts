import { Staking } from "@/models/dao/types/staking";
import moment from "moment";

export const noneStaking = (): Staking => ({
   totalStaked: 0,
   totalVoteAmount: 0,
   walletFtAmount: null,
   wallet: null,
   usersToDelegate: []
})

export const basicStaking = (): Staking => ({
   totalStaked: 100_000,
   totalVoteAmount: 100_000,
   walletFtAmount: 10,
   wallet: {
      staked: 358,
      voteAmount: 54,
      delegatedVoteAmount: 148,
      delegations: [   
         {id: 1, accountId: "jake.near", voteAmount: 100},
         {id: 1, accountId: "mike.near", voteAmount: 48},
      ],
      delegators: [
         {id: 1, accountId: "petr.near", voteAmount: 100},
         {id: 2, accountId: "kuba.near", voteAmount: 48},
      ],
      delegatorsAmount: 148,
   },
   usersToDelegate: [
      {id: 1, accountId: "jake.near", bio: null, tag: null, votesCasted: 23, voteAmount: 100, value: 1, text: "jake.near"},
      {id: 2, accountId: "mike.near", bio: "bio", tag: "Advisor", votesCasted: 45, voteAmount: 100, value: 1, text: "jake.near"},
   ],
})
