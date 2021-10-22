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
      <div v-for="(proposal, index) in dao.proposals" :key="index" class="col-12 col-md-6 mb-4 mb-md-0">
        <section class="mb-4 text-start">
          <Proposal :proposal="proposal[1]" :proposalId="proposal[0]" :contractId="dao.wallet" :token_holders="dao.token_holders" :token_blocked="dao.token_released - dao.token_free" :docs="dao.docs"/>
        </section>
      </div>
    </div>
  </div>
</template>

<script>
import { MDBInput, MDBCheckbox, MDBIcon, MDBSelect } from "mdb-vue-ui-kit";
import { ref, toRefs, watch } from "vue"
import { reactive } from "@vue/reactivity"
import { useI18n } from "vue-i18n"
import Proposal from "@/components/dao/Proposal.vue"

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
  },
  setup(props) {
    const { dao } = toRefs(props)
    const { t } = useI18n();
    let orderedProposals = ref({})

    const orderProposal = () => { orderedProposals = dao.proposals.sort((a, b) => b[1].uuid - a[1].uuid) }

    watch(orderedProposals, orderProposal)

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
    return { t, orderedProposals, searchQuery, filterState, order };
  },
  computed: {
    //listOrderDesc() {
    //  return this.dao.proposals.sort((a, b) => b[1].uuid - a[1].uuid)
    //},
  },
  methods: {
  }
};
</script>