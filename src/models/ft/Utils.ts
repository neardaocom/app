import Decimal from "decimal.js";

export default class Utils {

    static getInitDistributionAmount(tokenAmount: string, sharePercent: number, initPercent: number): string {
        if (sharePercent < 0 || sharePercent > 100) {
            throw new Error("sharePercent not between 0 and 100");
        }
        if (initPercent < 0 || initPercent > 100) {
            throw new Error("initPercent not between 0 and 100");
        }

        return new Decimal(tokenAmount).mul(sharePercent).div(100).mul(initPercent).div(100).toFixed();
    }
}