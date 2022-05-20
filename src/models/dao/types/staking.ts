export type StakingUserToDelegate = {
   id: number;
   accountId: string;
   bio: string|null;
   tag: string|null;
   votesCasted: number;
}

export type StakingDelegatedAmounts = {
   id: number;
   accountId: string;
   amount: number;
}

export type StakingUserInfo = {
   staked: number;
   delegated: number;
   delegatedAmounts: StakingDelegatedAmounts[]
   delegators: string[];
}

export type Staking = {
   totalStaked: number;
   userInfo: StakingUserInfo | null;
   usersToDelegate: StakingUserToDelegate[];
}
 
