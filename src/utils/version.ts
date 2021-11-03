import _ from 'lodash';

export type Version = {
    major: number;
    minor: number;
};

export const isValid = (version: Version): boolean => {
    return _.isInteger(version.major) && _.isInteger(version.minor)
}

export const parse = (text: string): Version | undefined => {
    const parsed: number[] = _.split(_.trim(text), '.').map(item => _.parseInt(item))
    const version = { major: parsed[0], minor: parsed[1] }
    if (isValid(version)) {
        return version
    }
    return undefined
}

export const toString = (version: Version) => {
    if (isValid(version)) {
        return version.major + '.' + version.minor
    }
    return undefined
}

export const minorUp = (text: string): string | undefined => {
    const version = parse(text)
    if (version !== undefined) {
        version.minor = version.minor + 1
        return toString(version)
    }
    return undefined
}

export const majorUp = (text: string): string | undefined => {
    const version = parse(text)
    if (version !== undefined) {
        version.major = version.major + 1
        version.minor = 0
        return toString(version)
    }
    return undefined
}

export const toCompare = (text: string): number => {
    const version = parse(text)
    if (version !== undefined) {
        // console.log(text, version.major, version.minor)
        return (version.major * 1000) + version.minor
    }
    return 0
}