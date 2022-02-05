<template>
  <div class="container mb-2">
    <div class="card mb-3">
      <div class="card-body">
        <div class="row">
          <div class="col-6 col-md-4 col-lg-3">
            <MDBInput
              inputGroup
              :formOutline="false"
              class="rounded"
              v-model="searchQuery"
              aria-describedby="search-addon"
              :aria-label="t('default.search')"
              :placeholder="t('default.search')"
            >
              <template #prepend>
                <span class="input-group-text border-0" id="search-addon"><MDBIcon icon="search" iconStyle="fas" /></span>
              </template>
            </MDBInput>
          </div>
          <div class="col-12 col-md-4 col-lg-7 text-start pt-1 ps-4">
          </div>
          <div class="col-6 col-md-4 col-lg-2 text-end">
            <MDBSelect v-model:options="order.options" v-model:selected="order.selected" />
          </div>
        </div>
      </div>
    </div>
    <div class="row">
      <div v-for="(workflow, index) in results" :key="index" class="col-12 mb-4 mb-md-0">
        <section class="mb-4 text-start">
          <Workflow :workflow="workflow" :template="template(dao.templates, workflow.templateId)" />
        </section>
      </div>
    </div>
  </div>
</template>

<script>
import { MDBInput, MDBIcon, MDBSelect } from "mdb-vue-ui-kit";
import { ref } from "vue"
import { reactive } from "@vue/reactivity"
import { useI18n } from "vue-i18n"
import Workflow from "@/components/dao/activities/Workflow.vue"
import orderBy from "lodash/orderBy"
import { toSearch } from '@/utils/string'
import { getTemplate } from "@/models/workflow";

export default {
  components: {
    MDBInput, MDBIcon, MDBSelect, Workflow
  },
  props: {
    dao: {
      type: Object,
      required: true,
    },
    accountId: {
      type: String,
      required: true,
    },
    accountRole: {
      type: String,
      required: true,
    },
  },
  setup() {
    //const { dao, accountId } = toRefs(props)
    const { t } = useI18n();

    const searchQuery = ref('')
    const filterState = reactive({
    })
    const order = reactive({
      selected: 'created_desc',
      options: [
        { text: t('default.order_created_desc'), value: 'created_desc' },
        { text: t('default.order_created_asc'), value: 'created_asc' }
      ],
    })
    return { t, searchQuery, filterState, order };
  },
  computed: {
    results() {
      let results = this.dao.workflows
      // filter
      // searching
      const searchText = toSearch(this.searchQuery)
      if (searchText.length > 2) {
        results = results.filter(item => item.search.includes(searchText))
      }
      // order
      switch (this.order.selected) {
        case 'created_desc':
          results = orderBy(results, ['id'], ['desc'])
          break;
        case 'created_asc':
          results = orderBy(results, ['id'], ['asc'])
          break;
        default:
          break;
      }
      return results
    },
  },
  methods: {
    template(templates, templateId) {
      return getTemplate(templates, templateId)
    }
  }
};
</script>