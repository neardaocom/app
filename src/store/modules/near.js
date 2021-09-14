import * as nearAPI from "near-api-js"
import getConfig from "@/near/config"
//import { signTransaction } from "near-api-js/lib/transaction"

// initial state
const state = () => ({
  config: undefined,
  api: undefined,
  wallet: undefined,
  factoryContract: undefined
})

// getters
const getters = {
    isSignedIn: (state) => {
      return state.wallet !== undefined ? state.wallet.isSignedIn() : false
    },
    getAccountId: (state) => {
      return state.wallet !== undefined ? state.wallet.getAccountId() : undefined
    },
    getWallet: (state) => {
      return state.wallet !== undefined ? state.wallet : undefined
    },
    getFactoryContract: (state) => {
      return state.factoryContract
    },
    getApiKeyStore: (state) => {
      return state.api.keyStores.BrowserLocalStorageKeyStore()
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
        //let factoryAccount = await api.account("podilnik.testnet");
        //console.log(await factory.getAccountDetails())
        let wallet = new nearAPI.WalletConnection(api);
        // console.log(wallet)
        let factoryContract = new nearAPI.Contract(
          wallet.account(), config.contractName, {
            viewMethods: ['get_dao_list', 'get_dao_info'],
            changeMethods: ['create'],
          }
        )
        console.log(factoryContract)
        commit('setState', {config: config, api: api, wallet: wallet, factoryContract: factoryContract})
    }
}

// mutations
const mutations = {
  setState(state, payload) {
    state.config = payload.config
    state.api = payload.api
    state.wallet = payload.wallet
    state.factoryContract = payload.factoryContract
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