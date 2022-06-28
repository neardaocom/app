import { FirebaseConfig } from '@/config/firebase';
import ServicePool from '@/models/dao/ServicePool'
import Firebase from '@/models/services/firebase';
import { defineStore } from 'pinia'

export type ServiceState = {
    servicePool: ServicePool | undefined;
    firebase: Firebase | undefined;
}

export const useServiceStore = defineStore('service', {
  state: () => ({
    servicePool: undefined,
    firebase: undefined,
  } as ServiceState),
  actions: {
    setServicePool(servicePool: ServicePool) {
      this.servicePool = servicePool
    },
    initFirebase(config: FirebaseConfig) {
      this.firebase = new Firebase(config)
    }
  },
})