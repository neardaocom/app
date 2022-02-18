<template>
  <div class="container mb-2">
    <div class="row">
      <div class="col-12 col-md-6 col-lg-4 mb-4">
        <div class="card text-start w-auto p-2" style="width: 18rem">
          <div class="card-body">
            <ul class="list-unstyled text-muted mb-1">
              <li>
                <i class="fas fa-wallet fa-fw me-3 mb-3"></i>
                <a
                  class="text-reset font-weight-bold"
                  :href="nearWalletUrl + '/accounts/' + dao.wallet"
                  target="_blank"
                  >{{ t("default.wallet") }}</a
                >
              </li>
              <li v-if="webLink">
                <i class="fas fa-globe fa-fw me-3 mb-3"></i
                ><a class="text-reset font-weight-bold" :href="web" target="_blank">{{ webLink }}</a>
              </li>
              <li>
                <i class="fas fa-money-bill-wave-alt fa-fw me-3 mb-3"></i>
                <span class="text-reset font-weight-bold">{{ n(dao.treasury.token.meta.amount) }}</span> {{ dao.treasury.token.meta.short }}
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div class="col-12 col-md-6 col-lg-4 mb-4">
        <div class="card text-start w-auto p-2" style="width: 18rem">
          <div class="card-body">
            <ul class="list-unstyled text-muted mb-1">
              <li>
                <i class="fas fa-users fa-fw me-3 mb-3"></i>
                <strong>{{ t("default.council") }}</strong>
                {{ councilPercent || "0" }}%
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div class="col-12 col-md-6 col-lg-4 mb-4">
        <div class="card text-start w-auto p-2" style="width: 18rem">
          <div class="card-body">
            <h6 class="text-muted text-center">{{ t("default.council") }}</h6>
            <ul class="mb-0">
              <li v-for="(member, index) in council.members" :key="index">{{ member.accountId }}</li>
            </ul>
          </div>
        </div>
      </div>
      <!-- BEGIN: council unlocking cashflow -->
      <div v-if="council" class="col-12 col-md-6 mb-4">
        <div class="card text-start w-auto p-2" style="width: 18rem">
          <div class="card-body">
            <h6 class="text-muted text-center">{{ t("default.council_unlocking_token") }}</h6>
            <ChartCouncilUnlocking :dao="dao" :group="council"/>
          </div>
        </div>
      </div>
      <!-- END: council unlocking cashflow -->
    </div>
  </div>
</template>

<script>
//import NumberFormatter from "@/components/NumberFormatter.vue"
import { useI18n } from "vue-i18n";
import ChartCouncilUnlocking from '@/components/dao/about/ChartCouncilUnlocking.vue';
//import Proposal from "@/components/dao/Proposal.vue"
//import { transform } from '@/models/proposal';
import { ref } from "vue"
//import _ from "lodash"
import { useLinks, useGroups } from "@/hooks/dao";
import { useIPFSService } from "@/hooks/vuex";
import { fetch } from "@/models/ipfs";

export default {
  components: {
    ChartCouncilUnlocking
    //MDBProgress, MDBProgressBar,
    //NumberFormatter,
    //Proposal
  },
  props: {
    dao: {
      type: Object,
      required: true,
    },
  },
  computed: {
    nearWalletUrl() {
      return this.$store.getters['near/getWalletUrl']
    },
  },
  setup(props) {
    const { t, n } = useI18n();

    const ipfsService = useIPFSService()

    const {
        web
    } = useLinks(props.dao)

    const webLink = ref(null)
    if (web) fetch(web, ipfsService.value).then(r => {webLink.value = r})


    // console.log(web)

    const {
      council, councilPercent
    } = useGroups(props.dao)

    //console.log(council)

    return { t, n, web, webLink, council, councilPercent };
  },
};
</script>