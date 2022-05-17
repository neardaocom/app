import { getConfig } from "@/config/ipfs"
import { IpfsService } from "@/models/services/ipfsService/IpfsService.js"
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
    const service = new IpfsService(config.token)
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