import {getConfig} from "@/config/near"
import NearService from "@/models/services/nearService/NearService"
//import { signTransaction } from "near-api-js/lib/transaction"
import { Commit } from "vuex"
import { ListItemDto } from "@/models/dao/types/factory";

// initial state
const state = () => ({
  service: undefined,
  list: undefined,
})

// getters
const getters = {
    isSignedIn: (state: any) => {
      return state.service.walletConnection.isSignedIn() ?? false
    },
    getAccountId: (state: any) => {
      return state.service.walletConnection.getAccountId()
    },
    getAccount: (state: any) => {
      return state.service.walletConnection.account()
    },
    getFactoryAccount: (state: any) => {
      return state.service.config !== undefined ? state.service.config.daoFactory : undefined
    },
    getWallet: (state: any) => {
      return state.service.walletConnection !== undefined ? state.service.walletConnection : undefined
    },
    getWalletUrl: (state: any) => {
      return state.service.config !== undefined ? state.service.config.walletUrl : undefined
    },
    getFactoryContract: (state: any) => {
      return state.service.factoryContract
    },
    getProviderContract: (state: any) => {
      return state.service.providerContract
    },
    getService: (state: any) => {
      return state.service
    },
    getList: (state: any) => {
      return state.list
    }
}

// actions
const actions = {
    async init ({ commit }: { commit: Commit}) {
        const config = getConfig(process.env.NODE_ENV || "development");
        const service = new NearService(config)
        await service.init()
        //console.log(service)
        commit('setState', {service: service})
    }
}

// mutations
const mutations = {
  setList(state: any, list: ListItemDto[]) {
    state.list = list
  },
  setState(state: any, payload: any) {
    state.service = payload.service
  },
  setContract(state: any, contractId: string) {
    state.service.contractPool.get(contractId)
  },
  signIn(state: any, payload: any) {
    state.service.signIn(payload?.successUrl, payload?.errorUrl)
  },
  signOut(state: any) {
    state.service.signOut()
  },
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}