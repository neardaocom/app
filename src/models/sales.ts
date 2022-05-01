import { Sale } from "@/services/refFinanceService/types";
import { UnsupportedError } from "@/models/utils/errors";
import NumberHelper from "@/models/utils/NumberHelper";

/**
 * Transform data form source to object
 * 
 * @param source 
 * @param sale Data
 * @returns Sale
 * 
 */
 const transformSale = (source: string, sale: any): Sale | undefined => {
    let trans: Sale | undefined
    switch (source) {
        case 'ref.finance':
            trans = {
                id: sale.id,
                title: 'default.pool',
                url: 'https://app.ref.finance/pool/' + sale.id,
                total_shares: NumberHelper.parseNumber(sale.shares_total_supply),
                shares: sale.shares,
                token_account_ids: sale.token_account_ids,
                amounts: [NumberHelper.parseNumber(sale.amounts[0]), NumberHelper.parseNumber(sale.amounts[1])],
                fee: NumberHelper.parseNumber(sale.total_fee)
            }
            break;
        default:
            throw new UnsupportedError(`Source: ${source} not declared`)
    }
    return trans
}

export { transformSale}