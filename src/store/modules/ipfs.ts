import { getConfig } from "@/config/ipfs"
import Web3StorageService from "@/models/services/ipfs/Web3StorageService"
import { Commit } from "vuex"


// initial state
const state = () => ({
  service: undefined
})

// getters
const getters = {
  getService: (state: any) => {
    return state.service
  }
}

// actions
const actions = {
  async init({ commit }: { commit: Commit }) {
    const config = getConfig(process.env.NODE_ENV || "development")
    const service = new Web3StorageService(config.token)
    //console.log(service)
    commit('setState', { service: service })
  }
}

// mutations
const mutations = {
  setState(state: any, payload: any) {
    state.service = payload.service
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}