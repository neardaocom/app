<template>
   <div class="card text-start w-auto p-2">
      <div class="card-body">
         <h5 class="card-title">
            <i class="bi bi-info-square text-gradient-180 me-1"/>
            {{ t('default.information') }}
         </h5>
         <ul class="list-unstyled mb-1">
            <li>
               <i class="bi bi-wallet2 me-1"/>
               <a
               class="text-reset"
               :href="nearWalletUrl + '/accounts/' + dao.wallet"
               target="_blank"
               >
                  {{ t("default.wallet") }}
                  <i class="bi bi-box-arrow-up-right text-gradient-180 ms-1"/>
               </a>
            </li>
            <li v-if="webLink">
               <i class="fas fa-globe fa-fw me-3 mb-3"/>
               <a class="text-reset" :href="web" target="_blank">{{ webLink }}</a>
            </li>
            <li>
               <i class="bi bi-cash-coin me-1"/>
               <span class="text-reset">{{ n(dao.treasury.token.meta.amount) }}</span> {{ dao.treasury.token.meta.short }}
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
import { useStore } from 'vuex';

export default {
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
