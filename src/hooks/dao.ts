import { computed } from "vue";
import { findParam } from "@/utils/collection";
import { useStore } from "vuex";

export const useLinks = (dao: any) => {
    // TODO: Refactor search pagh
    const web = computed(() => findParam(dao.docs.files, {'ext': 'url', 'category': 'Fundamental', 'name': 'Web'}, ['ipfs_cid']))
    const whitepaper = computed(() => findParam(dao.docs.files, {'ext': 'url', 'category': 'Fundamental', 'name': 'Whitepaper'}, ['ipfs_cid']))
    const wiki = computed(() => findParam(dao.docs.files, {'ext': 'url', 'category': 'Fundamental', 'name': 'Wiki'}, ['ipfs_cid']))
    const sourceCode = computed(() => findParam(dao.docs.files, {'ext': 'url', 'category': 'Fundamental', 'name': 'Source code'}, ['ipfs_cid']))
    const kycStatus = computed(() => findParam(dao.docs.files, {'ext': 'url', 'category': 'KYC', 'name': 'Legal status'}, ['ipfs_cid']))
    const kycDocument = computed(() => findParam(dao.docs.files, {'ext': 'url', 'category': 'KYC', 'name': 'Legal document'}, ['ipfs_cid']))
    const socialTwitter = computed(() => findParam(dao.docs.files, {'ext': 'url', 'category': 'Social', 'name': 'Twitter'}, ['ipfs_cid']))
    const socialFacebook = computed(() => findParam(dao.docs.files, {'ext': 'url', 'category': 'Social', 'name': 'Facebook'}, ['ipfs_cid']))
    const chatDiscord = computed(() => findParam(dao.docs.files, {'ext': 'url', 'category': 'Chat', 'name': 'Discord'}, ['ipfs_cid']))

    return {
        web, whitepaper, wiki, sourceCode,
        kycStatus, kycDocument,
        socialTwitter, socialFacebook,
        chatDiscord
    }
}

export const useStats = (dao: any) => {
    const users = computed(() => Object.keys(dao.token_holders).length)

    return {
        users
    }
}

export const useVuex = () => {
    const store = useStore()
    const walletUrl = computed(() => store.getters['near/getWalletUrl'])

    return {
        walletUrl
    }
}