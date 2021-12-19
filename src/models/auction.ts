import { Sale } from "@/services/skywardFinanceService/types"
import { UnsupportedError } from "@/utils/error"
import Decimal from "decimal.js"
import { parseNanoseconds } from "@/utils/date"
import { parseNumber } from "@/utils/number"

const getProgress = (start: Date, finish: Date): number | undefined => {
    let progress: number | undefined;
    
    const begin = start.valueOf()
    const end = finish.valueOf();
    const now = new Date().valueOf();
    
    const nowFromBegin = now - begin;
    const endFromBegin = end - begin;
    // console.log('Progress values: ', begin, now, end);
    if (endFromBegin >= 0) {
      progress = new Decimal(nowFromBegin).div(endFromBegin).times(10_000).round().div(100).toNumber()
    }
    
    return progress
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
                        referral_bpt: new Decimal(token.referral_bpt).toNumber(),
                    }
                }),
                in_token: {
                    account_id: sale.in_token_account_id,
                    remaining: sale.in_token_remaining,
                    paid_unclaimed: sale.in_token_paid_unclaimed,
                    paid: sale.in_token_paid,
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

export { transform, getProgress }