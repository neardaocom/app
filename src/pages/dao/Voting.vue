<template>
  <div class="container mb-2">
    <!-- Filter, checkboxes, order -->
    <div v-if="list.length > 0" class="row my-4 mx-4">
      <div class="col-6 col-md-4 col-lg-3">
        <Search v-model="searchQuery" />
      </div>
      <div class="col-12 col-md-4 col-lg-7 text-start pt-1 ps-4">
        <small> <MDBCheckbox  :label="filterState.inProgress.name" inline v-model="filterState.inProgress.active" class="rounded-3"/> </small>
        <small> <MDBCheckbox  :label="filterState.accepted.name" inline v-model="filterState.accepted.active" class="rounded-3"/> </small>
        <small> <MDBCheckbox  :label="filterState.invalid.name" inline v-model="filterState.invalid.active" class="rounded-3"/> </small>
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
          <Proposal :proposal="proposal" :contractId="dao.wallet" @openResource="open" :fileLoading="fileLoading"/>
        </section>
      </div>
    </div>
    <ModalDocument :show="modalDocument" :doc="selectedDoc" :data="docData"/>
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
import ModalDocument from './modals/ModalDocument.vue'
import {useResourceOpening} from '@/hooks/docs'

export default {
  components: {
    MDBCheckbox, MDBSelect
    , Proposal, Search, NoData, ModalDocument
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

    const ipfsService = loader.value.load('services/ipfs')
    const {fileLoading, selectedDoc, docData, modalDocument, open} = useResourceOpening(ipfsService, dao)

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
      invalid: {
        name: t('default.proposal_state_invalid'),
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
    return { 
      dao, t, list, searchQuery, filterState, order,
      fileLoading, selectedDoc, docData, modalDocument, open
    };
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
        case 'default': {
            results = loOrderBy(results, ['id'], ['desc'])
            //sort
            const sortValue = {
              'in_progress': 0,
              'accepted': 1,
              'rejected': 2,
              'invalid': 3,
            }
            results = results.sort((x, y) => sortValue[x.stateCode] - sortValue[y.stateCode])
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