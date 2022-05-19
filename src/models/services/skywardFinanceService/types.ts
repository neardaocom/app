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
    url: string;
    owner_id: string;
    out_tokens: Array<TokenOut>;
    in_token: TokenIn;
    total_shares: number;
    start_time: Date;
    end_time: Date;
    duration: number,
    remaining_duration: number;
    current_time: Date,
};

export const testDataset = [
    {
        id: 0,
        title: 'NearDAO: First token sale of 1%',
        url: null,
        owner_id: 'neardao.testnet',
        out_tokens: [
          {
              account_id: 'genesis.dev5.neardao.testnet',
              remaining: 156_486,
              distributed: 1_000_000,
              treasury_unclaimed: 0,
              referral_bpt: 500,
            },
        ],
        in_token: {
            account_id: 'wrap.testnet',
            remaining: 300_000,
            paid_unclaimed: 195_548,
            paid: 200_000,
        },
        total_shares: 60_161_928_595_668_652_013_949_611,
        start_time: new Date().setHours(new Date().getHours() - 1),
        end_time: new Date().setHours(new Date().getHours() + 1),
        duration: 14_400_000_000_000,
        remaining_duration: 1_000_000,
        current_time: Date.now(),
    },
]