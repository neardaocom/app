<template>
   <MDBCard tag="router-link" :to="{ name: 'dao', params: {id: dao.id + '.' + factoryAccount}}" :text="['start','reset']" class="mb-3">
      <MDBCardBody>

         <div class="d-flex justify-content-between align-items-center">
            <div class="d-flex align-items-center">
               <!-- <span class="rounded-circle bg-black d-flex justify-content-center align-items-center m-2" style="width: 40px; height: 40px;"><img class="" width="20" height="20" :src="'/img/near_logo.svg'"/></span> -->
               <MDBBadge color="black" pill class="me-2" style="padding: 0.75rem"><img width="20" height="20" :src="'/img/near_logo.svg'"/></MDBBadge>
               <span class="fs-5 fw-bold me-1"> {{ dao.name }} </span>
               <small class="text-muted"> #{{ dao.index + 1 }} </small>
            </div>
            <div class="text-muted small">
               {{t('default.wallet')}} 
               <MDBBadge tag="a" :href="walletUrl + '/accounts/' + dao.id + '.' + this.factoryAccount" color="info" pill style="padding: 0.4rem"><i class="bi bi-wallet2"/></MDBBadge>
            </div>
         </div>
         <div class="mt-3 small">
            {{dao.description}}
         </div>
         <div class="d-flex justify-content-between mt-4">
            <div>
               <div class="small">{{t('default.tags')}}</div>
               <MDBBadge v-for="(tag, index) in dao.tags" :key="index" color="info" class="mt-2">{{ tag }}</MDBBadge>
            </div>
            <div>
               <div class="small">{{t('default.dao_funds')}}</div>
               <span class="fw-bold fs-4 me-1">{{ dao.amount }}</span><span class="fs-4" v-if="dao.amount">USD</span>
               
            </div>
         </div>

      </MDBCardBody>
   </MDBCard>
</template>

<script>
import { useI18n } from 'vue-i18n'
import {
   MDBCard,
   MDBCardBody,
   MDBBadge
} from 'mdb-vue-ui-kit'
import { useStore } from 'vuex'
import { computed } from '@vue/reactivity'

export default {
   components: {
      MDBCard,
      MDBCardBody,
      MDBBadge
   },
   props: {
      dao: {
         type: Object,
         required: true,
      },
   },

   setup () {
      // const {dao} = toRefs(props)
      const { t } = useI18n()
      const store = useStore()

      const factoryAccount = computed(() => store.getters['near/getFactoryAccount'])
      const walletUrl = computed(() => store.getters['near/getWalletUrl']) 

      return {
         t,
         factoryAccount,
         walletUrl
      }
   }
}
</script>
