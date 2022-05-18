import { Config } from "@/config";
import { computed, Ref } from "vue";
import { useStore } from "vuex";
import DaoCreate from "@/models/dao/DaoCreate";

export const useAccounts = (config: Ref<Config>, values: Ref<any>) => {
    console.log(config.value, values.value)
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

export const useCreateDAO = (loader: Ref<Loader>, config: Ref<Config>, daoAccountId: string) => {
    const store = useStore()

    const createToken = async (formData: any) => {
        const nearFactory = await loader.value.get('nearBlockchain/Factory')
        const account = store.getters['near/getAccount'] // TODO: Rewrite login
        // const account = await loader.value.get('near/WalletAccount') // TODO: Rewrite login
        // console.log(account, config.value.near.ftFactoryAccountId)
        const daoCreate = new DaoCreate(nearFactory.value.createFactoryContractService(account))
        daoCreate.create(daoAccountId, formData.dao_ft_amount, formData.dao_ft_account, formData.dao_ft_name, initDistributionAmount, formData.council_array, formData.dao_ft_account.toUpperCase(), null)
    }

    return {
        createToken
    }
}