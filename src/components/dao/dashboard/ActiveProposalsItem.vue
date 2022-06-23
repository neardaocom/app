<template>
   <div>
      <div v-html="proposal.title" />
      <div class="small text-muted mb-n2">{{ proposal.type }}</div>
   </div>
   <div>
      <div class="small mb-n1"><i class="bi bi-calendar4 text-gradient-180 me-1"/>{{ proposalDate }} - {{ proposalTime }}</div>
      <MDBProgress :height="15" class="rounded">
         <MDBProgressBar class="bg-gradient-270 rounded" :value="proposalProgress" :style="1">
            {{ proposalProgress }} %
         </MDBProgressBar>
      </MDBProgress>
   </div>
</template>

<script>
import { MDBProgress, MDBProgressBar } from "mdb-vue-ui-kit";
import { toRefs } from 'vue';
import { useProposalCounter, useProposalComputed } from '@/hooks/proposal'

export default {
   components:{
      MDBProgress, MDBProgressBar,
   },
   props: {
      proposal: {
         type: Object,
         required: true,
      },
   },
   setup (props) {
      const { proposal } = toRefs(props)

      const { proposalProgress, proposalProgressIntervalId } = useProposalCounter(proposal)
      const { proposalDate, proposalTime } = useProposalComputed(proposal)

      return {
         proposalProgress, proposalProgressIntervalId, proposalDate, proposalTime,
      }
   }
}
</script>