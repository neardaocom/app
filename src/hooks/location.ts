import { states } from '@/data/states'
import { compareByText } from '@/utils/object'
import { SelectOption } from '@/utils/formSelectOption'
import _ from "lodash"

export const locationList = (t: any): SelectOption[] => {
    const listWorld = [
        {text: t('default.global'), value: 'glo'},
    ]
    // continents
    const listContinents = [
        {text: t('default.asia'), value: 'asi'},
        {text: t('default.africa'), value: 'afr'},
        {text: t('default.europe'), value: 'eur'},
        {text: t('default.north_america'), value: 'nam'},
        {text: t('default.south_america'), value: 'sam'},
        {text: t('default.australia'), value: 'aus'},
    ]
    listContinents.sort(compareByText)
    // states
    const listStates = Object.keys(states).map((x, index) => { return { text: _.get(states, index) + ' (' + x.toUpperCase() + ')', value: x}})

    return listWorld.concat(listContinents, listStates)
}