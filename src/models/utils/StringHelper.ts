import sanitizeHtml from "sanitize-html";
import loToLower from "lodash/toLower"
import loDeburr from "lodash/deburr"
import loUniq from "lodash/uniq"
import loWords from "lodash/words"
import loToString from "lodash/toString"

export default class StringHelper {

    static toSearch(text: string): string {
        return loToLower(loDeburr(loUniq(loWords(sanitizeHtml(loToString(text)))).join('-')));
    }

    static sanitize(text: string): string {
        return sanitizeHtml(text);
    }

    static getWords(text: string): string[] {
        return loUniq(loWords(sanitizeHtml(text))) || [];
    }
}