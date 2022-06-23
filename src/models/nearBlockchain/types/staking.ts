export type DelegatedAmounts = any

export type UserInfoStaking = {
   vote_amount: string; // total amount of deposited vote tokens in this dao
   delegated_amounts: [string, string][]; // array of tuples [delegate_id: string, amount: string]
   delegated_vote_amount: string; // sum of all delegated vote tokens
   delegators: string[]; // array of delegators
}

export type User = any