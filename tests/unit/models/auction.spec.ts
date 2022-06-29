import Helper from '@/models/auction/Helper'
import moment from 'moment'

test('Progress', () => {
    const start = moment().startOf('day').subtract(1, 'd').toDate()
    const finish = moment().startOf('day').add(1, 'd').startOf('day').toDate()
    const target = moment().startOf('day')

    target.subtract(1, 'd').subtract(1, 'm')
    expect(Helper.getProgress(start, finish, target.toDate())).toBe(0);
    target.add(1, 'm')
    expect(Helper.getProgress(start, finish, target.toDate())).toBe(0);
    target.add(12, 'h')
    expect(Helper.getProgress(start, finish, target.toDate())).toBe(25);
    target.add(12, 'h')
    expect(Helper.getProgress(start, finish, target.toDate())).toBe(50);
    target.add(12, 'h')
    expect(Helper.getProgress(start, finish, target.toDate())).toBe(75);
    target.add(12, 'h')
    expect(Helper.getProgress(start, finish, target.toDate())).toBe(100);
    target.add(1, 'm')
    expect(Helper.getProgress(start, finish, target.toDate())).toBe(100);
});