import * as nearAPI from "near-api-js"
import getConfig from "@/near/config"
//import { signTransaction } from "near-api-js/lib/transaction"

// initial state
const state = () => ({
  config: undefined,
  api: undefined,
  wallet: undefined
})

// getters
const getters = {
    isSignedIn: (state) => {
      return state.wallet !== undefined ? state.wallet.isSignedIn() : false
    },
    getAccountId: (state) => {
      return state.wallet !== undefined ? state.wallet.getAccountId() : undefined
    }
}

// actions
const actions = {
    async init ({ commit }) {
        let config = getConfig(process.env.NODE_ENV || "development");
        let api = await nearAPI.connect(Object.assign({
          deps: { 
            keyStore: new nearAPI.keyStores.BrowserLocalStorageKeyStore()
          }
        }, config));
        //console.log(api)
        let wallet = new nearAPI.WalletConnection(api);
        //console.log(wallet)
        commit('setState', {config: config, api: api, wallet: wallet})
    }
}

// mutations
const mutations = {
  setState(state, payload) {
    state.config = payload.config
    state.api = payload.api
    state.wallet = payload.wallet
  },
  signIn(state) {
    state.wallet.requestSignIn(
        state.config.contractName,
        'NEAR DAO'
    )
  },
  signOut(state) {
    state.wallet.signOut()
  },
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}