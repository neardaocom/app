<template>
  <div class="card">
    <div class="card-body">
      <!-- header -->
      <h6 class="card-title mt-1 mb-1">
        <small class="me-2 text-muted">#{{ proposal.index }}</small>
        {{ proposal.type }}
        <MDBBadge v-if="proposal.stateIndex !== 'in_progress'" :color="statusMapper[proposal.stateIndex]">{{ proposal.state }}</MDBBadge>
      </h6>
      
      <!-- progress or status -->
      <MDBProgress
        v-if="proposal.stateIndex === 'in_progress'"
        :height="4"
      >
        <MDBProgressBar :value="proposal.progress" bg="primary" />
      </MDBProgress>
      <!-- body -->
      <p
        class="mt-2 mb-0 fs-5 text-dark"
        v-html="proposal.title"
      />
      <hr class="my-1">
      <!-- Desctiption -->
      <TextCollapse :content="loremIpsum()" :limit="1"/> <!-- proposal.description -->
      <!-- about -->
      <ul class="my-2 list-unstyled text-muted list-inline">
        <li class="list-inline-item me-4">
          <i class="far fa-calendar fa-fw me-2 mb-3"></i> {{ proposal.duration.date }}
          <span class="font-weight-bold">{{ proposal.duration.time }}</span>
        </li>
        <li class="list-inline-item me-4">
          <i class="far fa-handshake fa-fw me-2 mb-3"></i>
          <span class="font-weight-bold"
            >{{ proposal.quorum }}%</span
          >
        </li>
        <li v-if="proposal.choice !== ''" class="list-inline-item me-4">
          <i class="fas fa-vote-yea fa-fw me-2 mb-3"></i>
          <span class="font-weight-bold text-black">{{
            proposal.choice
          }}</span>
        </li>
        <li v-for="(choice, index) in proposal.votingStats" :key="index" class="list-inline-item me-4">
          <i class="fas fa-users fa-fw me-2 mb-3"></i>
          <strong class="me-2">{{ t("default.vote_type_" + choice.choice) }}</strong>
          <span class="font-weight-bold text-black">{{ choice.percent }}%</span>
        </li>
      </ul>
      <div
        v-if="
          proposal.canVote === true
          && proposal.status === 'InProgress'
          && proposal.isOver === false
          && proposal.isVoted === false
        "
        class="btn-group"
        role="group"
      >
        <button @click="vote(1)" type="button" class="btn btn-success">
          <i class="fas fa-check me-2"></i> {{ t("default.vote_type_yes") }}
        </button>
        <button @click="vote(2)" type="button" class="btn btn-danger">
          <i class="fas fa-times me-2"></i> {{ t("default.vote_type_no") }}
        </button>
        <!--<button @click="vote(0)" type="button" class="btn btn-dark"> -->
        <!--  <i class="fas fa-trash me-2"></i> {{ t('default.vote_type_spam') }} -->
        <!--</button> -->
      </div>
      <div
        v-else-if="proposal.stateIndex === 'execute'"
        class="btn-group"
        role="group"
      >
        <button @click="finalize()" type="button" class="btn btn-primary">
          <i class="fas fa-certificate me-2"></i> {{ t("default.finalize") }}
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
import { ref } from "vue";

import TextCollapse from '@/components/TextCollapse.vue';
import { statusBgMapper } from '@/models/proposal';

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
  setup() {
    const { t } = useI18n();
    const collapseDescription = ref(false)
    const statusMapper = ref(statusBgMapper);
    return { t, collapseDescription, statusMapper };
  },
  computed: {
    nearService() {
      return this.$store.getters["near/getService"];
    },
  },
  methods: {
    loremIpsum() {
      return 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Phasellus et lorem id felis nonummy placerat. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Integer in sapien. Mauris dictum facilisis augue. Vivamus luctus egestas leo. Nam sed tellus id magna elementum tincidunt. Nulla non arcu lacinia neque faucibus fringilla. Maecenas libero. Fusce dui leo, imperdiet in, aliquam sit amet, feugiat eu, orci.';
    },
    vote(choice) {
      // console.log(choice);
      this.nearService
        .vote(this.contractId, this.proposal.id, choice)
        .then((r) => {
          console.log(r);
        })
        .catch((e) => {
          console.log(e);
        });
    },
    finalize() {
      this.nearService
        .finalize(this.contractId, this.proposalId)
        .then((r) => {
          console.log(r);
        })
        .catch((e) => {
          console.log(e);
        });
    },
  },
};
</script>