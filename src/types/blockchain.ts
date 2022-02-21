export type Wallet = {
    accountId: string;
    code: string;
    name: string;
    url: string;
    img?: string;
}

export type TransactionAction = {
    methodName: string;
    args: any;
    gas: number;
    deposit: number;
}