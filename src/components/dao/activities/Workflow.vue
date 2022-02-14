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
              <h5>{{ template.name }}</h5>
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
              <ul class="timeline-3" v-if="workflow.activityLogs.length > 0">
                <li v-for="(activity, index) in workflow.activityLogs" :key="index">
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
                <li class="separator" v-if="workflow.activityLogs.length > 0">
                  <hr/>
                </li>
                <li
                  v-if="workflow.activityNextIds.length > 0"
                  class="last"
                >
                </li>
              </ul>
            </div>
          </div>
          <!-- END Activities -->
          <!-- NEXT Activity -->
          <div class="row">
            <div class="col-1">
              <MDBBadge color="info" pill class="p-2 me-3"><i class="fas fa-check"></i></MDBBadge>
            </div>
            <div class="col-11">
              <div class="row">
                <div class="col-12">
                  <span class="me-2">{{ t('default.activity') }}:</span>
                  <MDBBtnGroup v-if="workflow.activityNextIds.length > 0">
                    <MDBRadio
                      v-for="(option, index) in optionsNextActivities" :key="index"
                      :btnCheck="true" :wrap="false" labelClass="btn btn-light btn-sm"
                      :label="option.text"
                      :name="'nextActivity-' + workflow.id"
                      :value="option.value"
                      v-model="formNextActivity"
                    />
                  </MDBBtnGroup>
                  <template v-if="activityLast !== undefined && showFinish === true">
                    <span class="ms-3 me-3 text-uppercase">{{ t('default.or') }}</span>
                    <button class="btn btn-info btn-sm rounded-pill">{{ t('default.wf_finish') }}</button>
                  </template>
                </div>
              </div>
              <div class="row">
                <div class="col-12 mt-2" v-if="workflow.activityNextIds.length > 0">
                  <button class="btn btn-secondary btn-sm" @click.prevent="run()"><i class="fas fa-play me-2"></i>{{ t('default.wf_sign_and_execute') }}</button>
                </div>
              </div>
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
import { getActivities, canFinish, getSettings, runActivity } from "@/models/workflow";
import { getArgs as getProposalArgs } from "@/models/proposal";
import { useNearService } from '@/hooks/vuex';

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

    const activityLogs = ref(getActivities(template.value, workflow.value.activityLogs.map( activity => activity.activityId )))
    const activityNexts = ref(getActivities(template.value, workflow.value.activityNextIds))

    const optionsNextActivities = ref(activityNexts.value.map( (activity) => {
      return { text: activity.name, value: activity.code}
    }))
    const formNextActivity = ref(optionsNextActivities.value.length > 0 ? optionsNextActivities.value[0].value : '')
    // const selectedNextActivity = ref("");

    const showFinish = ref(canFinish(workflow.value))

    return { t, d, settings, formNextActivity, optionsNextActivities, activityNexts, showFinish, activityLogs, nearService };
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
      runActivity(this.formNextActivity, this.workflow, this.template, this.settings, this.nearService, this.accountId, form)
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
</style>