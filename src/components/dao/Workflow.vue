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
          <span class="h6">{{ activity.name }}</span>
          <span class="float-end">{{ d(activity.txSignedAt) }}</span>
          <p class="mt-2" v-html="t('default.wf_' + workflow.code + '_' + activity.code, convertInput(activity.inputs))"></p>
        </li>
        <li>
          <a href="#!">21 000 Job Seekers</a>
          <p class="mt-2">Curabitur purus sem, malesuada eu luctus eget, suscipit sed turpis. Nam pellentesque felis vitae justo accumsan, sed semper nisi sollicitudin...</p>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import {
  // MDBProgress, MDBProgressBar, MDBBadge
  // , MDBCollapse, MDBBtn, MDBIcon
} from "mdb-vue-ui-kit";
import { useI18n } from "vue-i18n";
import { convertArrayOfObjectToObject } from '@/utils/array'
// import { ref, toRefs, onMounted, onUnmounted } from "vue";
// import _ from "lodash";

// import { WFInstance } from '@/types/workflow';

export default {
  components: {
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
  setup() {
    const { t, d } = useI18n();

    return { t, d };
  },
  computed: {
    
  },
  methods: {
    convertInput(input) {
      return convertArrayOfObjectToObject(input, 'code', 'value')
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
</style>