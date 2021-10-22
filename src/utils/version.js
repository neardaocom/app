import _ from 'lodash';

export const isValid = (version) => {
    return _.isArray(version) && version.length == 2 && _.isInteger(version[0]) && _.isInteger(version[1])
}

export const parse = (version) => {
    const parsed = _.split(_.trim(version), '.').map(item => _.parseInt(item))
    if (isValid(parsed)) {
        return parsed
    }
    return undefined
}

export const toString = (version) => {
    if (isValid(version)) {
        return version[0] + '.' + version[1]
    }
    return undefined
}

export const minorUp = (version) => {
    let parsed = parse(version)
    if (parsed !== undefined) {
        parsed[1] = parsed[1] + 1
        return toString(parsed)
    }
    return undefined
}

export const majorUp = (version) => {
    let parsed = parse(version)
    if (parsed !== undefined) {
        parsed[0] = parsed[0] + 1
        parsed[1] = 0
        return toString(parsed)
    }
    return undefined
}

export const toCompare = (version) => {
    const parsed = parse(version)
    if (parsed !== undefined) {
        // console.log(version, parsed[0], parsed[1])
        return (parsed[0] * 1000) + parsed[1]
    }
    return undefined
}