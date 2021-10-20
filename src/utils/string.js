import _ from "lodash"

export const toSearch = (string) => {
    return _.deburr(_.words(string).join(' '))
};