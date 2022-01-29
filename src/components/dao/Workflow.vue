<template>
  <div class="card">
    <div class="card-body">
      <!-- header -->
      <h5 class="card-title mt-1 mb-1">
        <small class="me-2 text-muted">#{{ workflow.id }}</small>
        {{ workflow.name }}
      </h5>
      <hr/>
      <ul class="timeline-3">
        <li v-for="(activity, index) in workflow.activitiesLog" :key="index">
          <span class="h6">{{ activity.name }}</span> {{ t('default.signed_by') }} <strong class="text-muted">{{ activity.txSigner }}</strong> {{ t('default.at') }} {{ d(activity.txSignedAt) }}
          <span class="float-end">
            <a :href="'' + activity.txHash">{{ activity.txHash.substring(0, 7) }}...</a>
          </span>
          <p class="mt-2 ms-2 mb-1" v-html="t('default.wf_' + workflow.code + '_' + activity.code, convertInput(activity.inputs))"></p>
          <span class="ms-2">{{ t('default.actions') }}:</span>
          <dl class="row ms-3">
            <template v-for="(action, index) in activity.actions" :key="index">
              <dt class="col-sm-3">{{ index + 1 }}. {{ action.name }}</dt>
              <dd class="col-sm-9">{{ activity.smartContractId }} > {{ action.smartContractMethod }}</dd>
            </template>
          </dl>
        </li>
        <li class="separator" v-if="workflow.activitiesLog.length > 0">
          <hr/>
        </li>
        <li
          v-if="workflow.activitiesNext.length > 0"
          class="last"
        >
          <template v-if="workflow.activitiesNext.length == 1">
            <span class="h6 border border-1 rounded px-3 py-2">{{ workflow.activitiesNext[0].name }}</span>
            <template v-if="activityLast !== undefined && workflow.ends.includes(activityLast.code)">
              <span class="ms-2 me-2">or</span>
              <button  class="btn btn-info btn-sm">{{ t('default.wf_finish') }}</button>
            </template>
          </template>
          <template v-else>
            <div class="row">
              <div class="col-8 col-md-6 col-lg-4 pe-0">
                <MDBSelect v-model:options="optionsNextActivities" v-model:selected="formNextActivity" />
              </div>
              <div class="col-4 ps-2">
                <template v-if="activityLast !== undefined && workflow.ends.includes(activityLast.code)">
                  <span class="me-2">or</span>
                  <button  class="btn btn-info btn-sm">{{ t('default.wf_finish') }}</button>
                </template>
              </div>
            </div>
          </template>
        </li>
        <li
          v-else-if="activityLast !== undefined && workflow.ends.includes(activityLast.code)"
          class="last"
        >
          <button  class="btn btn-info btn-sm">{{ t('default.wf_finish') }}</button>
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
  MDBSelect
  // MDBProgress, MDBProgressBar, MDBBadge
  // , MDBCollapse, MDBBtn, MDBIcon
} from "mdb-vue-ui-kit";
import { useI18n } from "vue-i18n";
import { convertArrayOfObjectToObject } from '@/utils/array'
import { ref, toRefs } from "vue";
// import padEnd from "lodash/padEnd";
import last from "lodash/last";

// import { WFInstance } from '@/types/workflow';

export default {
  components: {
    MDBSelect
    // MDBProgress, MDBProgressBar, MDBBadge,
    // WFInstance
    // MDBCollapse, MDBBtn, MDBIcon,
    
  },
  props: {
    workflow: {
      type: Object,
      required: true,
    },
  },
  setup(props) {
    const { t, d } = useI18n();
    const { workflow } = toRefs(props)

    const optionsNextActivities = ref(workflow.value.activitiesNext.map( activity => {
      return { text: activity.name, value: activity.code}
    }))
    const formNextActivity = ref(workflow.value.activitiesNext.length > 0 ? workflow.value.activitiesNext[0].code : '')
    // const selectedNextActivity = ref("");

    return { t, d, formNextActivity, optionsNextActivities };
  },
  computed: {
    activityLast() {
      return last(this.workflow.activitiesLog)
    }
  },
  methods: {
    convertInput(input) {
      return convertArrayOfObjectToObject(input, 'code', 'value')
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