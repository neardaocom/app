<template>
   <div class="d-flex flex-wrap justify-content-evenly align-items-stretch mt-5">

      <div v-if="nearPrice" class="d-flex justify-content-center text-start mb-5" style="min-width: 280px;">
         <div> 
            <h6> {{ t("default.dao_funds") }} </h6>
            <NumberFormatter class="h2 border-start border-secondary border-3 ps-2" :amount="dao.treasury.near * nearPrice"/><span class="fs-5 text-secondary" style="font-weight: 800 !important;">USD</span>
         </div>
      </div>


      <div class="d-flex justify-content-center text-start mb-5" style="min-width: 280px;">
         <!-- <div class="align-self-end" style="padding-bottom: 8px">
         </div> -->
         <div> 
            <h6 >Tokens</h6>
            <div class="border-start border-secondary border-3 ps-2">
               <div class="small"><NumberFormatter :amount="dao.treasury.token.free"/><span class="ms-1 text-secondary fw-bold">{{ dao.treasury.token.meta.short }}</span></div>
               <!-- <span class="fs-2"  style="font-weight:100 !important">|</span> -->
               <NumberFormatter class="h2" :amount="dao.treasury.near"/> 
               <span class="fs-5 text-secondary" style="font-weight: 800 !important;">NEAR</span>         
            </div>
         </div>
      </div>


      <div class="mb-5" style="min-width: 280px;">
         <h6>{{ t("default.activity") }}</h6>
         <ul class="list-inline list-unstyled mb-0">
               <li class="list-inline-item me-1">
               <router-link :to="{ name: 'dao', params: {id: dao.wallet}, query: {page: 'voting' }}" class="text-reset">
                  <h2><i class="bi bi-bar-chart text-secondary"></i><MDBBadge color="danger" pill notification>{{ dao.proposals.length }}</MDBBadge></h2>
               </router-link>
               </li>
               <li class="list-inline-item ms-1">
               <router-link :to="{ name: 'dao', params: {id: dao.wallet}, query: {page: 'resources' }}" class="text-reset">
                  <h2><i class="bi bi-files text-secondary"></i><MDBBadge color="danger" pill notification>{{ dao.docs.files.length }}</MDBBadge></h2>
               </router-link>
               </li>
         </ul>
      </div>
</div>
</template>



<script>
import { useI18n } from 'vue-i18n'
import { MDBBadge } from 'mdb-vue-ui-kit'
import NumberFormatter from "@/components/ui/NumberFormatter.vue"
import { inject } from '@vue/runtime-core'

export default {
   components:{
      MDBBadge,
      NumberFormatter
   },
      props: {
         nearPrice: {
            type: Number,
            required: false,
         }
      },
   setup () {
      const dao = inject('dao')
      const { t } = useI18n()
   
      return {
         dao, t
      }
   }
}
</script>