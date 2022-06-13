<template>
  <!-- VOTING -->
  <div v-if="showVoting" class="d-flex">
    <!-- left -->
    <div class="">
      <span class="fs-5 text-muted text-center">#{{ workflow.id }}</span>
    </div>
    <!-- body -->
    <div class="flex-fill ms-3">
      <!-- HEAD -->
      <div class="row">
        <div class="col-10">
          <div class="fs-5" v-html="proposalVoting.title"></div>
          <div class="mt-n2 small">{{ proposalVoting.type }}</div>
        </div>
        <div class="col-2 text-right">
          <!-- TODO: Voting -->
        </div>
      </div>
    </div>
  </div>
  <div v-if="showVoting" class="row">
    <div class="col-12">
      <hr class="mt-1 mb-3"/>
    </div>
  </div>
  <!-- End VOTING -->

  <!-- Activities -->
  <div class="row" v-for="(log) in activityLogs" :key="log.id">
    <div class="col-1 text-center">
      <MDBBadge color="info" pill class="p-2 me-3c"><i class="bi bi-box"></i></MDBBadge>
    </div>
    <div class="col-10 mb-3">
        <div class="text-muted small">{{ toDate(log.txSignedAt) }} - {{ toTime(log.txSignedAt) }}</div>
        <div class="fs-5 fw-bold mt-n2">{{ t('default.wf_templ_' + template.code + '_v' + template.version + '_' + log.activity.code) }}</div>
        <div class="mt-n1 small">
          {{ t('default.signed_by') }}<span class="ms-1 fw-bolder">{{ log.txSigner }}</span>
          <template v-if="t('default.wf_templ_' + template.code + '_v' + template.version + '_' + log.activity.code + '_args', log.args).length > 0">
            <span class="mx-2 text-muted">|</span>
            <span v-html="t('default.wf_templ_' + template.code + '_v' + template.version + '_' + log.activity.code + '_args', log.args)" />
          </template>
        </div>
    </div>
    <div class="col-1">
    </div>
  </div>
  <!-- END Activities -->

  <!-- NEXT Activity-->
  <div v-if="workflow.state === 'running' && check(walletRights, activityNextsRights)" class="row">
    <div class="col-1 text-center">
      <MDBBadge color="muted" pill class="p-2 me-3c"><i class="fas fa-check"></i></MDBBadge>
    </div>
    <div class="col-11">
      <div class="row">
        <div class="col-12">
          <span v-if="false" class="me-2">{{ t('default.activity') }}:</span>
          <MDBBtnGroup v-if="activityNexts.length > 0">
            <template v-for="(option, index) in nextActivitiesOptions" :key="index">
              <MDBRadio
                v-if="check(walletRights, option.rights)"
                :btnCheck="true" :wrap="false" labelClass="btn btn-secondary btn-sm"
                :label="option.text"
                :name="'nextActivity-' + workflow.id"
                :value="option.value"
                v-model="formNextActivityId"
              />
            </template>
          </MDBBtnGroup>
          <template v-if="workflow.activityLastId !== undefined && canFinish === true">
            <span v-if="activityNexts.length > 0" class="ms-3 me-3 text-uppercase">{{ t('default.or') }}</span>
            <button class="btn btn-info btn-sm rounded-pill" @click.prevent="finish()">{{ t('default.wf_finish') }}</button>
          </template>
        </div>
      </div>
      <!-- FORM -->

      <component :is="componentName" v-bind="componentProps" @flush="formFlush"></component>

      <!-- END FORM -->
      <div class="row">
        <div class="col-12 mt-2" v-if="activityNexts.length > 0">
          <button class="btn btn-outline-secondary btn-rounded btn-sm" @click.prevent="run()"><i class="fas fa-play me-2"></i>{{ t('default.wf_sign_and_execute') }}</button>
        </div>
      </div>
    </div>
  </div>
  <div v-else-if="workflow.state === 'finished'" class="row">
    <div class="col-1">
      <MDBBadge color="info" pill class="p-2 me-3"><i class="fas fa-check me-2"></i> {{ t('default.wf_finished') }}</MDBBadge>
    </div>
  </div>
  <!-- NEXT Activity -->

</template>

<script>
import {
  MDBBtnGroup, MDBRadio, MDBBadge,
} from "mdb-vue-ui-kit";
import { useI18n } from "vue-i18n";
import { toRefs, inject, ref } from "vue";
import loToNumber from "lodash/toNumber";
import { metaGetActivityForm } from "@/models/workflow";
import Rights from "@/models/dao/Rights";
import DateHelper from '@/models/utils/DateHelper'
import { useDaoWorkflow, useWorkflow } from '@/hooks/workflow'

export default {
  components: {
    MDBBtnGroup, MDBRadio, MDBBadge,
  },
  props: {
    workflow: {
      type: Object,
      required: true,
    },
    showVoting: {
      type: Boolean,
      required: false,
      default: false,
    }
  },
  setup(props) {
    const { t, d, n } = useI18n();

    const { workflow } = toRefs(props)
    const loader = inject('loader')
    const dao = inject('dao')
    const wallet = inject('wallet')
    const walletRights = inject('walletRights')
    const templateMeta = inject('templateMeta')

    const { daoWorkflow } = useDaoWorkflow(loader, dao, workflow)
    const { proposalVoting, template, canFinish, activityNexts, activityLogs, activityNextsRights, nextActivitiesOptions } = useWorkflow(daoWorkflow, templateMeta, wallet, walletRights)

    const check = Rights.check

    const formNextActivityId = ref(nextActivitiesOptions.value.length > 0 ? nextActivitiesOptions.value[0].value.toString() : '')

    return {
      t, d, n, daoWorkflow, proposalVoting, template, check,
      walletRights, nextActivitiesOptions,
      activityLogs, activityNexts, activityNextsRights, canFinish,
      formNextActivityId,
    };
  },
  computed: {
    componentName() {
      return metaGetActivityForm(this.template.code, 'wf_add')?.component
    },
    componentProps() {
      return {schema: metaGetActivityForm(this.template.code, 'wf_add')?.schema(this.data)}
    }
  },
  methods: {
    run() {
      this.daoWorkflow.runActivity(loToNumber(this.formNextActivityId))
    },
    finish() {
      this.daoWorkflow.finish()
    },
    toTime(value) {
      return DateHelper.format(value, DateHelper.formatTime)
    },
    toDate(value) {
      return DateHelper.format(value, DateHelper.formatDateLong)
    },
    formFlush(values) {
      // console.log('fromFlush', values)
      this.data.form = values
    }
  },
};
</script>

<style scoped>

ul.timeline-3 {
  list-style-type: none;
  position: relative;
}

ul.timeline-3:before {
  content: ' ';
  background: #d4d9df;
  display: inline-block;
  position: absolute;
  left: 29px;
  width: 2px;
  height: 100%;
  z-index: 400;
}

ul.timeline-3 > li {
  margin: 20px 0;
  padding-left: 20px;
}

ul.timeline-3 > li:before {
  content: ' ';
  background: white;
  display: inline-block;
  position: absolute;
  border-radius: 50%;
  border: 3px solid #22c0e8;
  left: 20px;
  width: 20px;
  height: 20px;
  z-index: 400;
}

ul.timeline-3 > li.last:before {
  border: 3px solid #000;
}

ul.timeline-3 > li.separator:before {
  display: none;
}

.timelineItem::before {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    display: block;
    width: 2px;
    content: "";
    background-color: #22c0e8;
}
</style>