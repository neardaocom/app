export type ListItemDto = {
    id: string;
    index: number;
    name: string;
    walletId: string;
    description: string;
    location: string | undefined;
    ftName: string | undefined;
    ftAmount: string | undefined;
    tags: string[];
    search: string;
    treasuryAmount?: number | string;
    treasuryAmountUsd?: number | string;
}