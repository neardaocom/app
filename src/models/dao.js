import { toSearch } from '@/utils/string'

export const transTags = (tags, t) => tags.map(tag => t('default.' + tag));

export const transform = (list, tags, t, n) => list.map((item, index) => {
    let trans = {
        id: item[0],
        index: index,
        name: item[1].name,
        description: item[1].description,
        location: item[1].lang,
        ft_name: item[1].ft_name,
        ft_amount: n(item[1].ft_amount),
        tags: item[1].tags.map(tag => t('default.' + tags[tag])),
    }
    trans.search = [toSearch(trans.id), toSearch(trans.name), toSearch(trans.description), toSearch(trans.ft_name)].concat(trans.tags.map(tag => toSearch(tag))).join('-')
    return trans
});