<template>
   <div class="d-flex flex-wrap justify-content-evenly align-items-stretch mt-5">

      <InfoItem v-if="nearPrice" :header="t('default.dao_funds')" :amount="dao.treasury.near * nearPrice" suffix="USD"/>
      <InfoItem :header="t('default.my_share')" :amount="myTokensShare" suffix="%"/>
      <InfoItem :header="t('default.tokens')" :amount="dao.treasury.token.free" :suffix="dao.treasury.token.meta.symbol"/>


      <div class="mb-5">
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
import { computed, inject } from '@vue/runtime-core'
import InfoItem from "@/components/ui/InfoItem.vue"
import Decimal from 'decimal.js'

export default {
   components:{
      MDBBadge,
      InfoItem,
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
      const myTokensShare = computed(() => (dao.value.treasury.token.owned > 0) ? new Decimal(dao.value.treasury.token.owned || 0).dividedBy(dao.value.treasury.token.holded).times(100).round().toNumber() : null);
   
      return {
         dao, t, myTokensShare
      }
   }
}
</script>