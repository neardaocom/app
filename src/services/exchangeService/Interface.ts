export interface ExchangeInterface {
    getActualPrice(id: string): Promise<number | null>;
}