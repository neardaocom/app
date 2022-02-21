import sanitizeHtml from "sanitize-html";
import _ from "lodash"

export const toSearch = (text: string): string => {
    return _.toLower(_.deburr(_.uniq(_.words(sanitizeHtml(_.toString(text)))).join('-')))
};

export const sanitize = (text: string): string => {
    return sanitizeHtml(text)
};

export const getWords = (text: string): string[] => {
    return _.uniq(_.words(sanitizeHtml(text))) || []
};