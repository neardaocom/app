import { Config } from "@/config";
import { Loader } from "@/loader";
import { computed, Ref, toRaw } from "vue";
import { useStore } from "vuex";
import DaoCreate from "@/models/dao/DaoCreate";
import { useI18n } from "vue-i18n";
import { NearConfig } from "@/config/near";
import Decimal from "decimal.js";
import NearUtils from "@/models/nearBlockchain/Utils";

export const useAccounts = (config: Ref<Config>, values: Ref<any>) => {
    const daoFactoryAccountId = computed(
        () => config.value.near.daoFactoryAccountId
    );
    const ftFactoryAccountId = computed(
        () => config.value.near.ftFactoryAccountId
    );

    const daoAccountId = computed(() =>
        values.value.dao_account
            ? values.value.dao_account + "." + daoFactoryAccountId.value
            : null
    );
    const ftAccountId = computed(() =>
        values.value.dao_ft_account
            ? values.value.dao_ft_account + "." + ftFactoryAccountId.value
            : null
    );

    return { daoFactoryAccountId, ftFactoryAccountId, daoAccountId, ftAccountId }
}

export const useFormStep = () => {
    const getState = (): any | null => {
        let state: any | null = null;
        const data = localStorage.getItem('create_dao')
        if (data !== null) {
            state = JSON.parse(data)
        }
        return state
    }

    const formSubmited = (data: any): any => {
        const state = {
            data: data,
            step: 'fromSubmited',
            transactionHash: null,
        }
        localStorage.setItem('create_dao', JSON.stringify(state))
        return state
    }

    const tokenCreated = (transactionHash: string): any => {
        const state = getState()
        state.step = 'tokenCreated'
        state.transactionHash = transactionHash
        localStorage.setItem('create_dao', JSON.stringify(state))
        return state
      }

      const daoCreated = (): void => {
        localStorage.removeItem('create_dao')
      }

    return { getState, formSubmited, tokenCreated, daoCreated }
}

export const useCreateDAO = (loader: Ref<Loader>, config: Ref<Config>, ftAccountId: string) => {
    const store = useStore()
    const { t } = useI18n()

    const createDao = async (formData: any) => {
        const nearFactory = await loader.value.get('nearBlockchain/Factory')
        const configNear = toRaw(config.value.near) as NearConfig
        const account = store.getters['near/getAccount'] // TODO: Rewrite login
        // const account = await loader.value.get('near/WalletAccount') // TODO: Rewrite login
        // console.log(account, config.value.near.ftFactoryAccountId)
        const daoCreate = new DaoCreate(
            nearFactory.value.createFactoryContractService(account),
            nearFactory.value.createWfProviderContractService(account),
            configNear,
            t
        )

        daoCreate.create(
            formData.dao_name,
            formData.dao_purpose,
            formData.dao_account,
            ftAccountId,
            new Decimal(formData.dao_ft_amount).toNumber(),
            24,
            formData.ftCouncilShare,
            new Decimal(formData.dao_ft_init_distribution).toNumber(),
            formData.council_array,
            NearUtils.durationToChain({months: formData.dao_unlocking_month, years: formData.dao_unlocking_year}),
            formData.voteApproveThreshold,
            formData.voteQuorum,
            NearUtils.durationToChain({days: formData.voteDurationDays, hours: formData.voteDurationHours, minutes: formData.voteDurationMinutes})
        )
    }

    return {
        createDao
    }
}