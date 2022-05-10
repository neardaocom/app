export type DelegatedAmounts = {

}
export type UserInfoStaking = {
   voteAmount: string, // total amount of deposited vote tokens in this dao
   delegatedAmounts: [string, string][] // array of tuples [delegate_id: string, amount: string]
   delegatedVoteAmount: string // sum of all delegated vote tokens
   delegators: string[] // array of delegators
}