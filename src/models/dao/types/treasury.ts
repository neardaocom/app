import { DaoAsset } from "./asset";

export enum TreasuryAssetUnlockingType {
    Linear = 'linear',
    None = 'none',
}

export type TreasuryLock = {
    id: number;
    name: string;
    nextUnlock: Date|null;
    createdBy: string|null;
    assets: TreasuryLockAsset[];
}

export type TreasuryLockAsset = {
    asset: DaoAsset;
    startFrom: Date;
    totalLocked: number;
    totalUnlocked: number;
    unlocked: number;
    unlocking: TreasuryAssetUnlocking[];
}



export type TreasuryAssetUnlocking = {
    targetDate: Date;
    type: TreasuryAssetUnlockingType;
    amount: number;
}

export type TreasuryTotalAsset = {
    asset: DaoAsset;
    amount: number; // amount owned by DAO
    amountLockedInLocks: number;
}
