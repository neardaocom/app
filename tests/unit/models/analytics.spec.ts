import Analytics from '@/models/analytics'
import DateHelper from '@/models/utils/DateHelper'
import moment from 'moment'

test('Parsing Algorithm', () => {
    expect(Analytics.parseAlgorithm('None')).toBe(Analytics.Algorithm.None);
    expect(Analytics.parseAlgorithm('Linear')).toBe(Analytics.Algorithm.Linear);
});

test('Get interval', () => {
    expect(Analytics.getInterval(Analytics.Algorithm.None)).toBe(10_000);
    expect(Analytics.getInterval(Analytics.Algorithm.Linear)).toBe(2_000);
});

test('Get Period from duration', () => {
    expect(Analytics.getPeriodFromDuration(60*60*24)).toBe(Analytics.Period.Day);
    expect(Analytics.getPeriodFromDuration(60*60*24*30)).toBe(Analytics.Period.Day);
    expect(Analytics.getPeriodFromDuration(60*60*24*30 + 1)).toBe(Analytics.Period.Week);
    expect(Analytics.getPeriodFromDuration(60*60*24*30*3)).toBe(Analytics.Period.Week);
    expect(Analytics.getPeriodFromDuration(60*60*24*30*3 + 1)).toBe(Analytics.Period.Month);
    expect(Analytics.getPeriodFromDuration(60*60*24*30*12)).toBe(Analytics.Period.Month);
    expect(Analytics.getPeriodFromDuration(60*60*24*30*12 + 1)).toBe(Analytics.Period.Quarter);
    expect(Analytics.getPeriodFromDuration(60*60*24*30*36)).toBe(Analytics.Period.Quarter);
    expect(Analytics.getPeriodFromDuration(60*60*24*30*36 + 1)).toBe(Analytics.Period.Year);
});

test('Compute actual value for "Linear"', () => {
    const duration: number = 60 * 60 * 24 // 1 day
    let target: number = DateHelper.nowToSeconds() // now in seconds

    const release_end = new Date()
    release_end.setDate(release_end.getDate() + 1)

    // start
    expect(Analytics.computeUnlocking(Analytics.Algorithm.Linear, target, {total: 1000, init: 0, duration: duration, release_end: DateHelper.toSeconds(release_end)})).toBe(0);
    expect(Analytics.computeUnlocking(Analytics.Algorithm.Linear, target, {total: 1000, init: 500, duration: duration, release_end: DateHelper.toSeconds(release_end)})).toBe(500);
    expect(Analytics.computeUnlocking(Analytics.Algorithm.Linear, target, {total: 1000, init: 1000, duration: duration, release_end: DateHelper.toSeconds(release_end)})).toBe(1000);
    
    // querter
    target += 60 * 60 * 6
    expect(Analytics.computeUnlocking(Analytics.Algorithm.Linear, target, {total: 1000, init: 0, duration: duration, release_end: DateHelper.toSeconds(release_end)})).toBe(250);
    expect(Analytics.computeUnlocking(Analytics.Algorithm.Linear, target, {total: 1000, init: 500, duration: duration, release_end: DateHelper.toSeconds(release_end)})).toBe(625);
    expect(Analytics.computeUnlocking(Analytics.Algorithm.Linear, target, {total: 1000, init: 1000, duration: duration, release_end: DateHelper.toSeconds(release_end)})).toBe(1000);

    // half
    target += 60 * 60 * 6
    expect(Analytics.computeUnlocking(Analytics.Algorithm.Linear, target, {total: 1000, init: 0, duration: duration, release_end: DateHelper.toSeconds(release_end)})).toBe(500);
    expect(Analytics.computeUnlocking(Analytics.Algorithm.Linear, target, {total: 1000, init: 500, duration: duration, release_end: DateHelper.toSeconds(release_end)})).toBe(750);
    expect(Analytics.computeUnlocking(Analytics.Algorithm.Linear, target, {total: 1000, init: 1000, duration: duration, release_end: DateHelper.toSeconds(release_end)})).toBe(1000);
    
    // end
    target += 60 * 60 * 12
    expect(Analytics.computeUnlocking(Analytics.Algorithm.Linear, target, {total: 1000, init: 0, duration: duration, release_end: DateHelper.toSeconds(release_end)})).toBe(1000);
    expect(Analytics.computeUnlocking(Analytics.Algorithm.Linear, target, {total: 1000, init: 500, duration: duration, release_end: DateHelper.toSeconds(release_end)})).toBe(1000);
    expect(Analytics.computeUnlocking(Analytics.Algorithm.Linear, target, {total: 1000, init: 1000, duration: duration, release_end: DateHelper.toSeconds(release_end)})).toBe(1000);
});

test('Compute actual value for "None"', () => {
    const target: number = DateHelper.nowToSeconds() // now in seconds
    const release_end = new Date()
    expect(Analytics.computeUnlocking(Analytics.Algorithm.None, target, {total: 1000, release_end: DateHelper.toSeconds(release_end)})).toBe(1000);
});

test('Period Step', () => {
    const release_end = new Date()
    release_end.setMilliseconds(0)

    expect(Analytics.getPeriodStep(release_end, Analytics.Period.Day)).toStrictEqual(moment().milliseconds(0).add(1, 'd').toDate())
    expect(Analytics.getPeriodStep(release_end, Analytics.Period.Week)).toStrictEqual(moment().milliseconds(0).add(1, 'w').toDate())
    expect(Analytics.getPeriodStep(release_end, Analytics.Period.Month)).toStrictEqual(moment().milliseconds(0).add(1, 'M').toDate())
    expect(Analytics.getPeriodStep(release_end, Analytics.Period.Quarter)).toStrictEqual(moment().milliseconds(0).add(1, 'Q').toDate())
    expect(Analytics.getPeriodStep(release_end, Analytics.Period.Year)).toStrictEqual(moment().milliseconds(0).add(1, 'y').toDate())
});

test('Unlocking cashflow for "None"', () => {
    const now: Date = DateHelper.nowDate()
    // console.log(now)
    const release_end = new Date()
    release_end.setFullYear(release_end.getFullYear() + 1)

    const analytics = Analytics.computeUnlockingCashflow(Analytics.Algorithm.None, {total: 1000, init: 0, release_end: DateHelper.toSeconds(release_end)}, Analytics.Period.Day, now)

    analytics.forEach((element) => {
        expect(element.value).toBe(1000)
    })
    expect(analytics.length).toBe(366);
});

test('Unlocking cashflow for "Linear"', () => {
    const duration: number = 60 * 60 * 24 * 365// 1 year

    const now: Date = DateHelper.nowDate()
    // console.log(now)
    const release_end = new Date()
    release_end.setFullYear(release_end.getFullYear() + 1)

    const analytics = Analytics.computeUnlockingCashflow(Analytics.Algorithm.Linear, {total: 1000, init: 0, duration: duration, release_end: DateHelper.toSeconds(release_end)}, Analytics.Period.Month, now)

    let last_amount: number | undefined = 0
    analytics.forEach((element) => {
        expect(last_amount).toBeGreaterThanOrEqual(0)
        last_amount = element.value
    })
    expect(analytics.length).toBe(14);
});