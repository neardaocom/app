import { firebaseConfig } from "@/config/firebase"
import Firebase from "@/services/firebase"

// initial state
const state = () => ({
    service: new Firebase(firebaseConfig)
})
  
// getters
const getters = {
    getService: (state) => {
        return state.service
    },
    
    getFirestore(state){
        return state.service.getFirestore()
    }
}
  
// actions
const actions = {
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