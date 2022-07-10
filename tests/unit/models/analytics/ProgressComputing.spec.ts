import ProgressComputing from '@/models/analytics/ProgressComputing'
import DateHelper from '@/models/utils/DateHelper'
import moment from 'moment'

test('getAmountLinear', () => {
    let target: Date
    const startAt: Date = moment().toDate()
    const endAt: Date = moment().add(4, 'hours').toDate()

    // start
    target = moment().toDate()
    expect(ProgressComputing.getAmountLinear(target, startAt, 0, endAt, 1000)).toBe(0);
    expect(ProgressComputing.getAmountLinear(target, startAt, 500, endAt, 1000)).toBe(500);
    expect(ProgressComputing.getAmountLinear(target, startAt, 1000, endAt, 1000)).toBe(1000);
    
    // querter
    target = moment().add(1, 'hours').toDate()
    expect(ProgressComputing.getAmountLinear(target, startAt, 0, endAt, 1000)).toBe(250);
    expect(ProgressComputing.getAmountLinear(target, startAt, 500, endAt, 1000)).toBe(625);
    expect(ProgressComputing.getAmountLinear(target, startAt, 1000, endAt, 1000)).toBe(1000);

    // half
    target = moment().add(2, 'hours').toDate()
    expect(ProgressComputing.getAmountLinear(target, startAt, 0, endAt, 1000)).toBe(500);
    expect(ProgressComputing.getAmountLinear(target, startAt, 500, endAt, 1000)).toBe(750);
    expect(ProgressComputing.getAmountLinear(target, startAt, 1000, endAt, 1000)).toBe(1000);
    
    // end
    target = moment().add(4, 'hours').toDate()
    expect(ProgressComputing.getAmountLinear(target, startAt, 0, endAt, 1000)).toBe(1000);
    expect(ProgressComputing.getAmountLinear(target, startAt, 500, endAt, 1000)).toBe(1000);
    expect(ProgressComputing.getAmountLinear(target, startAt, 1000, endAt, 1000)).toBe(1000);
});