import Utils from "@/models/nearBlockchain/Utils";
import { Interval } from "@/models/utils/types/generics";

test('Constant: yoctoNear', () => {
    expect(Utils.yoctoNear).toBe('1000000000000000000000000');
})

test('Constant: tGas', () => {
    expect(Utils.tGas).toBe('1000000000000');
})

test('nearToYocto', () => {
    expect(Utils.nearToYocto(0.5)).toBe('500000000000000000000000');
    expect(Utils.nearToYocto(1)).toBe('1000000000000000000000000');
    expect(Utils.nearToYocto(2)).toBe('2000000000000000000000000');
})

test('yoctoToNear', () => {
    expect(Utils.yoctoToNear('500000000000000000000000')).toBe(0.5);
    expect(Utils.yoctoToNear('1000000000000000000000000')).toBe(1);
    expect(Utils.yoctoToNear('2000000000000000000000000')).toBe(2);
})

test('toTGas', () => {
    expect(Utils.toTGas(300)).toBe('300000000000000');
})

test('date from/to', () => {
    const date: Date = new Date()
    expect(Utils.dateFromChain(Utils.dateToChain(date)).toString()).toBe(date.toString());
})

test('dutation from/to', () => {
    const duration: Interval = {days: 0, hours: 10, minutes: 5}
    expect(Utils.durationFromChain(Utils.durationToChain(duration))).toEqual(duration);
})