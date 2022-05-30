<template>
   <MDBCard>
      <MDBCardBody class="text-start">
         <div class="d-flex">
            <h6 class="text-muted">
               {{t('default.active_proposals')}}
            </h6>
            <Tooltip class="ms-auto" text="Tooltip" />
         </div>
         <!-- Proposal -->
         <div v-if="proposals.length > 0">
            <div v-for="proposal in proposals" :key="proposal.id" class="d-flex justify-content-between align-items-center mb-3">
               <ActiveProposalsItem :proposal="proposal" />
            </div>
         </div>
         <div v-else class="d-flex">
            <h5>{{ t('default.no_active_proposal') }}</h5>
         </div>
      </MDBCardBody>
   </MDBCard>
</template>

<script>
import { MDBCard, MDBCardBody } from "mdb-vue-ui-kit";
import { inject } from 'vue';
import { useI18n } from 'vue-i18n';
import Tooltip from '@/components/ui/Tooltip.vue'
import ActiveProposalsItem from './ActiveProposalsItem.vue'
import { useList } from '@/hooks/proposal'

export default {
   components:{
      MDBCard, MDBCardBody, Tooltip,
      ActiveProposalsItem,
   },
   setup () {
      const { t } = useI18n()

      const dao = inject('dao')
      const loader = inject('loader')
      const wallet = inject('wallet')
      const walletRights = inject('walletRights')
      const templateMeta = inject('templateMeta')

      const { list, activeProposals } = useList(dao, templateMeta, wallet, walletRights, loader)

      const proposals = activeProposals()

      return {
         t, list, proposals,
      }
   }
}
</script>