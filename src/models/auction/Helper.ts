import { Auction } from "./types"
import Decimal from "decimal.js"
import DateHelper from "../utils/DateHelper"

export default class Helper {

    static getProgress = (start: Date, finish: Date, now?: Date): number | undefined => DateHelper.getProgress(start, finish, now)

    static getTranslateKey = (value: string): string | undefined => {
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
     * Get rate of auction
     * @param auction Auction
     * @returns Decimal | undefined
     */
    static rate = (auction: Auction): Decimal | undefined => {
        let rate: Decimal | undefined = undefined
        // console.log(auction.in_token)
        if (auction.in_token.remaining > 0) {
            rate = new Decimal(auction.out_tokens[0].remaining).div(auction.in_token.remaining)
        }
        return rate
    }

    /**
     * Get rate of token
     * @param auction Auction
     * @returns Decimal | undefined
     */
    static rateToken = (auction: Auction): Decimal | undefined => {
        let rate: Decimal | undefined = undefined
        if (auction.in_token.remaining > 0) {
            rate = new Decimal(auction.in_token.remaining).div(auction.out_tokens[0].remaining)
        }
        return rate
    }
}