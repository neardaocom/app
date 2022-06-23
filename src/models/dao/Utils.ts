import Decimal from "decimal.js";
import { DAO } from "./types/dao";
import loFind from 'lodash/find'
import { WFTemplate } from "./types/workflow";
import { NotFoundError } from "../utils/errors";

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

    static getLockDistributionAmount(tokenAmount: string, sharePercent: number, initPercent: number): string {
        if (sharePercent < 0 || sharePercent > 100) {
            throw new Error("sharePercent not between 0 and 100");
        }
        if (initPercent < 0 || initPercent > 100) {
            throw new Error("initPercent not between 0 and 100");
        }

        return new Decimal(tokenAmount).mul(sharePercent).div(100).mul(100 - initPercent).div(100).toFixed();
    }

    static getTemplateByCode(dao: DAO, templateCode: string): WFTemplate {
        const template = loFind(dao.templates, {code: templateCode})
        if (!template) {
            throw new NotFoundError('Template[code:' + templateCode + '] not found')
        }
        return template
    }
}