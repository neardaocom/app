import Decimal from 'decimal.js';

export const toNanoseconds = (day: number, hour: number, minute: number, second: number): number => {
    return (((day ?? 0) * 86400) + ((hour ?? 0) * 3600) + ((minute ?? 0) * 60) + (second ?? 0)) * Math.pow(10,9);
}

export const toNanosecond = (date: Date): number => {
    return date.valueOf() * Math.pow(10, 6);
}

export const toSeconds = (date: Date): number => {
    return new Decimal(date.valueOf()).div(1000).round().toNumber()
}

export const nowToSeconds = (): number => {
    return new Decimal(new Date().valueOf()).div(1000).round().toNumber()
}

export const nowDate = (): Date => {
    const now: Date = new Date()
    return new Date(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate()))
}

export const parseNanoseconds = (nanoseconds: number): Date => {
    return new Date(new Decimal(nanoseconds).div(1_000_000).round().toNumber());
}

export const parseSeconds = (seconds: number): Date => {
    return new Date(new Decimal(seconds).mul(1000).toNumber());
}

export const toDateString = (date: Date): string => {
    return date.getDate() + '.' + (date.getMonth() + 1) + '.' + date.getFullYear();
}

export const toTimeString = (date: Date): string => {
    if (typeof date == 'number') {
        date = new Date(date)
    }
    return date.getHours() + ':' + date.toISOString().substring(14,16);
}

