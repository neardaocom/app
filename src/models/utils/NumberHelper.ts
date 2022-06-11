import Decimal from "decimal.js"

export default class NumberHelper {

    static parseNumber(value: string): number {
        return new Decimal(value).toNumber();
    }

    static getRandom(min: number, max: number): number {
        return Math.random() * (max - min) + min;
    }

    static division(numerator: number, denumerator: number): number {
        return new Decimal(numerator).div(denumerator).toNumber();
    }

    static toPercentDivision(numerator: number, denumerator: number, decimals: number = 2): string {
        return this.toPercent(this.division(numerator, denumerator), decimals);
    }

    static toPercent(value: number, decimals: number = 2): string {
        return new Decimal(value).mul(100).toFixed(decimals);
    }

    static numFormatter(value: number, digits: number): string {
        if(value >= 999.9 && value < 999999){
            return (value/1000).toFixed(digits) + 'k';
        }else if(value >= 999999){
            return (value/1000000).toFixed(digits) + 'M';
        }else{
            return value.toFixed(digits);
        }
    }
}