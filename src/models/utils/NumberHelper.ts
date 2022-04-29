import Decimal from "decimal.js"

export default class NumberHelper {

    static parseNumber(value: string): number {
        return new Decimal(value).toNumber();
    }

    static getRandom(min: number, max: number): number {
        return Math.random() * (max - min) + min;
    }
}