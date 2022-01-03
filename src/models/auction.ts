import { Sale } from "@/services/skywardFinanceService/types"
import { UnsupportedError } from "@/utils/error"
import Decimal from "decimal.js"
import { parseNanoseconds } from "@/utils/date"
import { parseNumber } from "@/utils/number"

const getProgress = (start: Date, finish: Date, now?: Date): number | undefined => {
    let progress: number | undefined;
    
    const begin: number = start.valueOf()
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
                total_shares: parseNumber(sale.total_shares),
                start_time: parseNanoseconds(sale.start_time),
                end_time: parseNanoseconds(new Decimal(sale.start_time).plus(sale.duration).toNumber()),
                duration: parseNumber(sale.duration),
                remaining_duration: parseNumber(sale.remaining_duration),
                current_time: parseNanoseconds(sale.current_time),
            }
            break;
        default:
            throw new UnsupportedError(`Source: ${source} not declared`)
    }
    return trans
}

export default { transform, getProgress, getTranslateKey }