<template>
  <div class="card">
    <div class="card-body">

      <!-- header -->
      <div class="d-flex">
        <span class="fs-5 text-muted p-2 text-center">
          #{{ proposal.id }}
        </span>       
        <div class="p-2 flex-fill">
          <div class="d-flex">
            <div>
              <div class="fs-5" v-html="proposal.title"></div>
              <div class="mt-n2 small">{{ proposal.type }}</div>
            </div>
            <div class="ms-auto p-1">
              <MDBBadge :color="workflowCodeMapper[statusCode].color" class="text-uppercase" pill><i :class="workflowCodeMapper[statusCode].icon"></i>{{ t('default.proposal_status_' + statusCode) }}</MDBBadge>
              <template v-if="proposal.description">
                <br/>
                <MDBBtn
                  color="link"
                  size="sm"
                  @click="detail()"
                  aria-controls="collapsibleDescription"
                  :aria-expanded="collapseDescription"
                >
                  {{ t('default.detail') }}
                  <MDBSpinner v-if="proposalDescriptionLoading" size="sm" color="primary" class="ms-2"/>
                </MDBBtn>
              </template>
            </div>
          </div>
          <div v-if="proposal.args.resource" class="small">
           {{`${prefix} ${source}`}}
          </div>
          <a v-if="proposal.args.resource" href="#" @click.prevent="open(proposal.args.resource)" class="small">
            {{t('default.open')}}
            <MDBSpinner v-if="fileLoading && clickOpen" size="sm" color="primary" class="ms-2"/>
          </a>
        </div>
      </div>

      <!-- Desctiption -->
      <MDBCollapse id="collapsibleDescription" v-model="collapseDescription">
        <hr class="mt-0 mb-2"/>
        <p v-html="proposalDescription" />
      </MDBCollapse>

      <!-- progress or status -->
      <MDBProgress
        v-if="statusCode === 'in_progress' || statusCode === 'finishing'"
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
            >{{ proposal.approveThreshold }}%</span
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

      <!-- Workflow -->
      <MDBAccordion v-if="statusCode === 'running' || statusCode === 'finished'" v-model="accordionWorkflow" flush>
        <MDBAccordionItem :headerTitle="t('default.activities')" collapseId="workflow" class="mt-0">
          <Workflow :proposal="proposal" />
        </MDBAccordionItem>
      </MDBAccordion>

      <!-- Vote -->
      <div
        v-if="statusCode === 'in_progress' && proposal.canVote === true && proposal.isVoted === false"
        class="mt-2"
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
        v-else-if="statusCode === 'finishing'"
        role="group"
      >
        <button v-if="proposal.canVote === true" @click="finish(proposal.id)" type="button" class="btn btn-outline-primary btn-rounded mt-2">
          <i class="fas fa-certificate me-2"></i> {{ t("default.close_voting") }}
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import {
  MDBProgress, MDBProgressBar, MDBBadge,
  MDBAccordion, MDBAccordionItem, MDBBtn, MDBCollapse,
  MDBSpinner,
} from "mdb-vue-ui-kit";
import { useI18n } from "vue-i18n";
import { ref, toRefs, inject, computed, watch } from "vue";
import ProposalHelper from "@/models/dao/ProposalHelper"
import moment from 'moment'
import { useProposal, useProposalCounter, useProposalComputed } from '@/hooks/proposal';
import Workflow from "@/components/dao/Workflow.vue"

export default {
  components: {
    MDBProgress, MDBProgressBar, MDBBadge,
    MDBAccordion, MDBAccordionItem, Workflow,
    MDBBtn, MDBCollapse,
    MDBSpinner,
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
    fileLoading: {
      type: Boolean,
      required: false,
      default: false
    }
  },
  setup(props, {emit}) {
    const { proposal, fileLoading } = toRefs(props)
    const loader = inject('loader')
    const dao = inject('dao')
    const logger = inject('logger')
    const notify = inject('notify')

    const { vote, finish, fetchDescription } = useProposal(dao, loader)

    const { t } = useI18n();
    const proposalDescription = ref('')
    const proposalDescriptionLoading = ref(false)
    const collapseDescription = ref(false)
    const workflowCodeMapper = ref(ProposalHelper.workflowCodeBgMapper);

    const { proposalProgress, statusCode, proposalProgressIntervalId } = useProposalCounter(proposal)
    const { proposalDate, proposalTime } = useProposalComputed(proposal, dao)

    const accordionWorkflow = ref('none');

    const detail = () => {
      if (proposal.value.description && proposalDescription.value === '') {
        proposalDescriptionLoading.value = true
        //console.log('loading proposal description')
        fetchDescription(proposal.value.description)
        .then(r => {
            proposalDescription.value = r
            proposalDescriptionLoading.value = false
            collapseDescription.value = !collapseDescription.value
        })
        .catch((e) => {
          logger.error('D', 'app@components/dao/Proposal', 'RetrieveFile-ipfs', `Failed to retrieve file from ipfs with IPFS cid [${this.ipfs_cid}]`)
          logger.error('B', 'app@components/dao/Proposal', 'RetrieveFile-ipfs', `Failed to retrieve file from ipfs with IPFS cid [${this.ipfs_cid}]`)
          notify.danger(this.t('default.notify_load_file_ipfs_fail_title'), this.t('default.notify_ipfs_fail') + " " + this.t('default.notify_load_file_ipfs_fail_message'))
          notify.flush()
          console.error(e)
        })
      } else {
        collapseDescription.value = !collapseDescription.value
      }
    }

    const clickOpen = ref(false)
    const open = (resource) => {
        emit('openResource', resource)
        clickOpen.value = true
    }

    watch(fileLoading, (newValue) =>{
      if ( newValue === false){
        clickOpen.value = false
      }
    })

    const source = computed(() => ( proposal.value.args.resource?.source.length > 50 ? proposal.value.args.resource?.source.substring(0, 50) + '...' : proposal.value.args.resource?.source))
    const prefix = computed(() => {
      if (proposal.value.args.resource?.type === 'url')
        return 'Link:'
      else if(proposal.value.args.resource?.type === 'text/plain')
        return 'Text:'
      else
        return ''
   })

    return { t, collapseDescription, workflowCodeMapper, proposalDescription, 
      proposalDescriptionLoading, proposalProgress, proposalProgressIntervalId, 
      moment, vote, finish, fetchDescription, proposalDate, proposalTime, accordionWorkflow,
      detail, statusCode,
      open, clickOpen, source, prefix,
    };
  },
};
</script>
