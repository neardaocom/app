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
    <div class="row">
      <div v-for="(proposal, index) in dao.proposals" :key="index" class="col-md-6 mb-4 mb-md-0">
        <section class="mb-4 text-start">
          <Proposal :proposal="proposal[1]" :proposalId="proposal[0]" :contractId="dao.wallet" :token_holders="dao.token_holders" :token_blocked="dao.token_released - dao.token_free"/>
        </section>
      </div>
    </div>
  </div>
</template>

<script>
//import { MDBProgress, MDBProgressBar } from "mdb-vue-ui-kit";
import { ref, toRefs, watch } from "vue";
import { useI18n } from "vue-i18n";
import Proposal from "@/views/dao/Proposal.vue";

export default {
  components: {
    // MDBProgress, MDBProgressBar,
    Proposal
  },
  props: {
    dao: {
      type: Object,
      required: true,
    },
  },
  setup(props) {
    const { dao } = toRefs(props)
    let orderedProposals = ref({})

    const orderProposal = () => { orderedProposals = dao.proposals.sort((a, b) => b[1].uuid - a[1].uuid) }

    watch(orderedProposals, orderProposal)

    const { t } = useI18n();
    return { t, orderedProposals };
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