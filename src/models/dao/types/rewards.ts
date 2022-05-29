import { DaoAsset } from "./asset";
import { DAOGroup } from "./dao";
import { TreasuryLock } from "./treasury";

export type RewardType = 'salary' | 'activity' | 'event'

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
    type: RewardType;
    targetGroup?: RewardTargetGroup;
    amounts: RewardPricelistAmount[]
    unitSeconds: number;
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