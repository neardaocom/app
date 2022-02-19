<template>
  <div class="container mb-2">
    <div class="row">
      <div class="col-12 col-md-6 col-lg-4 mb-4">
        <div class="card text-start w-auto p-2" style="width: 18rem">
          <div class="card-body">
            <h5 class="card-title">
              <i class="bi bi-info-square color-primary me-1"/>
              {{ t('default.information') }}
            </h5>
            <ul class="list-unstyled mb-1">
              <li>
                <i class="bi bi-wallet2 me-1"/>
                <a
                  class="text-reset"
                  :href="nearWalletUrl + '/accounts/' + dao.wallet"
                  target="_blank"
                >
                    {{ t("default.wallet") }}
                    <i class="bi bi-box-arrow-up-right color-secondary ms-1"/>
                  </a>
              </li>
              <li v-if="webLink">
                <i class="fas fa-globe fa-fw me-3 mb-3"/>
                <a class="text-reset" :href="web" target="_blank">{{ webLink }}</a>
              </li>
              <li>
                <i class="bi bi-cash-coin me-1"/>
                <span class="text-reset">{{ n(dao.treasury.token.meta.amount) }}</span> {{ dao.treasury.token.meta.short }}
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div class="col-12 col-md-6 col-lg-4 mb-4">
        <div class="card text-start w-auto p-2" style="width: 18rem">
          <div class="card-body">
            <h5 class="card-title">
              <i class="bi bi-people color-primary me-1"/>
              {{ t('default.members') }}
            </h5>
            <ul class="list-unstyled mb-2">
              <li>
                <i class="bi bi-pie-chart me-1"/>
                {{ councilPercent || "0" }}%
                {{ t("default.council") }}
              </li>
            </ul>
            <h6>{{ t("default.council") }}</h6>
            <ul class="mt-n2 list-unstyled">
              <li v-for="(member, index) in council.members" :key="index" class="ms-2">{{ member.accountId }}</li>
            </ul>
          </div>
        </div>
      </div>
      <!-- BEGIN: council unlocking cashflow -->
      <div v-if="council" class="col-12 col-md-6 mb-4">
        <div class="card text-start w-auto p-2" >
          <div class="card-body">
            <h5 class="">
              <i class="bi bi-bar-chart color-primary me-1"/>
              {{ t("default.council_unlocking_token") }}
            </h5>
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
import { useIPFS } from "@/hooks/vuex";
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

    const { ipfsService }= useIPFS()

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