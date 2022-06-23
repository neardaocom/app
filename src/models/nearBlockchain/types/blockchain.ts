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
    tGas: number;
    nearDeposit: number;
}