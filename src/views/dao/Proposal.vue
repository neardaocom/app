<template>
  <div class="card">
    <div class="card-body">
      <h5 class="card-title mt-1 mb-1">{{ t('default.' + proposal.type) }}</h5>
      <MDBProgress v-if="proposal.state === 'in_progress'" :height="4">
        <MDBProgressBar :value="progress" bg="primary" />
      </MDBProgress>
      <span v-else-if="proposal.state === 'accepted'" class="badge bg-success mb-2">{{ t('default.vote_state_accepted') }}</span>
      <span v-else-if="proposal.state === 'rejected'" class="badge bg-danger mb-2">{{ t('default.vote_state_rejected') }}</span>
      <span v-else-if="proposal.state === 'spam'" class="badge bg-dark mb-2">{{ t('default.vote_state_spam') }}</span>
      <span v-else-if="proposal.state === 'invalid'" class="badge bg-info mb-2">{{ t('default.vote_state_invalid') }}</span>
      <p class="mt-2" v-html="t('default.' + proposal.type + '_message', proposal.args)"/>
      <ul class="list-unstyled text-muted">
        <li>
          <i class="far fa-calendar fa-fw me-3 mb-3"></i> 15.9.2021
          <span class="font-weight-bold">10:00</span>
        </li>
        <li v-for="(choice, index) in results" :key="index">
          <strong>{{ t('default.vote_type_' + choice.choice) }}</strong>
          <MDBProgress :height="18">
            <MDBProgressBar :value="choice.percent" :bg="choice.bg"
              >{{ choice.percent }}%</MDBProgressBar
            >
          </MDBProgress>
        </li>
        <li>&nbsp;</li>
      </ul>
      <div v-if="proposal.state === 'in_progress'" class="btn-group" role="group">
        <button type="button" class="btn btn-primary">
          <i class="fas fa-check me-2"></i> {{ t('default.vote_type_yes') }}
        </button>
        <button type="button" class="btn btn-primary">
          <i class="fas fa-times me-2"></i> {{ t('default.vote_type_no') }}
        </button>
        <button type="button" class="btn btn-dark">
          <i class="fas fa-trash me-2"></i> {{ t('default.vote_type_spam') }}
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { MDBProgress, MDBProgressBar } from "mdb-vue-ui-kit";
import { useI18n } from "vue-i18n";

export default {
  components: {
    MDBProgress,
    MDBProgressBar,
  },
  props: {
    proposal: {
      type: Object,
      required: true,
    },
  },
  setup() {
    const { t } = useI18n();
    return { t };
  },
  computed: {
    progress() {
      return this.proposal.state === 'in_progress' ? 30 : undefined
    },
    results() {
      return [
          {choice: 'yes', percent: 20, bg: 'success'},
          {choice: 'no', percent: 50, bg: 'danger'},
          {choice: 'spam', percent: 10, bg: 'black'}
          // {choice: this.choice(), percent: 20}
      ]
    }
  },
  methods: {
    choice() {
      let kind_to_choice = ''
      switch (this.proposal.kind) {
        case 0:
          kind_to_choice = 'spam'
          break;
        case 1:
          kind_to_choice = 'yes'
          break;
        case 2:
          kind_to_choice = 'no'
          break;
        default:
          break;
      }
      return kind_to_choice
    }
  }
};
</script>