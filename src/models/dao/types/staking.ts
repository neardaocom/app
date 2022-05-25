export type StakingUserToDelegate = {
   id: number;
   accountId: string;
   bio: string|null;
   tag: string|null;
   votesCasted: number;
   voteAmount: number;
   value: number; // For select in form
   text: string; // For select in form
}

export type StakingDelegation = {
   id: number;
   accountId: string;
   voteAmount: number;
}

export type StakingWallet = {
   staked: number;
   voteAmount: number;
   delegatedVoteAmount: number;
   delegations: StakingDelegation[];
   delegators: StakingDelegation[];
   delegatorsAmount: number;
}

export type Staking = {
   totalStaked: number;
   totalVoteAmount: number;
   walletFtAmount: number | null;
   wallet: StakingWallet | null;
   usersToDelegate: StakingUserToDelegate[];
}