<template>
  <div class="card">
    <div class="card-body">

      <!-- header -->
      <div class="d-flex mb-2">
        <span class="fs-6 text-muted p-2 text-center">
          #{{ proposal.id }}
        </span>
        
        <div class="p-2">
           <div class="mt-n2 fs-5" v-html="proposal.title"></div>
           <div class="mt-n2 small">{{ proposal.type }}</div>
        </div>

        <div class="ms-auto p-2">
          <MDBBadge :color="workflowCodeMapper[workflowCode].color" class="text-uppercase" pill><i :class="workflowCodeMapper[workflowCode].icon"></i>{{ proposal.state }}</MDBBadge>
        </div>
      </div>

      <!-- Desctiption -->
      <TextCollapse v-if="proposalDescriptionLoaded" :content="proposalDescription || ''"/>

      <!-- progress or status -->
      <MDBProgress
        v-if="workflowCode === 'in_progress' || workflowCode === 'finishing'"
        :height="3"
      >
        <MDBProgressBar bg="secondary" :value="proposalProgress" />
      </MDBProgress>
      <hr v-else class="my-1">

      <!-- about -->
      <ul class="my-2 list-unstyled list-inline">
        <li class="list-inline-item me-4 h6">
          <i class="bi bi-calendar4 text-secondary me-1"/>
          <span>{{ proposalDate }} - {{ proposalTime }}</span>
        </li>
        <li class="list-inline-item me-4">  
          <i class="far fa-handshake fa-fw text-secondary me-2 mb-3"></i>
          <span class="h6"
            >{{ proposal.quorum }}%</span
          >
        </li>
        <li v-if="proposal.choiceIndex !== ''" class="list-inline-item me-4">
          <i class="bi bi-archive me-1 text-secondary"/>
          <span class="h6">{{
            proposal.choice
          }}</span>
        </li>
        <!-- <li v-for="(choice, index) in proposal.votingStats" :key="index" class="list-inline-item me-4">
          <i class="fas fa-users fa-fw me-2 mb-3"></i>
          <strong class="me-2">{{ t("default.vote_type_" + choice.choice) }}</strong>
          <span class="font-weight-bold text-black">{{ choice.percent }}%</span>
        </li>
        -->
      </ul>

      <!-- Voting stats. -->
      <MDBProgress :height="20" class="rounded">
          <MDBProgressBar
            v-if="proposal.votingStats[0]"
            :value="proposal.votingStats[0].percent"
            :bg="proposal.votingStats[0].bg"
          >
            {{ t("default.vote_type_" + proposal.votingStats[0].choice) }}: {{ proposal.votingStats[0].percent }}%
          </MDBProgressBar>
          <MDBProgressBar
            v-if="proposal.votingStats[1]"
            :value="proposal.votingStats[1].percent"
            :bg="proposal.votingStats[1].bg"
          >
            {{ t("default.vote_type_" + proposal.votingStats[1].choice) }}: {{ proposal.votingStats[1].percent }}%
          </MDBProgressBar>
          <MDBProgressBar
            v-if="proposal.votingStats[0] && proposal.votingStats[1]"
            :value="100 - proposal.votingStats[0].percent - proposal.votingStats[1].percent"
            :bg="'light'"
          >
          </MDBProgressBar>
      </MDBProgress>
      <br/>

      <!-- Workflow -->
      <MDBAccordion v-if="workflowCode === 'accepted'" v-model="activeItem" flush>
        <MDBAccordionItem :headerTitle="t('default.workflow')" collapseId="workflow">
          <Workflow :workflow="proposalWorkflow" />
        </MDBAccordionItem>
      </MDBAccordion>

      <!-- Vote -->
      <div
        v-if="
          workflowCode === 'in_progress'
          && proposal.canVote === true
          && proposal.isVoted === false
        "
      >
        <button @click="vote(proposal.id, 1)" type="button" class="btn btn-outline-success btn-rounded">
          <i class="fas fa-check me-2"></i> {{ t("default.vote_type_yes") }}
        </button>
        <button @click="vote(proposal.id, 2)" type="button" class="btn btn-outline-danger btn-rounded">
          <i class="fas fa-times me-2"></i> {{ t("default.vote_type_no") }}
        </button>
        <!--<button @click="vote(0)" type="button" class="btn btn-dark"> -->
        <!--  <i class="fas fa-trash me-2"></i> {{ t('default.vote_type_spam') }} -->
        <!--</button> -->
      </div>
      <div
        v-else-if="workflowCode === 'finishing'"
        role="group"
      >
        <button v-if="proposal.canVote === true" @click="finish(proposal.id)" type="button" class="btn btn-outline-primary btn-rounded">
          <i class="fas fa-certificate me-2"></i> {{ t("default.close_voting") }}
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import {
  MDBProgress, MDBProgressBar, MDBBadge,
  MDBAccordion, MDBAccordionItem 
  // , MDBCollapse, MDBBtn, MDBIcon
} from "mdb-vue-ui-kit";
import { useI18n } from "vue-i18n";
import { ref, toRefs, inject } from "vue";
import _ from "lodash";

import TextCollapse from '@/components/ui/TextCollapse.vue';
import ProposalHelper from "@/models/dao/ProposalHelper"
import moment from 'moment'
import { useProposal, useProposalCounter, useProposalComputed } from '@/hooks/proposal';
import Workflow from "@/components/dao/Workflow.vue"

export default {
  components: {
    MDBProgress, MDBProgressBar, MDBBadge,
    MDBAccordion, MDBAccordionItem, Workflow,
    // MDBCollapse, MDBBtn, MDBIcon,
    TextCollapse
  },
  props: {
    proposal: {
      type: Object,
      required: true,
    },
    contractId: {
      type: String,
      required: true,
    },
  },
  setup(props) {
    const { proposal } = toRefs(props)
    const loader = inject('loader')
    const dao = inject('dao')

    const { vote, finish } = useProposal(dao, loader)

    const { t } = useI18n();
    const proposalDescription = ref('')
    const proposalDescriptionLoaded = ref(false)
    const collapseDescription = ref(false)
    const workflowCodeMapper = ref(ProposalHelper.workflowCodeBgMapper);

    const { proposalProgress, proposalProgressIntervalId } = useProposalCounter(proposal)
    const { proposalDate, proposalTime, proposalWorkflow } = useProposalComputed(proposal, dao)

    const activeItem = ref('none');

    

    return { t, collapseDescription, workflowCodeMapper, proposalDescription, 
      proposalDescriptionLoaded, proposalProgress, proposalProgressIntervalId, 
      moment, vote, finish, proposalDate, proposalTime, proposalWorkflow, activeItem
    };
  },
  computed: {
    accountId(){
      return this.$store.getters['near/getAccountId']
    },
    nearService() {
      return this.$store.getters["near/getService"];
    },
    ipfsService() {
      return this.$store.getters['ipfs/getService']
    },
    workflowCode() {
      // console.log(this.proposal, this.proposalProgress)
      return ProposalHelper.getStatus(this.proposal.status, this.proposalProgress)
    }
  },
  mounted() {
    //console.log(this.proposal.description)
    // load description from ipfs
    if (_.toString(this.proposal.description).length == 59) {
      //console.log('loading proposal description')
      this.ipfsService.retrieveFiles(this.proposal.description)
      .then(r => {
        //console.log(r)
        r[0].text().then(text => {
          this.proposalDescription = text
          this.proposalDescriptionLoaded = true
        })
      })
      .catch((e) => {
        this.$logger.error('D', 'app@components/dao/Proposal', 'RetrieveFile-ipfs', `Failed to retrieve file from ipfs with IPFS cid [${this.ipfs_cid}]`)
        this.$logger.error('B', 'app@components/dao/Proposal', 'RetrieveFile-ipfs', `Failed to retrieve file from ipfs with IPFS cid [${this.ipfs_cid}]`)
        this.$notify.danger(this.t('default.notify_load_file_ipfs_fail_title'), this.t('default.notify_ipfs_fail') + " " + this.t('default.notify_load_file_ipfs_fail_message'))
        this.$notify.flush()
        console.error(e)})
    } else {
      this.proposalDescription = '' // this.proposal.description
      this.proposalDescriptionLoaded = true
    }
  }
};
</script>