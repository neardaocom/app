<template>
  <div class="container mb-2">
    <AuctionList
      :scenario="'active'"
    />
    <section v-if="refFinanceFounds">
      <h5 class="text-start">{{ t('ft_market') }}</h5>
      <div v-if="refFinanceFounds" class="col-12 col-md-6 col-lg-4 mb-4">
          <div class="card text-start w-auto p-2" style="width: 18rem">
            <div class="card-body text-center">
              <h5 class="text-muted">{{ t("ref_finance_funds") }}</h5>
              <hr/>
              <h5 v-if="nearPrice && refFinanceFounds[tokenId]" class="text-center">
                <NumberFormatter :amount="refFinanceNear" /> <small class="text-muted">{{tokenSymbol}}</small>
              </h5>
              <h5 v-if="refFinanceFounds[dao.wallet]" class="text-center">
                <NumberFormatter :amount="refFinanceDaoToken" /> <small class="text-muted">{{ dao.token_name }}</small>
              </h5>
              <hr/>
                <div v-if="refFinanceFounds[tokenId] && refFinanceFounds[dao.wallet]" class="d-flex justify-content-center align-self-end">
                  <MDBBtn @click="modalRefWithdrawNearOpen" color="primary">{{`${t('withdraw')} ${tokenSymbol}`}}</MDBBtn>
                  <MDBBtn @click="modalRefWithdrawDaoTokenOpen" color="primary">{{`${t('withdraw')} ${dao.token_name}`}}</MDBBtn>
                  <ModalRefWithdrawNear :show="modalRefWithdrawNear" :contractId="dao.wallet" :balance="refFinanceNear" :tokenId="tokenId" :tokenDecimals="tokenDecimals" :tokenSymbol="tokenSymbol" />
                  <ModalRefWithdrawDaoToken :show="modalRefWithdrawDaoToken" :contractId="dao.wallet" :balance="refFinanceDaoToken" :tokenId="dao.wallet" :tokenDecimals="dao.token_stats.decimals" :tokenSymbol="dao.token_name" />
                </div>  
            </div>
          </div>
      </div>
    </section>
    <SalesList
      v-if="dao.storage.skywardFinance"
    />
    <NoData v-if="!dao.storage.skywardFinance && !refFinanceFounds" :text="t('no_defi')" hint="This is a hint" />

  </div>
</template>

<script>
import { MDBBtn } from "mdb-vue-ui-kit";
import { ref, onMounted, inject } from "vue"
import AuctionList from "@/components/skywardFinance/List.vue"
import SalesList from "@/components/dao/defi/SalesList.vue"
import NumberFormatter from "@/components/ui/NumberFormatter.vue"
import { useI18n } from "vue-i18n"
import ModalRefWithdrawDaoToken from './modals/ModalRefWithdrawDaoToken.vue'
import ModalRefWithdrawNear from './modals/ModalRefWithdrawNear.vue'
import Decimal from 'decimal.js'
import { useRefFinance } from "@/hooks/market";
import NoData from '@/components/ui/NoData.vue'

export default {
  components: {
    MDBBtn,
    AuctionList, SalesList,
    NumberFormatter,
    ModalRefWithdrawDaoToken, ModalRefWithdrawNear,
    NoData
  },
  setup() {
    const dao = inject('dao')
    const wallet = inject('wallet')
    const { t } = useI18n();
    
    // const account = computed(() => store.getters['near/getAccount'])
    // const nearService = computed(() => store.getters['near/getService'])
    // const daoAccount = nearService.value.getNear().account(dao.value.wallet)

    const {
      service, founds: refFinanceFounds, tokenMetadata, tokenId,
      fetchFounds, reloadUp, reloadDown
    } = useRefFinance(wallet, dao.value.wallet)

    // modals
    const modalRefWithdrawDaoToken = ref(0)
    const modalRefWithdrawNear = ref(0)

    const modalRefWithdrawDaoTokenOpen = () => {
        modalRefWithdrawDaoToken.value += 1
    }
    const modalRefWithdrawNearOpen = () => {
        modalRefWithdrawNear.value += 1
    }

    onMounted(() => {
      fetchFounds()
    })

    return {
      dao, t,
      modalRefWithdrawDaoToken, modalRefWithdrawNear,
      modalRefWithdrawDaoTokenOpen, modalRefWithdrawNearOpen,
      service, refFinanceFounds, tokenMetadata, tokenId,
      fetchFounds, reloadUp, reloadDown
    }
  },
  computed: {
    refFinanceNear(){
      return new Decimal(+this.refFinanceFounds[this.tokenId] || 0).dividedBy(10 ** this.tokenDecimals ).toNumber()
    },
    refFinanceDaoToken(){
      return new Decimal(+this.refFinanceFounds[this.dao.wallet] || 0).dividedBy(10 ** this.dao.token_stats.decimals).toNumber()
    },
    tokenSymbol(){
      return this.tokenMetadata ? this.tokenMetadata.symbol : ''
    },
    tokenDecimals(){
      return this.tokenMetadata ? this.tokenMetadata.decimals : 0
    },
    nearPrice() {
      return this.$root.near_price
    },
  },
};
</script>