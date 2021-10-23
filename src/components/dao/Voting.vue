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
    <!-- Proposal in progress -->
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
            <MDBCheckbox :label="filterState.inProgress.name" inline v-model="filterState.inProgress.active"/>
            <MDBCheckbox :label="filterState.accepted.name" inline v-model="filterState.accepted.active"/>
          </div>
          <div class="col-6 col-md-4 col-lg-2 text-end">
            <MDBSelect v-model:options="order.options" v-model:selected="order.selected" />
          </div>
        </div>
      </div>
    </div>
    <div class="row">
      <div v-for="(proposal, index) in results" :key="index" class="col-12 col-md-6 mb-4 mb-md-0">
        <section class="mb-4 text-start">
          <Proposal :proposal="proposal" :contractId="dao.wallet"/>
        </section>
      </div>
    </div>
  </div>
</template>

<script>
import { MDBInput, MDBCheckbox, MDBIcon, MDBSelect } from "mdb-vue-ui-kit";
import { ref, toRefs } from "vue"
import { reactive } from "@vue/reactivity"
import { useI18n } from "vue-i18n"
import Proposal from "@/components/dao/Proposal.vue"
import { transform } from '@/models/proposal';
import _ from "lodash"
import { toSearch } from '@/utils/string'

export default {
  components: {
    MDBInput, MDBCheckbox, MDBIcon, MDBSelect
    , Proposal
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
  },
  setup(props) {
    const { dao, accountId } = toRefs(props)
    const { t } = useI18n();

    const proposals = dao.value.proposals.map((proposal) => transform(proposal, dao.value.docs, dao.value.token_holders, dao.value.token_holded, accountId.value, t))

    const searchQuery = ref('')
    const filterState = reactive({
      inProgress: {
        name: t('default.vote_status_in_progress'),
        state: 'in_progress',
        active: false,
      },
      accepted: {
        name: t('default.vote_status_accepted'),
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
    return { t, proposals, searchQuery, filterState, order };
  },
  computed: {
    results() {
      let results = this.proposals
      // filter
      const filterStates = Object.values(this.filterState).filter(item => item.active).map(item => item.state)
      if (filterStates.length > 0) {
        results = results.filter(item => _.intersection([item.stateIndex], filterStates).length > 0)
      }
      // searching
      const searchText = toSearch(this.searchQuery)
      if (searchText.length > 2) {
        results = results.filter(item => item.search.includes(searchText))
      }
      // order
      switch (this.order.selected) {
        case 'created_desc':
          results = _.orderBy(results, ['id'], ['desc'])
          break;
        case 'created_asc':
          results = _.orderBy(results, ['id'], ['asc'])
          break;
        default:
          break;
      }
      return results
    },
  },
  methods: {
  }
};
</script>