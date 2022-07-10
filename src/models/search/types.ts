export enum OrderItem {
    Asc = "asc",
    Desc = "desc",
}

export type Order = {
    code: string;
    translateKey: string;
    iteratees: string[];
    orders: OrderItem[];
}

