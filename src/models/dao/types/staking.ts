export type StakingUserToDelegate = {
   id: number;
   accountId: string;
   bio: string|null;
   tag: string|null;
   votesCasted: number;
   voteAmount: number;
}

export type StakingDelegation = {
   id: number;
   accountId: string;
   voteAmount: number;
}

export type StakingUserInfo = {
   staked: number;
   voteAmount: number;
   delegatedVoteAmount: number;
   delegations: StakingDelegation[];
   delegators: string[];
}

export type Staking = {
   totalStaked: number;
   userInfo: StakingUserInfo | null;
   usersToDelegate: StakingUserToDelegate[];
}
 
