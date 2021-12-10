<template>
    <section class="row d-flex justify-content-between align-items-center py-1"> <!-- py-3 -->
      <!-- Left -->
      <div class="col-12 col-lg-9">
        <router-link :to="{ name: 'dao', params: {id: dao.wallet}, query: {page: 'overview' }}" :class="[isActive('overview') ? 'bg-light border-bottom border-2 border-primary rounded-0' : 'text-reset']" class="btn btn-link btn-lg px-3" data-mdb-ripple-color="dark">
          {{ t('default.dashboard') }}
        </router-link>
        <router-link :to="{ name: 'dao', params: {id: dao.wallet}, query: {page: 'voting' }}" :class="[isActive('voting') ? 'bg-light border-bottom border-2 border-primary rounded-0' : 'text-reset']" class="btn btn-link btn-lg px-3" data-mdb-ripple-color="dark">
          {{ t('default.voting') }}
        </router-link>
        <router-link v-if="false" :to="{ name: 'dao', params: {id: dao.wallet}, query: {page: 'treasury' }}" :class="[isActive('treasury') ? 'bg-light border-bottom border-2 border-primary rounded-0' : 'text-reset']" class="btn btn-link btn-lg px-3" data-mdb-ripple-color="dark">
          {{ t('default.treasury') }}
        </router-link>
        <router-link v-if="false" :to="{ name: 'dao', params: {id: dao.wallet}, query: {page: 'members' }}" :class="[isActive('members') ? 'bg-light border-bottom border-2 border-primary rounded-0' : 'text-reset']" class="btn btn-link btn-lg px-3" data-mdb-ripple-color="dark">
          {{ t('default.members') }}
        </router-link>
        <router-link v-if="false" :to="{ name: 'dao', params: {id: dao.wallet}, query: {page: 'tokens' }}" :class="[isActive('tokens') ? 'bg-light border-bottom border-2 border-primary rounded-0' : 'text-reset']" class="btn btn-link btn-lg px-3" data-mdb-ripple-color="dark">
          {{ t('default.tokens') }}
        </router-link>
        <router-link :to="{ name: 'dao', params: {id: dao.wallet}, query: {page: 'documents' }}" :class="[isActive('documents') ? 'bg-light border-bottom border-2 border-primary rounded-0' : 'text-reset']" class="btn btn-link btn-lg px-3" data-mdb-ripple-color="dark">
          {{ t('default.documents') }}
        </router-link>
        <router-link :to="{ name: 'dao', params: {id: dao.wallet}, query: {page: 'about' }}" :class="[isActive('about') ? 'bg-light border-bottom border-2 border-primary rounded-0' : 'text-reset']" class="btn btn-link btn-lg px-3" data-mdb-ripple-color="dark">
          {{ t('default.about') }}
        </router-link>
      </div>
      <!-- Left -->

      <!-- Right -->
      <div v-if="accountRole != 'guest'" class="col-12 col-lg-3">
        <!--<button type="button" class="btn btn-light bg-light px-3 me-2" data-mdb-ripple-color="dark">
          <i class="fas text-warning fa-star"></i>
        </button>-->
        <!--<button type="button" class="btn btn-light bg-light px-3 me-2" data-mdb-ripple-color="dark">
          <i class="fas fa-ellipsis-h"></i>
        </button>-->
        <MDBDropdown btnGroup :align="['end']" v-model="dropdownAction">
          <MDBBtn aria-controls="modalPayout" @click="modalPayoutOpen()" class="btn btn-primary" data-mdb-ripple-color="dark">
            <MDBIcon icon="paper-plane" class="pe-2"/>{{ t('default.payout')}}
          </MDBBtn>
          <MDBDropdownToggle split @click="dropdownAction = !dropdownAction" />
          <MDBDropdownMenu>
            <MDBDropdownItem v-if="false" tag="button" @click="modalAddMemberOpen()"><MDBIcon icon="user-plus" class="pe-2"/>{{ t('default.add_member')}}</MDBDropdownItem>
            <MDBDropdownItem tag="button" @click="modalAddCouncilOpen()"><MDBIcon icon="user-plus" class="pe-2"/>{{ t('default.add_council')}}</MDBDropdownItem>
            <MDBDropdownItem v-if="false" tag="button" @click="modalRemoveMemberOpen()"><MDBIcon icon="user-minus" class="pe-2"/>{{ t('default.remove_member')}}</MDBDropdownItem>
            <MDBDropdownItem tag="button" @click="modalRemoveCouncilOpen()"><MDBIcon icon="user-minus" class="pe-2"/>{{ t('default.remove_council')}}</MDBDropdownItem>
            <MDBDropdownItem tag="button" @click="modalAddDocumentOpen()"><MDBIcon icon="folder-plus" class="pe-2"/>{{ t('default.add_document')}}</MDBDropdownItem>
            <MDBDropdownItem v-if="false" tag="button" @click="modalRemoveDocumentOpen()"><MDBIcon icon="folder-minus" class="pe-2"/>{{ t('default.remove_document')}}</MDBDropdownItem>
            <MDBDropdownItem tag="button" @click="modalGeneralOpen()"><MDBIcon icon="comments" class="pe-2"/>{{ t('default.general_proposal')}}</MDBDropdownItem>
            <MDBDropdownItem v-if="accountRole == 'council'" tag="button" @click="unlockTokens('Council')"><MDBIcon icon="unlock" class="pe-2"/>{{ t('default.unlock_tokens')}}</MDBDropdownItem>
            <MDBDropdownItem v-if="accountRole == 'council'" tag="button" @click="distributeToCouncilTokens()"><MDBIcon icon="hand-holding-usd" class="pe-2"/>{{ t('default.token_withdraw')}}</MDBDropdownItem>
            <MDBDropdownItem v-if="possibleUpgrade" divider />
            <MDBDropdownItem class="bg-danger"  v-if="possibleUpgrade" tag="button" @click="modalUpgradeOpen()"><MDBIcon icon="sync" class="pe-2"/>{{ t('default.upgrade_contract')}}</MDBDropdownItem>
          </MDBDropdownMenu>
        </MDBDropdown>
      </div>
      <!-- /Right -->
    </section>

    <ModalPayout :show="modalPayout" :contractId="dao.wallet" :tokenName="dao.token_name" />
    <ModalAddMember v-if="false" :show="modalAddMember" :contractId="dao.wallet" :groups="dao.groups" :tokenHolders="dao.token_holders" />
    <ModalAddCouncil :show="modalAddCouncil" :contractId="dao.wallet" :groups="dao.groups" :tokenHolders="dao.token_holders" />
    <ModalRemoveMember :show="modalRemoveMember" :contractId="dao.wallet" :groups="dao.groups" :tokenHolders="dao.token_holders" />
    <ModalRemoveCouncil :show="modalRemoveCouncil" :contractId="dao.wallet" :groups="dao.groups" :tokenHolders="dao.token_holders" />
    <ModalAddDocument :show="modalAddDocument" :contractId="dao.wallet" :groups="dao.groups" :tokenHolders="dao.token_holders" :docs="dao.docs" />
    <ModalRemoveDocument :show="modalRemoveDocument" :contractId="dao.wallet" :groups="dao.groups" :tokenHolders="dao.token_holders" />
    <ModalGeneral :show="modalGeneral" :contractId="dao.wallet" :groups="dao.groups" :tokenHolders="dao.token_holders" />
    <ModalUpgrade :show="modalUpgrade" :contractId="dao.wallet" />
</template>

<script>
import { ref } from "vue";
import { useI18n } from "vue-i18n";
import ModalPayout from '@/components/dao/ModalPayout'
import ModalAddDocument from '@/components/dao/ModalAddDocument'
import ModalAddMember from '@/components/dao/ModalAddMember'
import ModalAddCouncil from '@/components/dao/ModalAddCouncil'
import ModalRemoveDocument from '@/components/dao/ModalRemoveDocument'
import ModalRemoveMember from '@/components/dao/ModalRemoveMember'
import ModalRemoveCouncil from '@/components/dao/ModalRemoveCouncil'
import ModalGeneral from '@/components/dao/ModalGeneral'
import ModalUpgrade from '@/components/dao/ModalUpgrade';
import {
  MDBDropdown, MDBDropdownToggle, MDBDropdownMenu, MDBDropdownItem,
  MDBBtn,
  MDBIcon,
} from "mdb-vue-ui-kit";

export default {
  components: {
    MDBDropdown, MDBDropdownToggle, MDBDropdownMenu, MDBDropdownItem,
    MDBBtn, MDBIcon, ModalPayout, ModalAddMember, ModalRemoveMember, ModalAddDocument, ModalRemoveDocument, ModalGeneral,
    ModalAddCouncil, ModalRemoveCouncil, ModalUpgrade
  },
  props: {
    dao: {
      type: Object,
      required: true
    },
    accountRole: {
      type: String,
      required: true,
    },
  },
  setup() {
    const { t } = useI18n();
    const modalPayout = ref(0)
    const modalAddDocument = ref(0)
    const modalAddMember = ref(0)
    const modalAddCouncil = ref(0)
    const modalRemoveDocument = ref(0)
    const modalRemoveMember = ref(0)
    const modalRemoveCouncil = ref(0)
    const modalGeneral = ref(0)
    const modalUpgrade = ref(0)
    const dropdownAction = ref(false);
    const latestDaoVersion = ref(0)

    return {
      t, dropdownAction, modalPayout, modalAddMember, modalAddCouncil, modalRemoveMember, modalRemoveCouncil, modalAddDocument, modalRemoveDocument, modalGeneral,
      latestDaoVersion, modalUpgrade
    };
  },

  mounted() {
    this.getLatestDaoVersion()
  },

  computed: {
    accountId() {
      return this.$store.getters['near/getAccountId']
    },
    canVote() {
      return Object.keys(this.dao.token_holders).includes(this.accountId)
    },
    nearService() {
      return this.$store.getters['near/getService']
    },
    possibleUpgrade(){
      return this.dao.version < this.latestDaoVersion &&  Object.values(this.dao.groups.council.wallets).includes(this.accountId)
    }
  },

  methods: {
    isActive(button_page) {
      return button_page === (this.$route.query.page || 'overview')
    },
    modalPayoutOpen() {
      this.modalPayout += 1
      this.dropdownAction = false
    },
    modalAddMemberOpen() {
      this.modalAddMember += 1
      this.dropdownAction = false
    },
    modalAddCouncilOpen() {
      this.modalAddCouncil += 1
      this.dropdownAction = false
    },
    modalRemoveMemberOpen() {
      this.modalRemoveMember += 1
      this.dropdownAction = false
    },
    modalRemoveCouncilOpen() {
      this.modalRemoveCouncil += 1
      this.dropdownAction = false
    },
    modalAddDocumentOpen() {
      this.modalAddDocument += 1
      this.dropdownAction = false
    },
    modalRemoveDocumentOpen() {
      this.modalRemoveDocument += 1
      this.dropdownAction = false
    },
    modalGeneralOpen() {
      this.modalGeneral += 1
      this.dropdownAction = false
    },
    modalUpgradeOpen() {
      this.modalUpgrade += 1
      this.dropdownAction = false
    },
    getLatestDaoVersion(){
      this.nearService.getDaoStats()
       .then(r => {
          this.latestDaoVersion = r.latest_dao_version
        })
        .catch((e) => {
          console.log(e)
        })
    },
    unlockTokens(group) {
      console.log(group)
      // this.nearService.unlockAllTokens(this.dao.wallet).then((r) => {
      this.nearService.unlockTokens(this.dao.wallet, group).then((r) => {
        console.log(r)
      }).catch((e) => {
        console.log(e)
      });
      this.dropdownAction = false
    },
    distributeToCouncilTokens() {
      this.nearService.distributeFt(
        this.dao.wallet,
        this.dao.token_stats.council.free,
        'Council',
        this.dao.groups.council.wallets,
        null,
        0.5
      ).then((r) => {
        console.log(r)
      }).catch((e) => {
        console.log(e)
      });
      this.dropdownAction = false
    },
  }
};
</script>