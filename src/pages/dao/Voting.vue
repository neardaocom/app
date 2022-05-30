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
        <small> <MDBCheckbox  :label="filterState.inProgress.name" inline v-model="filterState.inProgress.active" class="rounded-3"/> </small>
        <small> <MDBCheckbox  :label="filterState.accepted.name" inline v-model="filterState.accepted.active" class="rounded-3"/> </small>
      </div>
      <div class="col-6 col-md-4 col-lg-2 text-end">
        <MDBSelect size="sm" v-model:options="order.options" v-model:selected="order.selected" />
      </div>
    </div>

    <!-- Proposals -->
    <section v-if="list.length == 0">
      <hr>
      <h6 class="mb-0 text-start">{{ t("default.no_active_proposal") }}</h6>
    </section>

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

export default {
  components: {
    MDBCheckbox, MDBSelect
    , Proposal, Search
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
    const filterState = reactive({
      inProgress: {
        name: t('default.proposal_state_in_progress'),
        state: 'in_progress',
        active: false,
      },
      accepted: {
        name: t('default.proposal_state_accepted'),
        state: 'accepted',
        active: false,
      },
    })
    const order = reactive({
      selected: 'created_desc',
      options: [
        { text: t('default.order_created_desc'), value: 'created_desc' },
        { text: t('default.order_created_asc'), value: 'created_asc' }
      ],
    })
    return { dao, t, list, searchQuery, filterState, order };
  },
  computed: {
    results() {
      let results = this.list
      // filter
      const filterStates = Object.values(this.filterState).filter(item => item.active).map(item => item.state)
      if (filterStates.length > 0) {
        results = results.filter(item => loIntersection([item.stateCode], filterStates).length > 0)
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
        default:
          break;
      }

      return results
    },
  },
};
</script>