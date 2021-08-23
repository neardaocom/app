import { createStore, createLogger } from 'vuex'
import near from './modules/near'

const debug = process.env.NODE_ENV !== 'production'

export default createStore({
  state() {
  },
  mutations: {
  },
  actions: {
  },
  modules: {
    near
  },
  strict: debug,
  plugins: debug ? [createLogger()] : []
})