<template>
   <div class="d-flex flex-wrap justify-content-evenly align-items-stretch mb-5 mt-5">

      <div v-if="nearPrice" style="min-width: 280px;">
         <div class="d-inline-block text-start" > 
         <h6> {{ t("default.dao_funds") }} </h6>
         
            <span class="fs-2"><NumberFormatter :amount="dao.treasury.near * nearPrice"/></span> <span class="fs-5 color-secondary" style="font-weight: 800 !important;">USD</span>
         </div>
      </div>


      <div class="d-flex justify-content-center" style="min-width: 280px;">
         <div class="align-self-end" style="padding-bottom: 8px">
            <span class="fs-6"><NumberFormatter :amount="dao.treasury.token.free"/> {{ dao.treasury.token.meta.short }}</span>
         </div>
         <div class="text-start"> 
            <h6 class="ms-2">Tokens</h6>
            <span class="fs-2 ms-2"  style="font-weight:100 !important">|</span>
            <span class="fs-2" ><NumberFormatter :amount="dao.treasury.near"/></span>  
            <span class="fs-5 color-secondary" style="font-weight: 800 !important;">NEAR</span>
         </div>
      </div>


      <div style="min-width: 280px;">
         <h6>{{ t("default.activity") }}</h6>
         <ul class="list-inline list-unstyled mb-0">
               <li class="list-inline-item me-1">
               <router-link :to="{ name: 'dao', params: {id: dao.wallet}, query: {page: 'voting' }}" class="text-reset">
                  <h2><i class="bi bi-bar-chart color-primary"></i><MDBBadge color="danger" pill notification>{{ dao.proposals.length }}</MDBBadge></h2>
               </router-link>
               </li>
               <li class="list-inline-item ms-1">
               <router-link :to="{ name: 'dao', params: {id: dao.wallet}, query: {page: 'documents' }}" class="text-reset">
                  <h2><i class="bi bi-files color-primary"></i><MDBBadge color="danger" pill notification>{{ dao.docs.files.length }}</MDBBadge></h2>
               </router-link>
               </li>
         </ul>
      </div>
</div>
</template>



<script>
import { useI18n } from 'vue-i18n'
import { MDBBadge } from 'mdb-vue-ui-kit'
import NumberFormatter from "@/components/NumberFormatter.vue"

export default {
   components:{
      MDBBadge,
      NumberFormatter
   },
    props: {
        dao: {
            type: Object,
            required: true,
        },
        nearPrice: {
            type: Number,
            required: false,
        }
    },
   setup () {
      const { t } = useI18n()
   
      return {
         t
      }
   }
}
</script>

<style lang="scss" scoped>

</style>