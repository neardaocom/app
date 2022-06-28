<template>
   <MDBCard tag="router-link" :to="{ name: 'dao', params: {id: dao.walletId}}" :text="['start','reset']" class="mb-3">
      <MDBCardBody>

         <div class="d-flex justify-content-between align-items-center">
            <div class="d-flex align-items-center">
               <!-- <span class="rounded-circle bg-black d-flex justify-content-center align-items-center m-2" style="width: 40px; height: 40px;"><img class="" width="20" height="20" :src="'/img/near_logo.svg'"/></span> -->
               <slot name="icon">
                  <Icon icon="NEAR" :size="52"/>
               </slot>
               <span class="fs-5 fw-bold me-1"> {{ dao.name }} </span>
               <small class="text-muted"> #{{ dao.index + 1 }} </small>
            </div>
            <div class="text-muted small">
               {{t('wallet')}} 
               <MDBBadge tag="a" :href="walletUrl + '/accounts/' + dao.walletId" color="info" pill style="padding: 0.4rem"><i class="bi bi-wallet2"/></MDBBadge>
            </div>
         </div>
         <div class="mt-3 small">
            {{dao.description}}
         </div>
         <div class="d-flex justify-content-between mt-4">
            <div>
               <template  v-if="dao.tags.length > 0">
                  <div class="small">{{t('tags')}}</div>
                  <MDBBadge v-for="(tag, index) in dao.tags" :key="index" color="info" class="mt-2">{{ tag }}</MDBBadge>
               </template>
            </div>
            <div v-if="dao.treasuryAmountUsd">
               <div class="small">{{t('dao_funds')}}</div>
               <InfoAmount :amount="dao.treasuryAmountUsd" suffix="USD" suffixNormal class="fs-4 fw-bold" />
            </div>
         </div>
      </MDBCardBody>
   </MDBCard>
</template>

<script>
import { inject } from 'vue'
import { useI18n } from 'vue-i18n'
import {
   MDBCard,
   MDBCardBody,
   MDBBadge
} from 'mdb-vue-ui-kit'
import Icon from "@/components/ui/Icon.vue"
import InfoAmount from '@/components/ui/InfoAmount.vue'
import { useNear } from '@/hooks/near'

export default {
   components: {
      MDBCard,
      MDBCardBody,
      MDBBadge, 
      Icon, 
      InfoAmount,
   },
   props: {
      dao: {
         type: Object,
         required: true,
      },
   },

   setup () {
      const config = inject('config')
      const { t } = useI18n()

      const { walletUrl } = useNear(config)

      return {
         t, walletUrl
      }
   }
}
</script>
