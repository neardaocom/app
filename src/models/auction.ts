import { Sale } from "@/services/skywardFinanceService/types"
import { UnsupportedError } from "@/models/utils/errors"
import Decimal from "decimal.js"
import DateHelper from "@/models/utils/DateHelper"
import NumberHelper from "@/models/utils/NumberHelper"
import loMin from "lodash/min"
import loStartsWith from "lodash/startsWith"
import loGet from "lodash/get"

const getProgress = (start: Date, finish: Date, now?: Date): number | undefined => {
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

const getTranslateKey = (value: string): string | undefined => {
    let key: string | undefined
    switch (value) {
        case 'RefFinance':
            key = 'token_sale_ref_finance'
            break;
        case 'SkywardFinance':
            key = 'auction_skyward_finance'
            break;
        default:
            break;
    }
    return key
}

/**
 * Transform data form source to object
 * 
 * @param source 
 * @param sale Data
 * @returns Sale
 * 
 */
const transform = (source: string, sale: any): Sale | undefined => {
    let trans: Sale | undefined
    switch (source) {
        case 'skyward.finance':
            trans = {
                id: new Decimal(sale.sale_id).toNumber(),
                title: sale.title,
                url: sale.url,
                owner_id: sale.owner_id,
                out_tokens: sale.out_tokens.map( token => {
                    return {
                        token_account_id: token.token_account_id,
                        remaining: new Decimal(token.remaining).toNumber(),
                        distributed: new Decimal(token.distributed).toNumber(),
                        treasury_unclaimed: (token.treasury_unclaimed) ? new Decimal(token.treasury_unclaimed).toNumber() : null,
                        referral_bpt: (token.referral_bpt) ? new Decimal(token.referral_bpt).toNumber() : null,
                    }
                }),
                in_token: {
                    account_id: sale.in_token_account_id,
                    remaining: new Decimal(sale.in_token_remaining).toNumber(),
                    paid_unclaimed: new Decimal(sale.in_token_paid_unclaimed).toNumber(),
                    paid: new Decimal(sale.in_token_paid).toNumber(),
                },
                total_shares: NumberHelper.parseNumber(sale.total_shares),
                start_time: DateHelper.parseNanoseconds(sale.start_time),
                end_time: DateHelper.parseNanoseconds(new Decimal(sale.start_time).plus(sale.duration).toNumber()),
                duration: NumberHelper.parseNumber(sale.duration),
                remaining_duration: NumberHelper.parseNumber(sale.remaining_duration),
                current_time: DateHelper.parseNanoseconds(sale.current_time),
            }
            break;
        default:
            throw new UnsupportedError(`Source: ${source} not declared`)
    }
    return trans
}

/**
 * Get rate of sale
 * @param sale Sale
 * @returns Decimal | undefined
 */
const rate = (sale: Sale): Decimal | undefined => {
    let rate: Decimal | undefined = undefined
    // console.log(sale.in_token)
    if (sale.in_token.remaining > 0) {
        rate = new Decimal(sale.out_tokens[0].remaining).div(sale.in_token.remaining)
    }
    return rate
}

/**
 * Get rate of token
 * @param sale Sale
 * @returns Decimal | undefined
 */
const rateToken = (sale: Sale): Decimal | undefined => {
    let rate: Decimal | undefined = undefined
    if (sale.in_token.remaining > 0) {
        rate = new Decimal(sale.in_token.remaining).div(sale.out_tokens[0].remaining)
    }
    return rate
}

const getSkywardSaleIds = (storage: Record<string, unknown>): number[] => {
    const saleIds: number[] = []
    Object.keys(storage).forEach((key) => {
        if (loStartsWith(key, 'wf_skyward')) {
            // console.log(loGet(storage, [key, 0, 'U32']))
            saleIds.push(loGet(storage, [key, 0, 'U32']))
        }
    })
    return saleIds
}

export default { transform, getProgress, getTranslateKey, rate, rateToken, getSkywardSaleIds }