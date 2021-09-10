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
      <div class="col-md-6 mb-4 mb-md-0">
        <section class="mb-4 text-start">
          <Proposal :proposal="{type: 'payout', state: 'in_progress', args: {account: 'petrfilla.near', amount: 50.22} }"/>
        </section>
      </div>
      <div class="col-md-6 mb-4 mb-md-0">
        <section class="mb-4 text-start">
          <Proposal :proposal="{type: 'payout', state: 'accepted', args: {account: 'petrfilla.near', amount: 50.22} }"/>
        </section>
      </div>
      <div class="col-md-6 mb-4 mb-md-0">
        <section class="mb-4 text-start">
          <Proposal :proposal="{type: 'payout', state: 'rejected', args: {account: 'petrfilla.near', amount: 50.22} }"/>
        </section>
      </div>
      <div class="col-md-6 mb-4 mb-md-0">
        <section class="mb-4 text-start">
          <Proposal :proposal="{type: 'payout', state: 'spam', args: {account: 'petrfilla.near', amount: 50.22} }"/>
        </section>
      </div>
      <div class="col-md-6 mb-4 mb-md-0">
        <section class="mb-4 text-start">
          <Proposal :proposal="{type: 'payout', state: 'invalid', args: {account: 'petrfilla.near', amount: 50.22} }"/>
        </section>
      </div>
    </div>
  </div>
</template>

<script>
//import { MDBProgress, MDBProgressBar } from "mdb-vue-ui-kit";
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
  setup() {
    const { t } = useI18n();
    return { t };
  },
};
</script>