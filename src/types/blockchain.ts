export type Wallet = {
    accountId: string;
    code: string;
    name: string;
    url: string;
    img?: string;
}

export type Action = {
    methodName: string;
    args: Record<string, unknown>;
    gas: number;
    deposit: number;
}