import { useI18n } from 'vue-i18n'
import { states } from '@/data/states.js'
import { compareByText } from '@/utils/object.js'

export const locationList = () => {
    const { t } = useI18n();
    const listWorld = [
        {text: t('default.global'), value: 'glo'},
    ]
    let listContinents = [
        {text: t('default.asia'), value: 'asi'},
        {text: t('default.africa'), value: 'afr'},
        {text: t('default.europe'), value: 'eur'},
        {text: t('default.north_america'), value: 'nam'},
        {text: t('default.south_america'), value: 'sam'},
        {text: t('default.australia'), value: 'aus'},
    ]
    listContinents.sort(compareByText)
    const listStates = Object.keys(states).map(x => { return { text: states[x] + ' (' + x.toUpperCase() + ')', value: x}})
    return listWorld.concat(listContinents, listStates)
}