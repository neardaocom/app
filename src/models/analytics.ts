import { ParseError, UnsupportedError, InvalidInputError } from "@/utils/error";
import { nowToSeconds, parseSeconds, toSeconds } from '@/utils/date'
import Decimal from "decimal.js";
import moment, { duration } from "moment";
import _ from "lodash"

enum Period {
    Day,
    Week,
    Month,
    Quarter,
    Year
}

enum Algorithm {
    None, Linear
}

/**
 * Parse algoritm from string
 * 
 * @param algorithm String of algoritm
 * @returns Algorithm value
 */
const parseAlgorithm = (algorithm: string): Algorithm => {
    switch (algorithm) {
        case 'None':
            return Algorithm.None
        case 'Linear':
            return Algorithm.Linear
        default:
            throw new ParseError(`Unknown algoritm: ${algorithm}`);
    }
}

/**
 * Get interval for computing next actual value
 * 
 * @param algorithm
 */
const getInterval = (algorithm: Algorithm): Number => {
    switch (algorithm) {
        case Algorithm.None:
            return Number.MAX_SAFE_INTEGER
        case Algorithm.Linear:
            return 1000
        default:
            throw new UnsupportedError(`Algoritm: ${algorithm} is not supported`)
    }
}

/**
 * Get amount of unlocing tokens for target time
 *
 * @param algorithm Target algoritm
 * @param target time in seconds
 * @param settings algoritm settings
 * @returns amount of unlocking tokens for target time
 */
const computeUnlocking = (algorithm: Algorithm, target: number, settings: any): number | undefined => {
    let computed = undefined
    switch (algorithm) {
        case Algorithm.Linear:
            // check
            if (typeof settings.release_end !== "number") throw new InvalidInputError(`release_end not found`)
            if (typeof settings.duration !== "number") throw new InvalidInputError(`duration not found`)
            if (typeof settings.total !== "number") throw new InvalidInputError(`total not found`)
            if (typeof settings.init !== "number") throw new InvalidInputError(`init not found`)
            // console.log(target, settings)
            // before
            if (target <= (settings.release_end - settings.duration)) {
                computed = settings.init
            } else if (target >= settings.release_end) { // after
                computed = settings.total
            } else {
                computed = settings.init + new Decimal(1).minus(new Decimal(settings.release_end).minus(target).div(settings.duration)).mul(settings.total - settings.init).round().toNumber()
            }
            break
        case Algorithm.None:
            computed = settings.total
            break
        default:
            throw new UnsupportedError(`Algorithm: ${algorithm} not supported`)
    }
    return computed
}

type Cashflow = {
    date: Date;
    value: number | undefined;
}

const getPeriodStep = (date: Date, period: Period): Date => {
    switch (period) {
        case Period.Day:
            return moment(date).add(1, 'd').toDate()
        case Period.Week:
            return moment(date).add(1, 'w').toDate()
        case Period.Month:
            return moment(date).add(1, 'M').toDate()
        case Period.Quarter:
            return moment(date).add(1, 'Q').toDate()
        case Period.Year:
            return moment(date).add(1, 'y').toDate()
        default:
            throw new UnsupportedError(`Period: ${period} unsupported`)
    }
}

const computeUnlockingCashflow = (algorithm: Algorithm, settings: any, period: Period, begin: Date): Cashflow[] => {
    let list: Cashflow[] = []
    let computed: number | undefined = 0
    let increment: Date = _.clone(begin)
    const limit: Date = parseSeconds(settings.release_end)
    let check_loop: number = 0
    while (increment < limit && check_loop < 10000) {
        computed = computeUnlocking(algorithm, toSeconds(increment), settings)
        list.push({date: _.clone(increment), value: computed})
        increment = getPeriodStep(increment, period)
        check_loop += 1
    }
    // add last
    computed = computeUnlocking(algorithm, toSeconds(increment), settings)
    list.push({date: _.clone(increment), value: computed})
    return list
}

export default {
    Period, Algorithm, parseAlgorithm, getInterval, computeUnlocking,
    computeUnlockingCashflow, getPeriodStep
}