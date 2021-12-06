import { toSearch } from '@/utils/string'
import _ from "lodash"

export const transTags = (tags: string[], t: any) => tags.map(tag => t('default.' + tag));

export const transform = (list: any[], tags: string[], t: any, n: any) => list.map((item, index) => {
    const trans = {
        id: item[0],
        index: index,
        name: item[1].name,
        description: item[1].description,
        location: item[1].lang,
        ft_name: item[1].ft_name,
        ft_amount: n(item[1].ft_amount),
        tags: item[1].tags.map((tag: any) => t('default.' + _.nth(tags, _.toInteger(tag)))),
        search: '',
        amount: null,
    }
    trans.search = [toSearch(trans.id), toSearch(trans.name), toSearch(trans.description), toSearch(trans.ft_name)].concat(trans.tags.map((tag: any) => toSearch(tag))).join('-')
    return trans
});