import { createStore, createLogger } from 'vuex'
import near from './modules/near'
import ipfs from './modules/ipfs'
import firebase from './modules/firebase'

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
    firebase
  },
  strict: debug,
  plugins: debug ? [createLogger()] : []
})