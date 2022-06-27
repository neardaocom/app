<template>
   <div class="card text-start w-auto p-2">
      <div class="card-body">
         <div class="d-flex mb-2">
            <h5 class="card-title">
               <i class="bi bi-info-square text-gradient-180 me-1"/>
               {{ t('information') }}
            </h5>
            <Tooltip class="ms-auto" text="Tooltip" />
         </div>

         <div class="d-flex justify-content-between align-items-center mb-3">
            <div class="d-flex align-items-center">
               <Icon icon="NEAR" :size="45"/>
               <div class="text-start">
                     <div class="fs-5 fw-bold me-1">{{dao.name}}</div>
                     <div class="text-muted small mt-n2">{{ dao.wallet }}</div>
               </div>
            </div>

            <div class="text-muted small">
               {{t('wallet')}} 
               <MDBBadge tag="a" :href="walletUrl + '/accounts/' + dao.wallet" color="info" pill style="padding: 0.4rem"><i class="bi bi-wallet2"/></MDBBadge>
            </div>
         </div>
         
         <ul class="list-unstyled fw-bold">
            <li>
               <i class="bi bi-wallet2 text-muted me-2"/>
               <a
               class="text-reset"
               :href="nearWalletUrl + '/accounts/' + dao.wallet"
               target="_blank"
               >
                  {{ t("wallet") }}
                  <i class="bi bi-box-arrow-up-right text-gradient-180 ms-1"/>
               </a>
            </li>
            <li v-if="webLink">
               <i class="fas fa-globe fa-fw text-muted me-3 mb-3"/>
               <a class="text-reset" :href="web" target="_blank">{{ webLink }}</a>
            </li>
            <li>
               <i class="bi bi-cash-coin text-muted me-2"/>
               <InfoAmount :amount="dao.treasury.token.meta.amount" :suffix="dao.treasury.token.meta.symbol" class="text-reset"/> 
            </li>
         </ul>
      </div>
   </div>
</template>

<script>
import { computed, ref } from '@vue/reactivity'
import { useI18n } from 'vue-i18n';
import { inject } from '@vue/runtime-core';
import { useIPFS } from '@/hooks/vuex';
import { useLinks } from '@/hooks/dao';
import Tooltip from '@/components/ui//Tooltip.vue'
import Icon from '@/components/ui/Icon.vue'
import { MDBBadge } from 'mdb-vue-ui-kit'
import { useStore } from 'vuex';
import InfoAmount from '@/components/ui/InfoAmount.vue'


export default {
   components:{
      Tooltip,
      Icon,
      MDBBadge,
      InfoAmount
   },
   setup () {
      const dao = inject('dao')
      const { t, n } = useI18n()
      const store = useStore()

      const nearWalletUrl = computed(() => store.getters['near/getWalletUrl'])  

      const { ipfsService } = useIPFS()
      const { web } = useLinks(dao.value)
      const webLink = ref(null)

      if (web) fetch(web, ipfsService.value).then(r => {webLink.value = r})

      return { dao, t, n, nearWalletUrl }
   }
}
</script>
