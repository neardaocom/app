import getConfig from "@/config/near"
import { NearService } from "@/services/nearService"
//import { signTransaction } from "near-api-js/lib/transaction"

// initial state
const state = () => ({
  service: undefined
})

// getters
const getters = {
    isSignedIn: (state) => {
      return state.service.walletConnection.isSignedIn() ?? false
    },
    getAccountId: (state) => {
      return state.service.walletConnection.getAccountId()
    },
    getFactoryAccount: (state) => {
      return state.service.config !== undefined ? state.service.config.contractName : undefined
    },
    getWallet: (state) => {
      return state.service.walletConnection !== undefined ? state.service.walletConnection : undefined
    },
    getWalletUrl: (state) => {
      return state.service.config !== undefined ? state.service.config.walletUrl : undefined
    },
    getFactoryContract: (state) => {
      return state.service.factoryContract
    },
    getService: (state) => {
      return state.service
    }
}

// actions
const actions = {
    async init ({ commit }) {
        const config = getConfig(process.env.NODE_ENV || "development");
        let service = new NearService(config)
        await service.init()
        //console.log(service)
        commit('setState', {service: service})
    }
}

// mutations
const mutations = {
  setState(state, payload) {
    state.service = payload.service
  },
  setContract(state, contractId) {
    state.service.contractPool.get(contractId)
  },
  signIn(state) {
    state.service.signIn()
  },
  signOut(state) {
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