import TransformerInterface from "@/models/interfaces/Transformer.interface";
import { UnsupportedError } from "../utils/errors";
import NumberHelper from "../utils/NumberHelper";
import { Auction, Source } from "./types";
import NearUtils from '../nearBlockchain/Utils'
import Decimal from "decimal.js";

export default class SaleTransformer implements TransformerInterface {

    protected source: Source;

    constructor(source: Source) {
        this.source = source
    }

    transform(value: any): Auction {
        let auction: Auction
        switch (this.source) {
            case 'skyward.finance':
                auction = {
                    id: NumberHelper.parseNumber(value.sale_id),
                    source: this.source,
                    title: value.title,
                    url: value.url,
                    owner_id: value.owner_id,
                    out_tokens: value.out_tokens.map((token) => {
                        return {
                            token_account_id: token.token_account_id,
                            remaining: NumberHelper.parseNumber(NearUtils.amountFromDecimals(token.remaining, 24)),
                            distributed: NumberHelper.parseNumber(NearUtils.amountFromDecimals(token.distributed, 24)),
                            treasury_unclaimed: (token.treasury_unclaimed) ? NumberHelper.parseNumber(NearUtils.amountFromDecimals(token.treasury_unclaimed, 24)) : null,
                            referral_bpt: (token.referral_bpt) ? NumberHelper.parseNumber(NearUtils.amountFromDecimals(token.referral_bpt, 24)) : null,
                        }
                    }),
                    in_token: {
                        account_id: value.in_token_account_id,
                        remaining: NumberHelper.parseNumber(NearUtils.amountFromDecimals(value.in_token_remaining, 24)),
                        paid_unclaimed: NumberHelper.parseNumber(NearUtils.amountFromDecimals(value.in_token_paid_unclaimed, 24)),
                        paid: NumberHelper.parseNumber(NearUtils.amountFromDecimals(value.in_token_paid, 24)),
                    },
                    total_shares: NumberHelper.parseNumber(value.total_shares),
                    start_time: NearUtils.dateFromChainInNanoseconds(value.start_time),
                    end_time: NearUtils.dateFromChainInNanoseconds(new Decimal(value.start_time).plus(value.duration).toString()),
                    duration: NumberHelper.parseNumber(value.duration),
                    remaining_duration: NumberHelper.parseNumber(value.remaining_duration),
                    current_time: NearUtils.dateFromChainInNanoseconds(value.current_time),
                }
                break;
            default:
                throw new UnsupportedError(`Source: ${this.source} not declared`)
        }
        return auction
    }
}