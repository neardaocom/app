export type Sale = {
    id: number;
    token_account_ids: string[];
    amounts: number[];
    title: string;
    url: string;
    fee: number;
    total_shares: number;
    shares: number;
}