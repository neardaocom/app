import _ from "lodash"
import sanitizeHtml from 'sanitize-html';

export const toSearch = (string) => {
    return _.toLower(_.deburr(_.uniq(_.words(_.toString(string))).join('-')))
};

export const sanitize = (string) => {
    return sanitizeHtml(string)
};

export const getWords = (string) => {
    return _.uniq(_.words(sanitizeHtml(string))) || []
};