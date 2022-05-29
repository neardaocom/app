export type DaoAsset = {
    type: string; // near, ft, nft
    accountId: string;
    name: string;
    symbol: string;
    icon: string|null;
    decimals: number;
    priceInUSD?: number;
}