import { Config } from "@/config";
import { computed, Ref } from "vue";
import loGet from "lodash/get";
import NearUtils from "@/models/nearBlockchain/Utils"

export const useNear = (config: Ref<Config>) => {

    const walletUrl = computed(() => loGet(config.value, ['near', 'walletUrl']))
    const adminAccountId = computed(() => loGet(config.value, ['near', 'adminAccountId']))
    const adminAccountPostfix = computed(() => NearUtils.getAccountIdPostfix(adminAccountId.value))
    const ftFactoryAccountId = computed(() => loGet(config.value, ['near', 'ftFactoryAccountId']))

    return { walletUrl, adminAccountId, adminAccountPostfix, ftFactoryAccountId }
}