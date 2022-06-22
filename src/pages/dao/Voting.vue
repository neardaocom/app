<template>
  <div class="container mb-2">
    <!-- Order -->
    <!-- <div class="d-flex align-items-center mb-2">
    <hr class="flex-grow-1 my-0" />
    <p class="mb-0 px-2 small">Řadit podle:</p>
    <div class="dropdown">
      <a
        class="link-dark dropdown-toggle font-weight-bold small"
        href="#"
        role="button"
        id="dropdownMenuLink"
        data-mdb-toggle="dropdown"
        aria-expanded="false"
      >
        Vytvořeno
      </a>
      <ul class="dropdown-menu" aria-labelledby="dropdownMenuLink">
        <li><a class="dropdown-item" href="#">Action</a></li>
        <li><a class="dropdown-item" href="#">Another action</a></li>
        <li><a class="dropdown-item" href="#">Something else here</a></li>
      </ul>
    </div>
  </div>-->
    <!-- /Order -->


    <!-- Filter, checkboxes, order -->
    <div v-if="list.length > 0" class="row my-4 mx-4">
      <div class="col-6 col-md-4 col-lg-3">
        <Search v-model="searchQuery" />
      </div>
      <div class="col-12 col-md-4 col-lg-7 text-start pt-1 ps-4">
        <small> <MDBCheckbox  :label="filterStatus.inProgress.name" inline v-model="filterStatus.inProgress.active" class="rounded-3"/> </small>
        <small> <MDBCheckbox  :label="filterStatus.running.name" inline v-model="filterStatus.running.active" class="rounded-3"/> </small>
        <small> <MDBCheckbox  :label="filterStatus.finished.name" inline v-model="filterStatus.finished.active" class="rounded-3"/> </small>
        <small> <MDBCheckbox  :label="filterStatus.invalid.name" inline v-model="filterStatus.invalid.active" class="rounded-3"/> </small>
      </div>
      <div class="col-6 col-md-4 col-lg-2 text-end">
        <MDBSelect size="sm" v-model:options="order.options" v-model:selected="order.selected" />
      </div>
    </div>

    <!-- Proposals -->
    <NoData  v-if="list.length == 0" :text="t('default.no_active_proposal')" hint="This is a hint" />

    <div class="row">
      <div v-for="(proposal) in results" :key="proposal.id" class="col-12 col-md-6 mb-4 mb-md-0">
        <section class="mb-4 text-start">
          <Proposal :proposal="proposal" :contractId="dao.wallet" />
        </section>
      </div>
    </div>
  </div>
</template>

<script>
import { MDBCheckbox, MDBSelect } from "mdb-vue-ui-kit";
import { inject, ref } from "vue"
import { reactive } from "@vue/reactivity"
import { useI18n } from "vue-i18n"
import Proposal from "@/components/dao/Proposal.vue"
import loIntersection from "lodash/intersection"
import loOrderBy from "lodash/orderBy"
import StringHelper from '@/models/utils/StringHelper'
import Search from "@/components/ui/Search.vue";
import { useList } from "@/hooks/proposal"
import NoData from '@/components/ui/NoData.vue'

export default {
  components: {
    MDBCheckbox, MDBSelect
    , Proposal, Search, NoData
  },
  props: {
  },
  setup() {
    const dao = inject('dao')
    const loader = inject('loader')
    const wallet = inject('wallet')
    const walletRights = inject('walletRights')
    const templateMeta = inject('templateMeta')
    const { t } = useI18n();

    const { list } = useList(dao, templateMeta, wallet, walletRights, loader)

    const searchQuery = ref('')
    const filterStatus = reactive({
      inProgress: {
        name: t('default.proposal_status_in_progress'),
        state: 'in_progress',
        active: false,
      },
      running: {
        name: t('default.proposal_status_running'),
        state: 'running',
        active: false,
      },
      finished: {
        name: t('default.proposal_status_finished'),
        state: 'finished',
        active: false,
      },
      invalid: {
        name: t('default.proposal_status_invalid'),
        state: 'invalid',
        active: false,
      },
    })
    const order = reactive({
      selected: 'order_default',
      options: [
        { text: t('default.order_default'), value: 'default' },
        { text: t('default.order_created_desc'), value: 'created_desc' },
        { text: t('default.order_created_asc'), value: 'created_asc' }
      ],
    })
    return { dao, t, list, searchQuery, filterStatus, order };
  },
  computed: {
    results() {
      let results = this.list

      // filter
      const filterStatuses = Object.values(this.filterStatus).filter(item => item.active).map(item => item.state)
      if (filterStatuses.length > 0) {
        results = results.filter(item => loIntersection([item.statusCode], filterStatuses).length > 0)
      }
      // searching
      const searchText = StringHelper.toSearch(this.searchQuery)
      
      if (searchText.length > 2) {
        results = results.filter(item => item.search.includes(searchText))
      }
      // order
      switch (this.order.selected) {
        case 'created_desc':
          results = loOrderBy(results, ['id'], ['desc'])
          break;
        case 'created_asc':
          results = loOrderBy(results, ['id'], ['asc'])
          break;
        case 'default': {
            results = loOrderBy(results, ['id'], ['desc'])
            //sort
            const sortValue = {
              'in_progress': 0,
              'running': 1,
              'finished': 2,
              'rejected': 3,
              'invalid': 4,
            }
            results = results.sort((x, y) => sortValue[x.statusCode] - sortValue[y.statusCode])
          }
          break;
        default:
          break;
      }

      return results
    },
  },
};
</script>