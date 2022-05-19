export type ListItemDto = {
    id: string;
    index: number;
    name: string;
    description: string;
    location: string;
    ftName: string | undefined;
    ftAmount: string | undefined;
    tags: string[];
    search: string;
    treasuryAmount?: number | string;
    treasuryAmountUsd?: number | string;
}