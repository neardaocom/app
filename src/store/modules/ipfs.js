import { IpfsService } from "@/services/ipfsService/IpfsService"


// initial state
const state = () => ({
    service: undefined
  })
  
  // getters
  const getters = {
      getService: (state) => {
        return state.service
      }
  }
  
  // actions
  const actions = {
      async init ({ commit }) {
          let service = new IpfsService(process.env.VUE_APP_WEB3STORAGE_TOKEN)
          //console.log(service)
          commit('setState', {service: service})
      }
  }
  
  // mutations
  const mutations = {
    setState(state, payload) {
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