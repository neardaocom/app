<template>
  <div class="card">
    <div class="card-body">

      <!-- header -->
      <div class="d-flex mb-3 ">
        <div class="align-self-center">
            <span class="fs-6 text-white p-2 rounded-circle bg-primary text-center background-light-gray">
              #{{ proposal.id }}
            </span>
        </div>

        <div class="p-2">
           <h6>{{ proposal.type }}</h6>
            <div
              class="mt-n2 text-dark fs-5"
              v-html="proposal.title"
            />
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
        <MDBProgressBar bg="secondary" :value="progress" />
      </MDBProgress>
      <hr v-else class="my-1">

      <!-- about -->
      <ul class="my-2 list-unstyled text-muted list-inline">
        <li class="list-inline-item me-4 h6">
          <i class="bi bi-calendar4 color-secondary me-1"/> {{moment(proposal.duration.value).format("MMMM D, YYYY")}} -
          <span>{{ proposal.duration.time }}</span>
        </li>
        <li class="list-inline-item me-4">  
          <i class="far fa-handshake fa-fw color-secondary me-2 mb-3"></i>
          <span class="h6"
            >{{ proposal.quorum }}%</span
          >
        </li>
        <li v-if="proposal.choiceIndex !== ''" class="list-inline-item me-4">
          <i class="bi bi-archive me-1 color-secondary"/>
          <span class="h6 text-muted">{{
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

      <!-- Vote -->
      <div
        v-if="
          workflowCode === 'in_progress'
          && proposal.canVote === true
          && proposal.isVoted === false
        "
      >
        <button @click="vote(1)" type="button" class="btn btn-outline-success btn-rounded">
          <i class="fas fa-check me-2"></i> {{ t("default.vote_type_yes") }}
        </button>
        <button @click="vote(2)" type="button" class="btn btn-outline-danger btn-rounded">
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
        <button v-if="proposal.canVote === true" @click="finalize()" type="button" class="btn btn-outline-primary btn-rounded">
          <i class="fas fa-certificate me-2"></i> {{ t("default.close_voting") }}
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import {
  MDBProgress, MDBProgressBar, MDBBadge
  // , MDBCollapse, MDBBtn, MDBIcon
} from "mdb-vue-ui-kit";
import { useI18n } from "vue-i18n";
import { ref, toRefs, onMounted, onUnmounted } from "vue";
import _ from "lodash";

import TextCollapse from '@/components/TextCollapse.vue';
import { workflowCodeBgMapper, getProgress, getWorkflowCode } from '@/models/proposal';
import moment from 'moment'

export default {
  components: {
    MDBProgress, MDBProgressBar, MDBBadge,
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
    const { t } = useI18n();
    const proposalDescription = ref('')
    const proposalDescriptionLoaded = ref(false)
    const collapseDescription = ref(false)
    const workflowCodeMapper = ref(workflowCodeBgMapper);

    const progress = ref(proposal.value.progress)
    const progressCounter = () => {
      progress.value = getProgress(proposal.value.status, proposal.value.templateSettings, proposal.value.duration.value)
      // console.log('Progress: ' + progress.value)
    }
    const progressInterval = ref(null);

    onMounted(() => {
      progressInterval.value = setInterval(progressCounter, 5_000)
      //console.log('mounted')
    })

    onUnmounted(() => {
      clearInterval(progressInterval.value)
      //console.log('unmounted')
    })

    return { t, collapseDescription, workflowCodeMapper, proposalDescription, proposalDescriptionLoaded, progress, progressInterval, moment };
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
      return getWorkflowCode(this.proposal.status, this.progress)
    }
  },
  methods: {
    vote(choice) {
      // console.log(choice);
      this.nearService
        .vote(this.contractId, this.proposal.id, choice)
        .then((r) => {
          console.log(r);
        })
        .catch((e) => {
          this.$logger.error('D', 'app@components/dao/Proposal', 'Vote-blockchain', `User [${this.accountId}] could not vote in the proposal [${this.proposal.id}]`)
          this.$logger.error('B', 'app@components/dao/Proposal', 'Vote-blockchain', `User [${this.accountId}] could not vote in the proposal [${this.proposal.id}]`)
          this.$notify.danger(this.t('default.notify_proposal_voting_fail_title'), this.t('default.notify_blockchain_fail') + " " +  this.t('default.notify_proposal_voting_fail_message' , {proposal: this.proposal.title}))
          this.$notify.flush()
          console.log(e);
        });
    },
    finalize() {
      this.nearService
        .finalize(this.contractId, this.proposal.id)
        .then((r) => {
          console.log(r);
        })
        .catch((e) => {
          this.$logger.error('D', 'app@components/dao/Proposal', 'Finalize-blockchain', `User [${this.accountId}] could not finalize proposal [${this.proposal.id}`)
          this.$logger.error('B', 'app@components/dao/Proposal', 'Finalize-blockchain', `User [${this.accountId}] could not finalize proposal [${this.proposal.id}`)
          this.$notify.danger(this.t('default.notify_proposal_finalize_fail_title'), this.t('default.notify_blockchain_fail') + " " +  this.t('default.notify_proposal_finalize_fail_message', {proposal: this.proposal.title}))
          this.$notify.flush()
          console.log(e);
        });
    },
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