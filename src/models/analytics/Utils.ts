import moment from "moment"
import DateHelper from "../utils/DateHelper"
import { UnsupportedError } from "../utils/errors"
import { Algorithm, Chart, Period, ProgressItem } from "./types"

export default class Utils {

    static getInterval = (algorithm: Algorithm): number => {
        let interval: number = 1_000
        switch (algorithm) {
            case Algorithm.None:
                interval = 10_000
                break;
            case Algorithm.Linear:
                interval = 2_000
                break;
            default:
                throw new UnsupportedError(`Algoritm: ${algorithm} is not supported`)
        }

        return interval
    }

    static getPeriodFromDuration = (durationInSeconds: number): Period => {
        let period: Period = Period.Day

        const monthInSeconds: number = 60*60*24*30 // one month
    
        if (durationInSeconds > monthInSeconds * 36) {
            period = Period.Year
        } else if (durationInSeconds > monthInSeconds * 12) {
            period = Period.Quarter
        } else if (durationInSeconds > monthInSeconds * 3) {
            period = Period.Month
        } else if (durationInSeconds > monthInSeconds) {
            period = Period.Week
        }
    
        return period
    }

    static getPeriodStep = (date: Date, period: Period): Date => {
        let step = moment(date).add(1, 'd').toDate()
        switch (period) {
            case Period.Day:
                step = moment(date).add(1, 'd').toDate()
                break;
            case Period.Week:
                step = moment(date).add(1, 'w').toDate()
                break;
            case Period.Month:
                step = moment(date).add(1, 'M').toDate()
                break;
            case Period.Quarter:
                step = moment(date).add(1, 'Q').toDate()
                break;
            case Period.Year:
                step = moment(date).add(1, 'y').toDate()
                break;
            default:
                throw new UnsupportedError(`Period: ${period} unsupported`)
        }

        return step
    }

    static getCashflowChart = (cashflow: ProgressItem[], t: Function, d: Function): Chart => {
        const labels = cashflow.map(obj => d(obj.date))
        const data = cashflow.map(obj => obj.value)
        const now = DateHelper.nowDate()
        const backgroundColors = cashflow.map(obj => {
            return (obj.date <= now) ? "#6B6EF9" : "rgba(219, 85, 85, 1.0)"
        })

        return {
            labels,
            datasets: [
                {
                    backgroundColor: backgroundColors,
                    data,
                    label: t('amount'),
                }
            ],
        }
    }
}