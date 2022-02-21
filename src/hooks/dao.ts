import { computed, ref } from "vue";
import { useStore } from "vuex";
import { DAO, DAORights } from "@/types/dao";
import loGet from "lodash/get";
import { Translate } from "@/types/generics";
import { getGroupCouncil } from '@/models/dao'
import { getDAORights, toTranslate, getWalletRights } from '@/models/rights'
import Decimal from "decimal.js";
import { getFile } from "@/models/document"
import { useI18n } from "vue-i18n";
import { useRoute } from "vue-router";

export const useRouter = () => {
    const route = useRoute()
    const rDaoId = computed(() => loGet(route, ['params', 'id']) ?? process.env.VUE_APP_DAO_DEFAULT)
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

export const useGroups = (dao: DAO) => {
    const { t } = useI18n()

    const council = computed(() => getGroupCouncil(dao, t))
    const councilPercent = computed(() => (council.value && council.value.token) ? new Decimal(council.value.token.locked ?? 0).div(dao.treasury.token.meta.amount ?? 1).mul(100).round().toNumber() : undefined)

    return {
        council, councilPercent
    }
}

export const useStats = (dao: DAO) => {
    const users = computed(() => dao.tokenHolders.length)

    return {
        users
    }
}

export const useRights = (dao: DAO, walletId?: string) => {
    const { t } = useI18n()
    const rights = getDAORights(dao)
    const daoRights = ref(rights)
    const walletRights = ref<DAORights[]>(getWalletRights(dao, walletId))
    
    const daoRightsOptions = ref(rights.map((right, index) => {
        const trans: Translate = toTranslate(right, dao.groups)
        return {text: t('default.' + trans.key, trans.params), value: index} // TODO: trans.params
    }))

    return {
        daoRights, walletRights, daoRightsOptions
    }
}