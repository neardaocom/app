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
          <div class="row" v-for="(log, index) in workflow.actionLogs" :key="index">
            <div class="col-1 text-center">
              <span class="bg-info rounded-circle px-2 py-1">#{{ index + 1 }}</span>
            </div>
            <div class="col-10">
              <p>
                <span class="text-muted">{{ d(log.txSignedAt) }} {{ toTime(log.txSignedAt) }}</span><br/>
                <span class="fs-5 fw-bold">{{ t('default.wf_action_' + log.actionCode) }}</span><br/>
                {{ t('default.signed_by') }}<span class="ms-1 fw-bolder">{{ log.txSigner }}</span>
              </p>
            </div>
            <div class="col-1">
            </div>
          </div>
              <!-- 
              <ul class="timeline-3" v-if="workflow.actionLogs.length > 0">
                <li v-for="(action, index) in workflow.actionLogs" :key="index">
                  <span class="h6">{{ activity.name }}</span> {{ t('default.signed_by') }} <strong class="text-muted">{{ activity.txSigner }}</strong> {{ t('default.at') }} {{ d(activity.txSignedAt) }}
                  <span class="float-end">
                    <a :href="'' + activity.txHash">{{ activity.txHash.substring(0, 7) }}...</a>
                  </span>
                  <p class="mt-2 ms-2 mb-1" v-html="t('default.wf_templ_' + template.code + '_' + activityLogs[index].code, convertInput(activity.inputs, workflow.inputs))"></p>
                  <span class="ms-2">{{ t('default.actions') }}:</span>
                  <dl class="row ms-3">
                    <template v-for="(action, index) in activity.actions" :key="index">
                      <dt class="col-sm-3">{{ index + 1 }}. {{ action.name }}</dt>
                      <dd class="col-sm-9">{{ activity.smartContractId }} > {{ action.smartContractMethod }}</dd>
                    </template>
                  </dl>
                </li>
                <li class="separator" v-if="workflow.actionLogs.length > 0">
                  <hr/>
                </li>
                <li
                  v-if="activityNexts.length > 0"
                  class="last"
                >
                </li>
              </ul>-->
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
                    <MDBRadio
                      v-for="(option, index) in optionsNextActivities" :key="index"
                      :btnCheck="true" :wrap="false" labelClass="btn btn-light btn-sm"
                      :label="option.text"
                      :name="'nextActivity-' + workflow.id"
                      :value="option.value"
                      v-model="formNextActivityId"
                    />
                  </MDBBtnGroup>
                  <template v-if="workflow.actionLastId !== undefined && showFinish === true">
                    <span v-if="activityNexts.length > 0" class="ms-3 me-3 text-uppercase">{{ t('default.or') }}</span>
                    <button class="btn btn-info btn-sm rounded-pill" @click.prevent="finish()">{{ t('default.wf_finish') }}</button>
                  </template>
                </div>
              </div>
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
import { canFinish, getSettings, runActivity, getNextActivities } from "@/models/workflow";
import { getArgs as getProposalArgs } from "@/models/proposal";
import { useNearService } from '@/hooks/vuex';
import { toTimeString } from "@/utils/date";

// import { WFInstance } from '@/types/workflow';

export default {
  components: {
    MDBBtnGroup, MDBRadio, MDBBadge,
    // MDBProgress, MDBProgressBar, 
    // WFInstance
    // MDBCollapse, MDBBtn, MDBIcon,
    
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
    }
  },
  setup(props) {
    const { t, d } = useI18n();
    const { workflow, template } = toRefs(props)

    const settings = reactive(getSettings(template.value, workflow.value.settingsId))

    const { nearService } = useNearService()

    // const activityLogs = ref(getActivities(template.value, workflow.value.activityLogs.map( activity => activity.activityId )))
    const activityLogs = ref([])
    const activityNexts = ref(getNextActivities(template.value, workflow.value.actionLastId))

    const optionsNextActivities = ref(activityNexts.value.map( (activity) => {
      return { text: t('default.wf_templ_' + template.value.code + '_activity_' + activity.code), value: activity.id}
    }))

    const formNextActivityId = ref(optionsNextActivities.value.length > 0 ? optionsNextActivities.value[0].value.toString() : '')
    // const selectedNextActivity = ref("");

    const showFinish = ref(canFinish(workflow.value, template.value))

    return { t, d, settings, formNextActivityId, optionsNextActivities, activityNexts, showFinish, activityLogs, nearService };
  },
  computed: {
    activityLast() {
      return lodashLast(this.workflow.activityLogs)
    },
    proposalTitle() {
      return this.t('default.wf_templ_' + this.template.code + '_title', getProposalArgs(toRaw(this.proposal), this.template.code))
    }
  },
  methods: {
    convertInput(inputActivity, inputInstance) {
      return Object.assign(convertArrayOfObjectToObject(inputActivity, 'code', 'value'), convertArrayOfObjectToObject(inputInstance, 'code', 'value'))
    },
    run() {
      const form = {}
      runActivity(this.formNextActivityId, this.workflow, this.template, this.settings, this.nearService, this.accountId, form)
    },
    finish() {
      this.nearService.wfFinish(this.accountId, this.proposal.id)
    },
    toTime(value) {
      return toTimeString(value)
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