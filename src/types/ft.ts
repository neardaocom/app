export type FTMeta = {
    name: string;
    short: string;
    img?: string;
    accountId: string;
    amount?: number;
    decimals?: number;
}

export type FT = {
    meta: FTMeta;
    amount: number;
}