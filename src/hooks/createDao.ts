import { Config } from "@/config";
import { Loader } from "@/loader";
import { computed, Ref, toRaw } from "vue";
import DaoCreate from "@/models/dao/DaoCreate";
import { useI18n } from "vue-i18n";
import { NearConfig } from "@/config/near";
import Decimal from "decimal.js";
import NearUtils from "@/models/nearBlockchain/Utils";
import { useNear } from "./near";

export const useAccounts = (config: Ref<Config>, values: Ref<any>) => {
    const { adminAccountId, ftFactoryAccountId } = useNear(config)

    const daoAccountId = computed(() =>
        values.value.dao_account
            ? values.value.dao_account + "." + adminAccountId.value
            : null
    );
    const ftAccountId = computed(() =>
        values.value.dao_ft_account
            ? values.value.dao_ft_account + "." + ftFactoryAccountId.value
            : null
    );

    return { adminAccountId, ftFactoryAccountId, daoAccountId, ftAccountId }
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

      const daoCreated = (transactionHash: string): void => {
        const state = getState()
        state.step = 'daoCreated'
        state.transactionHash = transactionHash
        localStorage.setItem('create_dao', JSON.stringify(state))
        return state
      }

      const stakeServiceRegistred = (): void => {
        localStorage.removeItem('create_dao')
      }

    return { getState, formSubmited, tokenCreated, daoCreated, stakeServiceRegistred }
}

export const useCreateDAO = (loader: Ref<Loader>, config: Ref<Config>, ftAccountId: string) => {
    const { t } = useI18n()

    const createDao = async (formData: any) => {
        const nearFactory = await loader.value.get('nearBlockchain/Factory')
        const configNear = toRaw(config.value.near) as NearConfig
        const account = await loader.value.get('near/WalletAccount')
        // console.log(account, config.value.near.ftFactoryAccountId)
        const daoCreate = new DaoCreate(
            nearFactory.value.createAdminContractService(account.value),
            nearFactory.value.createWfProviderContractService(account.value),
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