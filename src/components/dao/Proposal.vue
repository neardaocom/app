<template>
  <div class="card">
    <div class="card-body">
      <!-- header -->
      <h6 class="card-title mt-1 mb-1">
        <small class="me-2 text-muted">#{{ proposal.uuid }}</small
        >{{ t("default." + type) }}
      </h6>
      <!-- progress or status -->
      <MDBProgress
        v-if="proposal.status === 'InProgress' && isOver() === false"
        :height="4"
      >
        <MDBProgressBar :value="progress" bg="primary" />
      </MDBProgress>
      <span
        v-else-if="proposal.status === 'Accepted'"
        class="badge bg-success mb-2"
        >{{ t("default.vote_status_accepted") }}</span
      >
      <span
        v-else-if="proposal.status === 'Rejected'"
        class="badge bg-danger mb-2"
        >{{ t("default.vote_status_rejected") }}</span
      >
      <span v-else-if="proposal.status === 'Spam'" class="badge bg-dark mb-2">{{
        t("default.vote_status_spam")
      }}</span>
      <span
        v-else-if="proposal.status === 'Invalid'"
        class="badge bg-info mb-2"
        >{{ t("default.vote_status_invalid") }}</span
      >
      <span
        v-else
        class="badge bg-danger mb-2"
        >{{ t("default.vote_status_executing") }}</span
      >
      <!-- body -->
      <p
        class="mt-2 mb-0"
        v-html="t('default.' + type + '_message', typeArgs)"
      />
      <!-- Desctiption -->
      <section v-if="descriptionWords.length > 0" aria-expanded="true">
        <MDBBtn color="link" size="sm"
          @click="collapseDescription = !collapseDescription"
          :aria-controls="'collapsibleDescription' + proposal.uuid"
          :aria-expanded="collapseDescription"
        >
          <MDBIcon icon="align-left" class="me-2"></MDBIcon>{{ t('default.description') }}
        </MDBBtn>
        <MDBCollapse
          :id="'collapsibleDescription' + proposal.uuid"
          v-model="collapseDescription"
        >
          <div class="my-2 mx-2" v-html="proposal.description">
          </div>
        </MDBCollapse>
      </section>
      <!-- about -->
      <ul class="mt-2 list-unstyled text-muted">
        <li>
          <i class="far fa-calendar fa-fw me-3 mb-3"></i> {{ toDateString }}
          <span class="font-weight-bold">{{ toTimeString }}</span>
        </li>
        <li>
          <i class="far fa-handshake fa-fw me-3 mb-3"></i>
          <span class="font-weight-bold"
            >{{ proposal.vote_config.quorum }}%</span
          >
        </li>
        <li v-if="choice !== ''">
          <i class="fas fa-vote-yea fa-fw me-3 mb-3"></i>
          <span class="font-weight-bold text-black">{{
            t("default.vote_type_" + choice)
          }}</span>
        </li>
        <li v-for="(choice, index) in results" :key="index">
          <strong>{{ t("default.vote_type_" + choice.choice) }}</strong>
          <MDBProgress :height="18">
            <MDBProgressBar :value="choice.percent" :bg="choice.bg"
              >{{ choice.percent }}%</MDBProgressBar
            >
          </MDBProgress>
        </li>
        <li>&nbsp;</li>
      </ul>
      <div
        v-if="
          canVote === true &&
          proposal.status === 'InProgress' &&
          isOver() === false &&
          isVoted() === false
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
        v-else-if="canVote === true && isOver() === true"
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
//import { toRefs } from "vue";
import { MDBProgress, MDBProgressBar, MDBCollapse, MDBBtn, MDBIcon } from "mdb-vue-ui-kit";
import { useI18n } from "vue-i18n";
import { ref } from "vue";
import Decimal from "decimal.js";

import { yoctoNear } from "@/services/nearService/constants";
import {
  getProposalKind,
  getProposalTitle,
} from "@/services/nearService/utils";
import { parseFromNanoseconds, toDateString, toTimeString } from "@/utils/date";
import { getWords } from "@/utils/string";

export default {
  components: {
    MDBProgress,
    MDBProgressBar,
    MDBCollapse, MDBBtn, MDBIcon
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
    proposalId: {
      type: Number,
      required: true,
    },
    token_holders: {
      type: Object,
      required: true,
    },
    token_blocked: {
      type: Number,
      required: true,
    },
    docs: {
      type: Object,
      required: true,
    },
  },
  setup() {
    // const { proposal } = toRefs(props)
    const collapseDescription = ref(false);
    const { t } = useI18n();
    return { t, collapseDescription };
  },
  computed: {
    durationTo() {
      return parseFromNanoseconds(this.proposal.vote_config.duration_to);
    },
    toDateString() {
      return toDateString(this.durationTo);
    },
    toTimeString() {
      return toTimeString(this.durationTo);
    },
    progress() {
      let progress = undefined;
      if (this.proposal.status === "InProgress") {
        const end = this.durationTo.valueOf();
        const now = new Date().valueOf();
        // TODO: get from config of dao
        // let beginDate = this.durationTo
        // beginDate.setMonth(this.durationTo.getMonth() - 1)
        // const begin = beginDate.valueOf()
        const begin = this.durationTo.valueOf() - 7 * 86400000;
        const nowFromBegin = now - begin;
        const endFromBegin = end - begin;
        console.log(begin);
        console.log(now);
        console.log(end);
        if (endFromBegin >= 0) {
          progress = new Decimal(nowFromBegin)
            .div(endFromBegin)
            .times(100)
            .round()
            .toNumber();
        }
      }
      return progress;
    },
    results() {
      let results = { 0: 0, 1: 0, 2: 0 };
      Object.keys(this.proposal.votes).forEach((voter) => {
        results[this.proposal.votes[voter]] += this.token_holders[voter] ?? 0;
      });

      return [
        {
          choice: "yes",
          percent: new Decimal(results[1])
            .div(this.token_blocked)
            .times(100)
            .round()
            .toNumber(),
          bg: "success",
        },
        {
          choice: "no",
          percent: new Decimal(results[2])
            .div(this.token_blocked)
            .times(100)
            .round()
            .toNumber(),
          bg: "danger",
        },
        // {choice: 'spam', percent: new Decimal(results[0]).div(this.token_blocked).times(100).round().toNumber(), bg: 'black'}
        // {choice: this.choice(), percent: 20}
      ];
    },
    canVote() {
      return Object.keys(this.token_holders).includes(this.accountId);
    },
    choice() {
      let kind_to_choice = "";
      switch (this.proposal.votes[this.accountId]) {
        case 0:
          kind_to_choice = "spam";
          break;
        case 1:
          kind_to_choice = "yes";
          break;
        case 2:
          kind_to_choice = "no";
          break;
        default:
          break;
      }
      return kind_to_choice;
    },
    type() {
      //console.log((getProposalKind(this.proposal)))
      let type = "";
      switch (getProposalKind(this.proposal)) {
        case "SendNear":
          type = "payout";
          break;
        case "AddMember":
          type = "add_member";
          break;
        case "RemoveMember":
          type = "remove_member";
          break;
        case "GeneralProposal":
          type = "general_proposal";
          break;
        case "AddFile":
          type = "add_doc_file";
          break;
        case "InvalidateFile":
          type = "invalidate_file";
          break;
        default:
          break;
      }
      return type;
    },
    typeArgs() {
      let args = {};
      const actions = this.proposal.transactions.actions[0];
      const action_key = Object.keys(actions)[0];
      switch (action_key) {
        case "SendNear":
          args = {
            account: actions.SendNear.account_id,
            amount: new Decimal(actions.SendNear.amount_near)
              .div(yoctoNear)
              .toFixed(),
          };
          break;
        case "AddMember":
          args = {
            account: actions.AddMember.account_id,
            group: this.groupTranslate(actions.AddMember.group),
          };
          break;
        case "RemoveMember":
          args = {
            account: actions.RemoveMember.account_id,
            group: this.groupTranslate(actions.RemoveMember.group),
          };
          break;
        case "GeneralProposal":
          args = {
            title: actions.GeneralProposal.title
          };
          break;
        case "AddFile":
          args = {
            name: actions.AddFile.metadata.name,
            ipfs_cid: actions.AddFile.uuid,
            category:
              actions.AddFile.new_category ??
              this.docs.map.categories[actions.AddFile.metadata.category],
          };
          break;
        case "InvalidateFile":
          {
            let doc_file = this.docs.files.find(
              (elem) => elem.address == actions.InvalidateFile.uuid
            );
            args = {
              name: doc_file.name + doc_file.ext,
              category: doc_file.category,
            };
          }

          break;
        default:
          break;
      }
      return args;
    },
    proposalTitle() {
      let title = getProposalTitle(this.proposal);
      return title;
    },
    nearService() {
      return this.$store.getters["near/getService"];
    },
    accountId() {
      return this.$store.getters["near/getAccountId"];
    },
    descriptionWords() {
      return getWords(this.proposal.description)
    }
  },
  methods: {
    isOver() {
      if (this.proposal.status === "InProgress") {
        const end = this.durationTo.valueOf();
        const now = new Date().valueOf();
        return now > end;
      }
      return false;
    },
    isVoted() {
      return Object.keys(this.proposal.votes).includes(this.accountId);
    },
    groupTranslate(value) {
      let trans = "";
      switch (value) {
        case "Insiders":
          trans = this.t("default.council");
          break;
        case "Community":
          trans = this.t("default.community");
          break;
        case "Foundation":
          trans = this.t("default.investor");
          break;
        default:
          break;
      }
      return trans;
    },
    vote(choice) {
      console.log(choice);
      this.nearService
        .vote(this.contractId, this.proposalId, choice)
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
  mounted() {},
};
</script>