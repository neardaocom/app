import lodashSet from 'lodash/set'
import lodashGet from 'lodash/get'

export const convertArrayOfObjectToObject = (data: Object[], key: string, value: string): Record<string, unknown> => {
    const obj: Record<string, unknown> = {}
    data.forEach(item => {
        lodashSet(obj, [lodashGet(item, key)], lodashGet(item, value))
        // console.log(obj)
    })
    return obj;
}