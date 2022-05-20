export type TreasuryLockCategory = 'salary' | 'event' | 'activity'

export type TreasuryLock = {
    id: number;
    category: string; // TreasuryLockCategory;
    name: string;
    nextUnlock: Date;
    createdBy: string|null;
    assets: TreasuryLockAsset[];
}


export type TreasuryLockAsset = {
    asset: TreasuryAsset;
    totalLocked: number;
    unlocked: number;
    locked: number;
    unlocking: TreasuryAssetUnlocking[];
}

export type TreasuryAsset = {
    type: string; // near, ft, nft
    accountId: string;
    name: string;
    short: string;
    icon: string|null;
    priceInUSD?: number;
}

export type TreasuryAssetUnlocking = {
    targetDate: Date;
    amount: number;
}

export type TreasuryTotalLocked = {
    assetAccountId: string;
    assetShort: string;
    assetIcon: string|null;
    amountLocked: number;
    amountUnlocked: number;
}