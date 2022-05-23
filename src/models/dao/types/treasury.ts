export type TreasuryLockCategory = 'salary' | 'event' | 'activity'

export type TreasuryLock = {
    id: number;
    category?:  TreasuryLockCategory; // deprecated
    name: string;
    nextUnlock: Date|null;
    createdBy: string|null;
    assets: TreasuryLockAsset[];
}

export type TreasuryLockAsset = {
    asset: TreasuryAsset;
    totalLocked: number;
    totalUnlocked: number;
    unlocked: number;
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

export type TreasuryTotalAsset = {
    asset: TreasuryAsset;
    amount: number; // amount owned by DAO
    amountLockedInLocks: number;
}
