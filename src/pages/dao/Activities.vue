<template>
  <div class="container mb-2">
    <div v-if="workflowsNum > 0" class="row my-4 mx-4">
      <div class="col-6 col-md-4 col-lg-3">
        <Search v-model="searchQuery"/>
      </div>
      <div class="col-12 col-md-4 col-lg-7 text-start pt-1 ps-4">
      </div>
      <div class="col-6 col-md-4 col-lg-2 text-end">
        <MDBSelect size="sm" v-model:options="order.options" v-model:selected="order.selected" />
      </div>
    </div>

    <NoData v-if="workflowsNum == 0" :text="t('default.no_active_activities')" hint="This is a hint" />

    <div class="row">
      <div v-for="proposal in results" :key="proposal.id" class="col-12 mb-4 mb-md-0">
        <section v-if="proposal.workflow" class="mb-4 text-start">
          <MDBCard>
            <MDBCardBody>
              <Workflow :proposal="proposal" showVoting />
            </MDBCardBody>
          </MDBCard>
          <!-- :proposal="proposal(workflow.id)" :template="template(dao.templates, workflow.templateId)" :accountId="dao.wallet" :walletRights="walletRights" :daoStorage="dao.storage" -->
        </section>
      </div>
    </div>
  </div>
</template>

<script>
import { MDBSelect, MDBCard, MDBCardBody } from "mdb-vue-ui-kit";
import { inject, ref } from "vue"
import { reactive } from "@vue/reactivity"
import { useI18n } from "vue-i18n"
import Workflow from "@/components/dao/Workflow.vue"
import orderBy from "lodash/orderBy"
import StringHelper from '@/models/utils/StringHelper'
import { getTemplate } from "@/models/workflow";
import loFind from "lodash/find";
import { useRouter } from "@/hooks/dao";
import Search from "@/components/ui/Search.vue"
import NoData from '@/components/ui/NoData.vue'

export default {
  components: {
    MDBSelect, Workflow, Search, NoData,
    MDBCard, MDBCardBody
  },
  props: {
    walletId: {
      type: String,
      required: false,
    },
    walletRights: {
      type: Object,
      required: true,
    },
    daoRights: {
      type: Object,
      required: true,
    },
  },
  setup() {
    const dao = inject('dao')
    const config = inject('config')

    const { t } = useI18n();
    const { rSearch } = useRouter(config)

    const searchQuery = ref(rSearch.value)
    const filterState = reactive({
    })
    const order = reactive({
      selected: 'created_desc',
      options: [
        { text: t('default.order_created_desc'), value: 'created_desc' },
        { text: t('default.order_created_asc'), value: 'created_asc' }
      ],
    })
    return { t, dao, searchQuery, filterState, order };
  },
  computed: {
    results() {
      let results = this.dao.proposals
      // filter
      results = results.filter((item) => item.workflow?.state !== 'waiting')

      // searching
      const searchText = StringHelper.toSearch(this.searchQuery)
      if (searchText.length > 0) {
        results = results.filter((item) => item.workflow.search.includes(searchText))
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
    workflowsNum(){
      return this.dao.proposals.filter((item) => item.workflow?.state !== 'waiting').length
    }
  },
  methods: {
    template(templates, templateId) {
      return getTemplate(templates, templateId)
    },
    proposal(id) {
      return loFind(this.dao.proposals, {id: id})
    },
  }
};
</script>