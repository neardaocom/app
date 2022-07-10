import Decimal from 'decimal.js'
import moment from "moment"
import loMin from "lodash/min"

export default class DateHelper {

    static formatTime: string = 'H:mm'

    static formatDate: string = 'YYYY-MM-DD'
    static formatDateLong: string = 'MMMM D, YYYY'

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

    static createDurationInSeconds(from: Date, to: Date): number {
        return new Decimal(moment(to).diff(from).valueOf()).div(1_000).round().toNumber()
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

    static format(date: Date | number, format: string): string {
        if (typeof date == 'number') {
            date = new Date(date)
        }
        return moment(date).format(format);
    }

    static getProgress(start: Date, finish: Date, now?: Date): number | undefined {
        let progress: number | undefined;
        
        const begin: number = loMin([start.valueOf(), new Date().valueOf()]) ?? start.valueOf()
        const end: number = finish.valueOf();
        const target: number = (now) ? now.valueOf() : new Date().valueOf();
        
        const targetFromBegin: number = target - begin;
        const endFromBegin: number = end - begin;
        // console.log('Progress values: ', begin, target, end);
        if (target <= begin) {
            progress = 0
        } else if (target >= end) {
            progress = 100
        } else {
          progress = new Decimal(targetFromBegin).div(endFromBegin).times(10_000).round().div(100).toNumber()
        }
        
        return progress
    }

}