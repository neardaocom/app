<template>
  <div class="card">
    <div class="card-body">
      <div class="row">
        <!-- left -->
        <div class="col-1 text-center">
          <span class="fs-4 bg-info rounded-circle p-2">#{{ workflow.id }}</span>
        </div>
        <!-- body -->
        <div class="col-11">
          <!-- HEAD -->
          <div class="row">
            <div class="col-10">
              <h5>{{ t('default.wf_templ_' + template.code) }}</h5>
              <span class="fs-5" v-html="proposalTitle"></span>
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
              <span class="bg-info rounded-circle px-2 py-1">#{{ index + 1 }}</span>
            </div>
            <div class="col-10">
              <p>
                <span class="text-muted">{{ d(log.txSignedAt) }} {{ toTime(log.txSignedAt) }}</span><br/>
                <span class="fs-5 fw-bold">{{ t('default.wf_templ_' + template.code + '__' + log.activity.code) }}</span><br/>
                {{ t('default.signed_by') }}<span class="ms-1 fw-bolder">{{ log.txSigner }}</span>
                <span class="mx-2 text-muted">|</span><span v-html="t('default.wf_templ_' + template.code + '__' + log.activity.code + '_title', log.args)" />
              </p>
            </div>
            <div class="col-1">
            </div>
          </div>
          <!-- END Activities -->

          <!-- NEXT Activity -->
          <div v-if="workflow.state === 'Running'" class="row">
            <div class="col-1 text-center">
              <MDBBadge color="info" pill class="p-2 me-3"><i class="fas fa-check"></i></MDBBadge>
            </div>
            <div class="col-11">
              <div class="row">
                <div class="col-12">
                  <span v-if="false" class="me-2">{{ t('default.activity') }}:</span>
                  <MDBBtnGroup v-if="activityNexts.length > 0">
                    <template v-for="(option, index) in optionsNextActivities" :key="index">
                      <MDBRadio
                        v-if="true || check(walletRights, [])"
                        :btnCheck="true" :wrap="false" labelClass="btn btn-light btn-sm"
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
                  <button class="btn btn-secondary btn-sm" @click.prevent="run()"><i class="fas fa-play me-2"></i>{{ t('default.wf_sign_and_execute') }}</button>
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
import { convertArrayOfObjectToObject } from '@/utils/array'
import { ref, toRefs, reactive, toRaw } from "vue";
// import padEnd from "lodash/padEnd";
import lodashLast from "lodash/last";
import { canFinish, getSettings, runActivity, getNextActivities, transformLogs, metaGetActivityForm } from "@/models/workflow";
import { getArgs as getProposalArgs } from "@/models/proposal";
import { useNearService } from '@/hooks/vuex';
import { toTimeString } from "@/utils/date";
import { check } from "@/models/rights";

import WfNearSendNearSend from '@/components/dao/workflows/wf_near_send/NearSend.vue'
import WfSkywardRegisterTokens from '@/components/dao/workflows/wf_skyward/RegisterTokens.vue'

export default {
  components: {
    MDBBtnGroup, MDBRadio, MDBBadge,
    // MDBProgress, MDBProgressBar, 
    // WFInstance
    // MDBCollapse, MDBBtn, MDBIcon,
    WfNearSendNearSend, WfSkywardRegisterTokens,
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
  },
  setup(props) {
    const { t, d } = useI18n();
    const { workflow, template } = toRefs(props)

    const settings = reactive(getSettings(template.value, workflow.value.settingsId))

    const data = {
        proposalId: workflow.value.id,
        constants: settings.constants,
        inputs: workflow.value.inputs,
        storageDao: [],
        storage: [],
        form: {},
    }

    const { nearService } = useNearService()

    // const activityLogs = ref(getActivities(template.value, workflow.value.activityLogs.map( activity => activity.activityId )))
    const activityLogs = ref(transformLogs(workflow.value.actionLogs, template.value))
    const activityNexts = ref(getNextActivities(template.value, workflow.value.actionLastId))

    const optionsNextActivities = ref(activityNexts.value.map( (activity) => {
      return { text: t('default.wf_templ_' + template.value.code + '__' + activity.code), value: activity.code, actionFirstId: activity.actionIds[0]}
    }))

    const formNextActivityCode = ref(optionsNextActivities.value.length > 0 ? optionsNextActivities.value[0].value.toString() : '')
    // const selectedNextActivity = ref("");

    const showFinish = ref(canFinish(workflow.value, template.value))


    return { t, d, data, settings, check, formNextActivityCode, optionsNextActivities, activityNexts, showFinish, activityLogs, nearService };
  },
  computed: {
    activityLast() {
      return lodashLast(this.workflow.activityLogs)
    },
    proposalTitle() {
      return this.t('default.wf_templ_' + this.template.code + '_title', getProposalArgs(toRaw(this.proposal), this.template.code, this.t))
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
      return Object.assign(convertArrayOfObjectToObject(inputActivity, 'code', 'value'), convertArrayOfObjectToObject(inputInstance, 'code', 'value'))
    },
    run() {
      runActivity(this.formNextActivityCode, this.workflow, this.template, this.settings, this.nearService, this.accountId, this.data)
    },
    finish() {
      this.nearService.wfFinish(this.accountId, this.proposal.id)
    },
    toTime(value) {
      return toTimeString(value)
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