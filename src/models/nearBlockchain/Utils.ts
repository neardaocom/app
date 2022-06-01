import Decimal from "decimal.js"
import loSet from "lodash/set"
import loLast from "lodash/last"
import loSplit from "lodash/split"
import loToString from "lodash/toString"
import moment from "moment"
import { Interval } from "../utils/types/generics";
import ObjectHelper from "../utils/ObjectHelper";

export default class Utils {

    static yoctoNear: string = '1000000000000000000000000'; // 10^24 yocto
    
    static oneYoctoNear: string = '0.000000000000000000000001'; // 10^24 yocto

    static tGas: string = '1000000000000'; // 10^12

    static dateIninity: number = 9007199254740991

    static gasDefault(): number {
        return 100;
    }

    static depositDefault(): number {
        return 0
    }

    static getAccountIdPostfix(accountId: string): string | undefined {
        return loLast(loSplit(loToString(accountId), '.'));
    }

    static nearToYocto(amount: number | string): string {
        return new Decimal(amount).mul(this.yoctoNear).toFixed();
    }

    static yoctoToNear(amount: string): number {
        return new Decimal(amount).div(this.yoctoNear).toNumber();
    }

    /**
     * 1.5 => 1.5 * 10^24 => 1500000000000000000000000
     * 
     * @returns string
     */
    static amountToDecimals(amount: string, decimals: number): string {
        return new Decimal(amount).mul(Decimal.pow(10, decimals)).toFixed(0);
    }

    /**
     * 1500000000000000000000000 => 1500000000000000000000000 / 10^24 => 1.5
     * 
     * @returns string
     */
    static amountFromDecimals(amount: string, decimals: number): string {
        return new Decimal(amount).div(Decimal.pow(10, decimals)).toFixed();
    }

    static toTGas(amount: number): string {
        return Decimal.mul(amount, this.tGas).toFixed();
    }

    static dateFromChain(value: number): Date {
        return moment(new Decimal(value).mul(1_000).toNumber()).toDate();
    }

    static dateToChain(value: Date): number {
        return new Decimal(moment(value).valueOf()).div(1_000).round().toNumber();
    }

    static durationFromChain(value: number): Interval {
        const duration = moment.duration(value, 'seconds')
        return {
            seconds: duration.seconds(),
            minutes: duration.minutes(),
            hours: duration.hours(),
            days: duration.days(),
            weeks: duration.weeks(),
            months: duration.months(),
            years: duration.years(),
        };
        const interval: Interval = {}
        let amount: number = value
        let amountMod: number = 0
        // days
        amountMod = new Decimal(amount).mod(86_400).toNumber()
        interval.days = new Decimal(amount - amountMod).div(86_400).toNumber()
        amount = amountMod
        // hours
        amountMod = new Decimal(amount).mod(3_600).toNumber()
        interval.hours = new Decimal(amount - amountMod).div(3_600).toNumber()
        amount = amountMod
        // minutes
        amountMod = new Decimal(amount).mod(60).toNumber()
        interval.minutes = new Decimal(amount - amountMod).div(60).toNumber()
        amount = amountMod

        return interval
    }

    static durationToChain(duration: Interval): number {
        return moment.duration(duration).asSeconds()
        return ((duration.days ?? 0) * 86_400) + ((duration.hours ?? 0) * 3_600) + ((duration.minutes ?? 0) * 60);
    }

    /**
     * DEPRECATED: Compute public sale percent
     * 
     * @returns number
     */
    static getPublicSalePercent(council: number, community: number, investor: number): number {
        return 100 - (council ?? 0) - (community ?? 0) - (investor ?? 0)
    }

    /**
     * static [ [ 'id', { u64: 2 } ] ] => {'id': 2}
     */
    static parseObjectFromArray(data: [string, object][]): Record<string, unknown> {
        const parsed = {}
        data.forEach((item) => loSet(parsed, [item[0]], ObjectHelper.first(item[1])))
        return parsed
    }
}