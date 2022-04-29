import Decimal from 'decimal.js';
import moment from "moment";

export default class DateHelper {

    static parse(value: string, format: string): Date {
        return moment(value, format).toDate()
    }

    static toNanoseconds(day: number, hour: number, minute: number, second: number): number {
        return (((day ?? 0) * 86_400) + ((hour ?? 0) * 3_600) + ((minute ?? 0) * 60) + (second ?? 0)) * Math.pow(10, 9);
    }

    static toNanosecond(date: Date): number {
        return new Decimal(date.valueOf()).mul(Math.pow(10, 6)).toNumber();
    }

    static toSeconds(date: Date): number {
        return new Decimal(date.valueOf()).div(1000).round().toNumber()
    }

    static nowToSeconds(): number {
        return new Decimal(new Date().valueOf()).div(1000).round().toNumber()
    }

    static nowDate(): Date {
        const now: Date = new Date()
        return new Date(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate()))
    }

    static parseNanoseconds(nanoseconds: number | string): Date {
        return new Date(new Decimal(nanoseconds).div(1_000_000).round().toNumber());
    }

    static parseSeconds(seconds: number): Date {
        return new Date(new Decimal(seconds).mul(1000).toNumber());
    }

    static toDateString(date: Date): string {
        return date.getDate() + '.' + (date.getMonth() + 1) + '.' + date.getFullYear();
    }

    static toTimeString(date: Date): string {
        if (typeof date == 'number') {
            date = new Date(date)
        }
        return date.getHours() + ':' + date.toISOString().substring(14, 16);
    }

}