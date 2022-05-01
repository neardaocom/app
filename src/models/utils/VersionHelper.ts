import _ from 'lodash';
import { Version } from "./types/Version";

export default class VersionHelper {
    
    static isValid(version: Version): boolean {
        return _.isInteger(version.major) && _.isInteger(version.minor)
    }
    
    static parse(text: string): Version | undefined {
        const parsed: number[] = _.split(_.trim(text), '.').map(item => _.parseInt(item))
        const version = { major: parsed[0], minor: parsed[1] }
        if (this.isValid(version)) {
            return version
        }
        return undefined
    }
    
    static toString(version: Version) {
        if (this.isValid(version)) {
            return version.major + '.' + version.minor
        }
        return undefined
    }
    
    static minorUp(text: string): string | undefined {
        const version = this.parse(text)
        if (version !== undefined) {
            version.minor = version.minor + 1
            return this.toString(version)
        }
        return undefined
    }
    
    static majorUp(text: string): string | undefined {
        const version = this.parse(text)
        if (version !== undefined) {
            version.major = version.major + 1
            version.minor = 0
            return this.toString(version)
        }
        return undefined
    }
    
    static toCompare(text: string): number {
        const version = this.parse(text)
        if (version !== undefined) {
            // console.log(text, version.major, version.minor)
            return (version.major * 1_000) + version.minor
        }
        return 0
    }
}