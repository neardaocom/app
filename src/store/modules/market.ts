// initial state
const state = () => ({
  nearPriceUsd: undefined
})

// getters
const getters = {
    getNearPrice: (state: any) => {
      return state.nearPriceUsd
    },
}

// actions
const actions = {
}

// mutations
const mutations = {
  setNearPriceUsd(state: any, price: number) {
    state.nearPriceUsd = price
  },
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}