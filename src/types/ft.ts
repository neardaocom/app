export type FTMeta = {
    name: string;
    symbol: string;
    icon?: string;
    accountId: string;
    amount?: number;
    decimals?: number;
}

export type FT = {
    meta: FTMeta;
    amount: number;
}