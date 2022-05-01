import loJoin from 'lodash/join'

export default class LocaleHelper {

    static stringNumberToLocale(value: string, locale: string): string {
        const dotPosition = value.search(/\./)
        const intLength = dotPosition !== -1 ? dotPosition : value.length
        const breaksNum = (intLength % 3 === 0 ) ? Math.floor(intLength/3) - 1 : Math.floor(intLength/3);
        let intSubstr = value.substring(0, intLength)
        let decSubstr = value.substring(intLength + 1)
        const arr: string[] = []

        for (let i = 0; i <= breaksNum ; i++){
            const lastThreeDigits = intSubstr.substring(intLength - ((i+1) * 3), intLength - ((i) * 3))
            arr.unshift( lastThreeDigits )
            intSubstr = intSubstr.substring(0, intLength - ((i+1) * 3))
        }

        if( locale === 'en'){
            decSubstr = decSubstr.length > 0 ? "." + decSubstr : ''
            return loJoin(arr, ',') + decSubstr;
        }else if(locale ==='cs'){
            decSubstr = decSubstr.length > 0 ? "," + decSubstr : ''
            return loJoin(arr, ' ') + decSubstr;
        }
        return ''
    }
}