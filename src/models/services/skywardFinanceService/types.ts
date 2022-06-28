export type TokenIn = {
    account_id: string;
    remaining: number;
    paid_unclaimed: number;
    paid: number;
}

export type TokenOut = {
    account_id: string;
    remaining: number;
    distributed: number;
    treasury_unclaimed: number;
    referral_bpt: number;
}

export type Sale = {
    id: number;
    title: string;
    url: string|null;
    owner_id: string;
    out_tokens: TokenOut[];
    in_token: TokenIn;
    total_shares: number;
    start_time: Date;
    end_time: Date;
    duration: number,
    remaining_duration: number;
    current_time: Date,
}