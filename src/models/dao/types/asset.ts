export enum DaoAssetType {
    Near = 'near',
    FT = 'ft',
    NFT = 'nft',
}

export type DaoAsset = {
    type: DaoAssetType;
    accountId: string;
    name: string;
    symbol: string;
    icon: string|null;
    decimals: number;
    priceInUSD?: number;
}