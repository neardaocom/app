export type TreasuryLockCategory = 'salary' | 'event' | 'activity'

export type TreasuryLock = {
    id: number;
    category?:  TreasuryLockCategory; // deprecated
    name: string;
    nextUnlock: Date;
    createdBy: string|null;
    assets: TreasuryLockAsset[];
}

export type TreasuryLockAsset = {
    asset: TreasuryAsset;
    totalLocked: number;
    totalUnlocked: number;
    unlocked: number;
    locked: number;
    unlocking: TreasuryAssetUnlocking[];
}

export type TreasuryAsset = {
    type: string; // near, ft, nft
    accountId: string;
    name: string;
    symbol: string;
    icon: string|null;
    decimals: number;
    priceInUSD?: number;
}

export type TreasuryAssetUnlocking = {
    targetDate: Date;
    amount: number;
}

export type TreasuryTotalLocked = {
    assetAccountId: string;
    assetSymbol: string;
    assetIcon: string|null;
    amountLocked: number;
    amountUnlocked: number;
}
