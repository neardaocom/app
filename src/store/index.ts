import { createStore, createLogger } from 'vuex'
import near from './modules/near'
import ipfs from './modules/ipfs'
import firebase from './modules/firebase'
import market from './modules/market'
import form from './modules/form'

const debug = process.env.NODE_ENV !== 'production'

export default createStore({
  state() {
  },
  mutations: {
  },
  actions: {
  },
  modules: {
    near,
    ipfs,
    firebase,
    market,
    form,
  },
  strict: debug,
  plugins: debug ? [createLogger()] : []
})