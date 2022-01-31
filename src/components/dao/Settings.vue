<template>
  <div class="container mb-2">
  </div>
</template>

<script>
// import { MDBInput, MDBIcon, MDBSelect } from "mdb-vue-ui-kit";
//import { ref } from "vue"
//import { reactive } from "@vue/reactivity"
import { useI18n } from "vue-i18n"
//import { payoutAtStart, payoutAfterPayNear, payoutFinished } from "@/data/workflow"
//import Workflow from "@/components/dao/Workflow.vue"
///import orderBy from "lodash/orderBy"
//import { toSearch } from '@/utils/string'

export default {
  components: {
    // MDBInput, MDBIcon, MDBSelect, Workflow
  },
  props: {
    dao: {
      type: Object,
      required: true,
    },
  },
  setup() {
    const { t } = useI18n();

    return { t };
  },
  methods: {
  }
};
</script>