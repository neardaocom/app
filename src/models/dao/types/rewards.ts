import { DaoAsset } from "./asset";
import { DAOGroup } from "./dao";

export type RewardType = 'salary' | 'activity' | 'event'

export type RewardPricelistAmount = {
    asset: DaoAsset;
    amount: number;
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