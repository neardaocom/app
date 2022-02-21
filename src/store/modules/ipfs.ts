import { IpfsService } from "@/services/ipfsService/IpfsService.js"
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
      async init ({ commit }: { commit: Commit }) {
          const service = new IpfsService(process.env.VUE_APP_WEB3STORAGE_TOKEN)
          //console.log(service)
          commit('setState', {service: service})
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