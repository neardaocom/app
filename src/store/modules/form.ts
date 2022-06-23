// initial state
const state = () => ({
  createDao: undefined
})

// getters
const getters = {
    createDao: (state: any) => {
      return state.createDao
    },
}

// actions
const actions = {
}

// mutations
const mutations = {
  createDaoFormSubmited(state: any, data: any) {
    state.createDao = {
      data: data,
      step: 'fromSubmited',
      transactionHash: null,
    }
  },
  createDaoTokenCreated(state: any, transactionHash: string) {
    state.createDao.step = 'tokenCreated'
    state.createDao.transactionHash = transactionHash
  },
  createDaoCreated(state: any) {
    state.createDao = undefined
  },
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}