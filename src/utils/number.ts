import Decimal from "decimal.js"

export const parseNumber = (value: string): number => new Decimal(value).toNumber();

export const getRandom = (min: number, max: number): number =>
    Math.random() * (max - min) + min;