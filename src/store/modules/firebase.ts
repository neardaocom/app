import { getConfig } from "@/config/firebase"
import Firebase from "@/models/services/firebase"

// initial state
const state = () => ({
    service: new Firebase(getConfig(process.env.NODE_ENV || "development"))
})
  
// getters
const getters = {
    getService: (state: any) => {
        return state.service
    },
    
    getFirestore(state: any){
        return state.service.getFirestore()
    }
}
  
// actions
const actions = {
}
  
// mutations
const mutations = {
    setState(state:any, payload: any) {
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