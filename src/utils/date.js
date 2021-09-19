import Decimal from 'decimal.js';
// typescript
//export const toNanoseconds = (day: number, hour: number, minute: number, second: number): number => {
//    return (((day ?? 0) * 86400) + ((hour ?? 0) * 3600) + ((minute ?? 0) * 60) + (second ?? 0)) * Math.pow(10,9);
//};

export const toNanoseconds = (day, hour, minute, second) => {
    return (((day ?? 0) * 86400) + ((hour ?? 0) * 3600) + ((minute ?? 0) * 60) + (second ?? 0)) * Math.pow(10,9);
}

export const parseFromNanoseconds = (nanoseconds) => {
    return new Date(new Decimal(nanoseconds).div(1000000).round().toNumber());
}

export const toDateString = (date) => {
    return date.getDate() + '.' + (date.getMonth() + 1) + '.' + date.getFullYear();
}

export const toTimeString = (date) => {
    return date.getHours() + ':' + date.toISOString().substring(14,16);
}