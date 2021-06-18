import { createStore } from 'vuex'

export default createStore({
  state() {
    return {
      accountId: undefined
    }
  },
  mutations: {
    accountLogin (state, accountId) {
      state.accountId = accountId
    },
    accountLogout (state) {
      state.accountId = undefined
    }
  },
  actions: {
  },
  modules: {
  },
  strict: process.env.NODE_ENV !== 'production'
})