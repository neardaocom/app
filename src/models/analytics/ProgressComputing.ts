import Decimal from "decimal.js"
import { InvalidInputError } from "../utils/errors"

export default class ProgressComputing {
    /**
     * Get amount of linear progress
     * @returns amount
     */
    static getAmountLinear(target: Date, startAt: Date, startAmount: number, endAt: Date, endAmount: number): number | undefined {
        let computed: number | undefined

        if (startAt.valueOf() > endAt.valueOf()) {
            throw new InvalidInputError('StartAt must be lower or equal to EndAt')
        }

        if (startAmount > endAmount) {
            throw new InvalidInputError('StartAmoun must be lower or equal to EndAmount')
        }

        if (target.valueOf() >= startAt.valueOf() && target.valueOf() <= endAt.valueOf()) {
            if (target.valueOf() === startAt.valueOf()) { // start
                computed = startAmount
            } else if (target.valueOf() === endAt.valueOf()) { // end
                computed = endAmount
            } else {
                computed = startAmount + new Decimal(
                    endAmount - startAmount
                ).mul(
                    new Decimal(target.valueOf()).minus(startAt.valueOf())
                ).div(
                    new Decimal(endAt.valueOf()).minus(startAt.valueOf())
                ).round().toNumber()
            }
        }

        return computed
    }

    /**
     * Get amount of none progress
     * @returns amount
     */
    static getAmountNone(target: Date, startAt: Date, startAmount: number, endAt: Date): number | undefined {
        let computed: number | undefined

        if (startAt.valueOf() > endAt.valueOf()) {
            throw new InvalidInputError('StartAt must be lower or equal to EndAt')
        }

        if (target.valueOf() >= startAt.valueOf() && target.valueOf() <= endAt.valueOf()) {
            computed = startAmount
        }

        return computed
    }
}