import { computed, ref, Ref } from "vue";
import { DAO, DAORights } from "@/models/dao/types/dao";
import loGet from "lodash/get";
import { Translate } from "@/models/utils/types/generics";
import Rights from '@/models/dao/Rights'
import { getFile } from "@/models/document"
import { useI18n } from "vue-i18n";
import { useRoute } from "vue-router";
import { Config } from "@/config";
import loIsNil from 'lodash/isNil'
import CollectionHelper from "@/models/utils/CollectionHelper";
import GroupHelper from "@/models/dao/GroupHelper";

export const useRouter = (config: Config) => {
    const route = useRoute()
    const rDaoId = computed(() => loGet(route, ['params', 'id']) ?? config.app.daoDefault)
    const rPage = computed(() => loGet(route, ['query', 'page']) ?? 'overview')
    const rSearch = computed(() => loGet(route, ['query', 'search']))
    const rOrder = computed(() => loGet(route, ['query', 'order']))

    return {
        rDaoId, rPage, rSearch, rOrder
    }
}

export const useLinks = (dao: DAO) => {
    const web = getFile(dao.docs, 'Web', 'Fundamental', 'url')
    const whitepaper = getFile(dao.docs, 'Whitepaper', 'Fundamental', 'url')
    const wiki = getFile(dao.docs, 'Wiki', 'Fundamental', 'url')
    const sourceCode = getFile(dao.docs, 'Source code', 'Fundamental', 'url')
    const kycStatus = getFile(dao.docs, 'Legal status', 'KYC', 'url')
    const kycDocument = getFile(dao.docs, 'Legal document', 'KYC', 'url')
    const socialTwitter = getFile(dao.docs, 'Twitter', 'Social', 'url')
    const socialFacebook = getFile(dao.docs, 'Facebook', 'Social', 'url')
    const chatDiscord = getFile(dao.docs, 'Discord', 'Chat', 'url')

    return {
        web, whitepaper, wiki, sourceCode,
        kycStatus, kycDocument,
        socialTwitter, socialFacebook,
        chatDiscord
    }
}

export const useGroups = (dao: Ref<DAO>) => {
    const { t } = useI18n()

    const council = computed(() => GroupHelper.getGroupCouncil(dao.value, t))
    const councilPercent = computed(() => undefined) // TODO: Move to lock
    const groupsOptions =  computed(() => CollectionHelper.toOptions(dao.value.groups, ['name'], ['id']))

    return {
        council, councilPercent, groupsOptions
    }
}

export const useLocks = (dao: Ref<DAO>) => {
    const locksOptions = computed(() => CollectionHelper.toOptions(dao.value.treasuryLocks, ['name'], ['id']))

    return {
        locksOptions
    }
}

export const useStats = (dao: Ref<DAO>) => {
    const users = computed(() => dao.value.tokenHolders.length)
    const groupNames = computed(() => dao.value.groups.map((group) => group.name))

    return {
        users, groupNames
    }
}

export const useRights = (dao: Ref<DAO>, walletId?: string) => {
    const { t } = useI18n()
    const daoRights = computed(() => loIsNil(dao.value) === false ? Rights.getDAORights(dao.value) : [])
    const walletRights = computed(() => loIsNil(dao.value) === false && loIsNil(walletId) === false ? Rights.getWalletRights(dao.value, walletId) : [])
    
    const daoRightsOptions = computed(() => daoRights.value.map((right, index) => {
        const trans: Translate = Rights.toTranslate(right, dao.value.groups)
        return {text: t('default.' + trans.key, trans.params), value: index} // TODO: trans.params
    }))

    return {
        daoRights, walletRights, daoRightsOptions
    }
}