<template>
  <div class="card">
    <div class="card-body">
      <!-- header -->
      <h5 class="card-title mt-1 mb-1">
        <small class="me-2 text-muted">#{{ workflow.id }}</small>
        {{ template.name }}
      </h5>
      <hr/>
      <ul class="timeline-3">
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
            <div class="row">
              <div class="col-8 col-md-6 col-lg-4 pe-0">
                <MDBBtnGroup>
                  <MDBRadio
                    v-for="(option, index) in optionsNextActivities" :key="index"
                    :btnCheck="true" :wrap="false" labelClass="btn btn-secondary"
                    :label="option.text"
                    :name="'nextActivity-' + workflow.id"
                    :value="option.value"
                    v-model="formNextActivity"
                  />
                </MDBBtnGroup>
              </div>
              <template v-if="activityLast !== undefined && showFinish === true">
                <div class="col-1 ps-2 text-center">
                  {{ t('default.or') }}
                </div>
                <div class="col-4 ps-2">
                    <button  class="btn btn-info">{{ t('default.wf_finish') }}</button>
                </div>
              </template>
            </div>
        </li>
        <li
          v-else-if="activityLast !== undefined && showFinish === true"
          class="last"
        >
          <button  class="btn btn-info">{{ t('default.wf_finish') }}</button>
        </li>
        <li v-else class="last">
          Nothing to do
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import {
  // MDBSelect
  // MDBProgress, MDBProgressBar, MDBBadge
  // , MDBCollapse, MDBBtn, MDBIcon
  MDBBtnGroup, MDBRadio
} from "mdb-vue-ui-kit";
import { useI18n } from "vue-i18n";
import { convertArrayOfObjectToObject } from '@/utils/array'
import { ref, toRefs } from "vue";
// import padEnd from "lodash/padEnd";
import lodashLast from "lodash/last";
import { getActivities, canFinish } from "@/models/workflow";

// import { WFInstance } from '@/types/workflow';

export default {
  components: {
    MDBBtnGroup, MDBRadio
    // MDBProgress, MDBProgressBar, MDBBadge,
    // WFInstance
    // MDBCollapse, MDBBtn, MDBIcon,
    
  },
  props: {
    workflow: {
      type: Object,
      required: true,
    },
    template: {
      type: Object,
      required: true,
    }
  },
  setup(props) {
    const { t, d } = useI18n();
    const { workflow, template } = toRefs(props)

    const activityLogs = ref(getActivities(template.value, workflow.value.activityLogs.map( activity => activity.activityId )))
    const activityNexts = ref(getActivities(template.value, workflow.value.activityNextIds))

    const optionsNextActivities = ref(activityNexts.value.map( (activity) => {
      return { text: activity.name, value: activity.code}
    }))
    const formNextActivity = ref(optionsNextActivities.value.length > 0 ? optionsNextActivities.value[0].value : '')
    // const selectedNextActivity = ref("");

    const showFinish = ref(canFinish(workflow.value))

    return { t, d, formNextActivity, optionsNextActivities, activityNexts, showFinish, activityLogs };
  },
  computed: {
    activityLast() {
      return lodashLast(this.workflow.activityLogs)
    }
  },
  methods: {
    convertInput(inputActivity, inputInstance) {
      return Object.assign(convertArrayOfObjectToObject(inputActivity, 'code', 'value'), convertArrayOfObjectToObject(inputInstance, 'code', 'value'))
    },
    
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