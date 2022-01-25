import set from 'lodash/set'
import get from 'lodash/get'

export const convertArrayOfObjectToObject = (data: Object[], key: string, value: string): Object => {
    const obj: Object = {}
    data.forEach(item => {
        set(obj, [get(item, key)], get(item, value))
        // console.log(obj)
    })
    return obj;
}