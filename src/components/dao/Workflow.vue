<template>
  <div class="card">
    <div class="card-body">
      <div class="row">
        <!-- left -->
        <div class="col-1 text-center">
          <span class="fs-6 text-muted text-center">#{{ workflow.id }}</span>
        </div>
        <!-- body -->
        <div class="col-11">
          <!-- HEAD -->
          <div class="row">
            <div class="col-10">
              <h5>{{ t('default.wf_templ_' + template.code) }}</h5>
              <div class="mt-n2 " v-html="proposalTitle"></div>
            </div>
            <div class="col-2 text-right">
              <!-- TODO: Voting -->
            </div>
          </div>
          <!-- End HEAD -->

          <!-- Activities -->
          <div class="row">
            <div class="col-12">
              <hr class="mt-1 mb-3"/>
            </div>
          </div>
          <div class="row" v-for="(log, index) in activityLogs" :key="index">
            <div class="col-1 text-center">
              <MDBBadge color="info" pill class="p-2 me-3c"><i class="bi bi-box"></i></MDBBadge>
            </div>
            <div class="col-10 mb-3">
                <div class="text-muted small">{{moment(d(log.txSignedAt)).format("MMMM D, YYYY")}} - {{ toTime(log.txSignedAt) }}</div>
                <div class="fs-5 fw-bold mt-n2">{{ t('default.wf_templ_' + template.code + '__' + log.activity.code) }}</div>
                <div class="mt-n1 small">
                  {{ t('default.signed_by') }}<span class="ms-1 fw-bolder">{{ log.txSigner }}</span>
                  <template v-if="t('default.wf_templ_' + template.code + '__' + log.activity.code + '_title', log.args).length > 0">
                    <span class="mx-2 text-muted">|</span>
                    <span v-html="t('default.wf_templ_' + template.code + '__' + log.activity.code + '_title', log.args)" />
                  </template>
                </div>
            </div>
            <div class="col-1">
            </div>
          </div>
          <!-- END Activities -->

          <!-- NEXT Activity -->
          <div v-if="workflow.state === 'Running' && check(walletRights, activityNextsRights)" class="row">
            <div class="col-1 text-center">
              <MDBBadge color="muted" pill class="p-2 me-3c"><i class="fas fa-check"></i></MDBBadge>
            </div>
            <div class="col-11">
              <div class="row">
                <div class="col-12">
                  <span v-if="false" class="me-2">{{ t('default.activity') }}:</span>
                  <MDBBtnGroup v-if="activityNexts.length > 0">
                    <template v-for="(option, index) in optionsNextActivities" :key="index">
                      <MDBRadio
                        v-if="check(walletRights, option.rights)"
                        :btnCheck="true" :wrap="false" labelClass="btn btn-secondary btn-sm"
                        :label="option.text"
                        :name="'nextActivity-' + workflow.id"
                        :value="option.value"
                        v-model="formNextActivityCode"
                      />
                    </template>
                  </MDBBtnGroup>
                  <template v-if="workflow.actionLastId !== undefined && showFinish === true">
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
          <div v-else-if="workflow.state === 'Finished'" class="row">
            <div class="col-1">
              <MDBBadge color="info" pill class="p-2 me-3"><i class="fas fa-check me-2"></i> {{ t('default.wf_finished') }}</MDBBadge>
            </div>
          </div>
          <!-- NEXT Activity -->
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {
  // MDBSelect
  // MDBProgress, MDBProgressBar, 
  // , MDBCollapse, MDBBtn, MDBIcon
  MDBBtnGroup, MDBRadio, MDBBadge,
} from "mdb-vue-ui-kit";
import { useI18n } from "vue-i18n";
import ArrayHelper from '@/models/utils/ArrayHelper'
import { ref, toRefs, reactive, toRaw } from "vue";
// import padEnd from "lodash/padEnd";
import loLast from "lodash/last";
import loGet from "lodash/get";
import { canFinish, getSettings, runActivity, getNextActivities, getActivityRights, transformLogs, metaGetActivityForm } from "@/models/workflow";
import { getArgs as getProposalArgs } from "@/models/proposal";
import { useNear } from '@/hooks/vuex';
import Date from "@/models/utils/DateHelper";
import Rights from "@/models/dao/Rights";
import loFlatten from "lodash/flatten"
import moment from 'moment'

import WfNearSendNearSend from './workflows/wf_near_send/NearSend.vue'
import WfSkywardRegisterTokens from './workflows/wf_skyward/RegisterTokens.vue'
import WfTreasurySendFtTreasurySendFt from './workflows/wf_treasury_send_ft/TreasurySendFt.vue'

export default {
  components: {
    MDBBtnGroup, MDBRadio, MDBBadge,
    // MDBProgress, MDBProgressBar, 
    // WFInstance
    // MDBCollapse, MDBBtn, MDBIcon,
    WfNearSendNearSend, WfSkywardRegisterTokens, WfTreasurySendFtTreasurySendFt
  },
  props: {
    workflow: {
      type: Object,
      required: true,
    },
    proposal: {
      type: Object,
      required: true,
    },
    template: {
      type: Object,
      required: true,
    },
    accountId: {
      type: String,
      required: true,
    },
    walletRights: {
      type: Object,
      required: true,
    },
    daoStorage: {
      type: Object,
      required: true,
    },
  },
  setup(props) {
    const { t, d, n } = useI18n();
    const { workflow, template, daoStorage, accountId } = toRefs(props)

    const settings = reactive(getSettings(template.value, workflow.value.settingsId))

    const data = {
        daoId: accountId.value,
        proposalId: workflow.value.id,
        constants: settings.constants,
        inputs: workflow.value.inputs,
        storageDao: [],
        storage: loGet(daoStorage.value, [workflow.value.storage]),
        form: {},
    }

    const check = Rights.check

    const { nearService } = useNear()

    // const activityLogs = ref(getActivities(template.value, workflow.value.activityLogs.map( activity => activity.activityId )))
    const activityLogs = ref(transformLogs(workflow.value.actionLogs, template.value))
    const activityNexts = ref(getNextActivities(template.value, workflow.value.actionLastId))
    const activityNextsRights = ref(loFlatten(activityNexts.value.map((activity) => {
      return getActivityRights(settings, activity)
    })))

    // console.log('Check rights', activityNextsRights.value, walletRights.value, check(activityNextsRights.value, walletRights.value))

    const optionsNextActivities = ref(activityNexts.value.map( (activity) => {
      return { text: t('default.wf_templ_' + template.value.code + '__' + activity.code), value: activity.code, rights: getActivityRights(settings, activity)}
    }))

    const formNextActivityCode = ref(optionsNextActivities.value.length > 0 ? optionsNextActivities.value[0].value.toString() : '')
    // const selectedNextActivity = ref("");

    const showFinish = ref(canFinish(workflow.value, template.value))


    return { t, d, n, data, settings, check, formNextActivityCode, optionsNextActivities, activityNexts, activityNextsRights, showFinish, activityLogs, nearService, moment };
  },
  computed: {
    activityLast() {
      return loLast(this.workflow.activityLogs)
    },
    proposalTitle() {
      return this.t('default.wf_templ_' + this.template.code + '_title', getProposalArgs(toRaw(this.proposal), this.template.code, this.t, this.d, this.n))
    },
    componentName() {
      return metaGetActivityForm(this.template.code, this.formNextActivityCode)?.component
    },
    componentProps() {
      return {schema: metaGetActivityForm(this.template.code, this.formNextActivityCode)?.schema(this.data)}
    }
  },
  methods: {
    convertInput(inputActivity, inputInstance) {
      return Object.assign(ArrayHelper.convertArrayOfObjectToObject(inputActivity, 'code', 'value'), ArrayHelper.convertArrayOfObjectToObject(inputInstance, 'code', 'value'))
    },
    run() {
      runActivity(this.formNextActivityCode, this.workflow, this.template, this.settings, this.nearService, this.accountId, this.data)
    },
    finish() {
      this.nearService.wfFinish(this.accountId, this.proposal.id)
    },
    toTime(value) {
      return Date.toTimeString(value)
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