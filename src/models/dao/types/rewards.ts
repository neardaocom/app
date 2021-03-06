import { DaoAsset } from "./asset";
import { DAOGroup } from "./dao";
import { TreasuryLock } from "./treasury";

export enum RewardType {
    Salary = 'salary',
    Activity = 'activity',
    Event = 'event',
}

export type RewardPricelistAmount = {
    asset: DaoAsset;
    amount: number;
}

export type RewardAmount = {
    asset: DaoAsset;
    lastWithdraw: Date;
    amount: number | null;
    amountDelta: number | null;
    amountCounting: number | null;
}

export type RewardTargetGroup = DAOGroup

export type RewardPricelist = {
    id: number;
    name?: string;
    type: RewardType;
    targetGroup?: RewardTargetGroup;
    targetActivities?: number[];
    amounts: RewardPricelistAmount[]
    unitSeconds?: number;
    startAt: Date;
    endAt: Date | null;
}

export type Reward = {
    id: number; // rewardId
    pricelistId: number;
    pricelist?: RewardPricelist;
    lockId?: number;
    lock?: TreasuryLock;
    amounts: RewardAmount[];
}

export type RewardAssetStats = {
    asset: DaoAsset
    pricelistIds: number[];
    amount: number;
    amountCounting: number;
}