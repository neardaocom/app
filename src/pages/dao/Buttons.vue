<template>
    <section class="d-flex justify-content-between align-items-center buttons_nav"> <!-- py-3 -->
      <!-- Left -->
      <div class="ps-3">
        <router-link :to="{ name: 'dao', params: {id: dao.wallet}, query: {page: 'overview' }}" :class="[isActive('overview') ? 'border-bottom border-2 border-secondary text-secondary rounded-0 fw-bolder' : 'text-reset']" class="btn btn-link btn-lg px-3 fw-bolder" data-mdb-ripple-color="dark">
          <i class="bi bi-columns-gap me-1"/>
          {{ t('default.dashboard') }}
        </router-link>
        <router-link :to="{ name: 'dao', params: {id: dao.wallet}, query: {page: 'voting' }}" :class="[isActive('voting') ? 'border-bottom border-2 border-secondary text-secondary rounded-0' : 'text-reset']" class="btn btn-link btn-lg px-3 fw-bolder" data-mdb-ripple-color="dark">
          <i class="bi bi-bar-chart me-1"/>
          {{ t('default.voting') }}
        </router-link>
        <router-link :to="{ name: 'dao', params: {id: dao.wallet}, query: {page: 'activities' }}" :class="[isActive('activities') ? 'border-bottom border-2 border-secondary text-secondary rounded-0' : 'text-reset']" class="btn btn-link btn-lg px-3 fw-bolder" data-mdb-ripple-color="dark">
          <i class="bi bi-check2-circle me-1"/>
          {{ t('default.in_progress') }}
        </router-link>
        <router-link  :to="{ name: 'dao', params: {id: dao.wallet}, query: {page: 'rewards' }}" :class="[isActive('rewards') ? 'border-bottom border-2 border-secondary text-secondary rounded-0' : 'text-reset']" class="btn btn-link btn-lg px-3 fw-bolder" data-mdb-ripple-color="dark">
          <i class="bi bi-coin me-1"/>
          {{ t('default.rewards') }}
        </router-link>
        <router-link v-if="false" :to="{ name: 'dao', params: {id: dao.wallet}, query: {page: 'members' }}" :class="[isActive('members') ? 'border-bottom border-2 border-secondary text-secondary rounded-0' : 'text-reset']" class="btn btn-link btn-lg px-3 fw-bolder" data-mdb-ripple-color="dark">
          {{ t('default.members') }}
        </router-link>
        <router-link v-if="false" :to="{ name: 'dao', params: {id: dao.wallet}, query: {page: 'tokens' }}" :class="[isActive('tokens') ? 'border-bottom border-2 border-secondary text-secondary rounded-0' : 'text-reset']" class="btn btn-link btn-lg px-3 fw-bolder" data-mdb-ripple-color="dark">
          {{ t('default.tokens') }}
        </router-link>
        <router-link v-if="false" :to="{ name: 'dao', params: {id: dao.wallet}, query: {page: 'defi' }}" :class="[isActive('defi') ? 'border-bottom border-2 border-secondary text-secondary rounded-0' : 'text-reset']" class="btn btn-link btn-lg px-3 fw-bolder" data-mdb-ripple-color="dark">
          <i class="bi bi-graph-up me-1"/>
          {{ t('default.dApps') }}
        </router-link>
        <router-link :to="{ name: 'dao', params: {id: dao.wallet}, query: {page: 'resources' }}" :class="[isActive('resources') ? 'border-bottom border-2 border-secondary text-secondary rounded-0' : 'text-reset']" class="btn btn-link btn-lg px-3 fw-bolder" data-mdb-ripple-color="dark">
          <i class="bi bi-files me-1"/>
          {{ t('default.resources') }}
        </router-link>
        <router-link v-if="false" :to="{ name: 'dao', params: {id: dao.wallet}, query: {page: 'about' }}" :class="[isActive('about') ? 'border-bottom border-2 border-secondary text-secondary rounded-0' : 'text-reset']" class="btn btn-link btn-lg px-3 fw-bolder" data-mdb-ripple-color="dark">
          <i class="bi bi-info-square me-1"/>
          {{ t('default.about') }}
        </router-link>
        <router-link v-if="false" :to="{ name: 'dao', params: {id: dao.wallet}, query: {page: 'settings' }}" :class="[isActive('settings') ? 'border-bottom border-2 border-secondary text-secondary rounded-0' : 'text-reset']" class="btn btn-link btn-lg px-3 fw-bolder" data-mdb-ripple-color="dark">
          <i class="bi bi-gear me-1"/>
          {{ t('default.settings') }}
        </router-link>
        <router-link :to="{ name: 'dao', params: {id: dao.wallet}, query: {page: 'treasury' }}" :class="[isActive('treasury') ? 'border-bottom border-2 border-secondary text-secondary rounded-0' : 'text-reset']" class="btn btn-link btn-lg px-3 fw-bolder" data-mdb-ripple-color="dark">
          <i class="bi bi-wallet2 me-1"/>
          {{ t('default.treasury') }}
        </router-link>
        <router-link :to="{ name: 'dao', params: {id: dao.wallet}, query: {page: 'governance' }}" :class="[isActive('governance') ? 'border-bottom border-2 border-secondary text-secondary rounded-0' : 'text-reset']" class="btn btn-link btn-lg px-3 fw-bolder" data-mdb-ripple-color="dark">
          <i class="bi bi-hammer me-1"/>
          {{ t('default.governance') }}
        </router-link>
      </div>
      <!-- Left -->

      <!-- Right -->
      <div>
        <!-- <MDBBtnGroup  id="dropdown-target">
          <MDBBtn
            color="primary"
            v-on:click="dropdownAction = !dropdownAction"
            class="dropdown-toggle"
          ><MDBIcon icon="ellipsis-h" class="pe-2"/>{{ t('default.activities') }}&nbsp;&nbsp;</MDBBtn> -->

          <MDBDropdown v-model="dropdownAction" btnGroup class="buttons_dropdown" >
            <MDBDropdownToggle class="buttons_dropdown bg-gradient-140 fs-6"  size="lg" @click="dropdownAction = !dropdownAction">
              <MDBIcon v-if="false" icon="ellipsis-h" class="pe-2"/><span class="me-2">{{ t('default.actions')}}</span>
            </MDBDropdownToggle>
            <MDBDropdownMenu>
              <template v-for="templ in dao.templates" :key="templ.id">
                <template v-for="templSettings in templ.settings" :key="templSettings.id">
                  <template v-if="[''].includes(templ.code) === false">
                    <MDBDropdownItem v-if="check(walletRights, templSettings.proposeRights) && templ.code!=='wf_ft_distribute' && templ.code!=='wf_add'" tag="button" @click.prevent="modalOpen(templ, templSettings)"><MDBIcon v-if="false" icon="user-plus" class="pe-2"/>{{ t('default.wf_templ_' + templ.code) }}</MDBDropdownItem>
                  </template>
                </template>
              </template>
              <MDBDropdownItem v-if="installedWorkflow('lock1') === true" tag="button" @click.prevent="createLockSimple('Council commissions', 5, 100000)"><MDBIcon icon="vote-yea" class="pe-2"/>{{ t('default.test_lock_simple') }}</MDBDropdownItem>
              <MDBDropdownItem v-if="installedWorkflow('reward2') === true" tag="button" @click.prevent="createSalary(1, 0.0001, 1, 60, 2)"><MDBIcon icon="vote-yea" class="pe-2"/>{{ t('default.test_salary') }}</MDBDropdownItem>
            </MDBDropdownMenu>
          </MDBDropdown>
        <!-- </MDBBtnGroup> -->

      </div>
      <!-- /Right -->
    </section>

    <!-- Modals -->
    <ModalProposal :title="modalTitle" :show="modalProposal" @submit="vote" :submitText="t('default.vote')" size="lg">
      <component ref="form" :is="activeForm" v-bind="formProps"></component>
    </ModalProposal>
</template>

<script>
import { inject, ref } from "vue";
import { useI18n } from "vue-i18n";
import ModalProposal from '@/components/proposal/Modal.vue'
import loFind from "lodash/find";
import Payout from '@/components/dao/workflows/wf_near_send/Proposal.vue'
import SendToken from '@/components/dao/workflows/wf_treasury_send_ft/Proposal.vue'
import AddWorkflow from '@/components/dao/workflows/wf_add/Proposal.vue'
import GeneralProposal from '@/components/dao/workflows/wf_add/Proposal.vue'
import SkywardProposal from '@/components/dao/workflows/wf_skyward/Proposal.vue'
import BountyProposal from '@/components/dao/workflows/wf_bounty/Proposal.vue'
import AddMedia from '@/components/dao/workflows/wf_media_add/Proposal.vue'
import {
  MDBDropdown, MDBDropdownToggle, MDBDropdownMenu, MDBDropdownItem,
  MDBBtn, MDBBtnGroup,
  MDBIcon
} from "mdb-vue-ui-kit";
import Rights from "@/models/dao/Rights";
import { useRewards } from '@/hooks/rewards'
import { useTreasury } from '@/hooks/treasury';
import { useDaoWorkflowComputed } from '@/hooks/workflow';

export default {
  components: {
    MDBDropdown,
    MDBDropdownToggle,
    MDBDropdownMenu,
    MDBDropdownItem,
    MDBBtn,
    MDBBtnGroup,
    MDBIcon,
    ModalProposal, 
    Payout, 
    SendToken,
    AddWorkflow,
    GeneralProposal,
    AddMedia,
    SkywardProposal,
    BountyProposal,
  },
  props: {
    accountRole: {
      type: String,
      required: true,
    },
    walletRights: {
      type: Object,
      required: true,
    },
    daoRights: {
      type: Object,
      required: true,
    },
  },
  setup() {
    const dao = inject('dao')
    const loader = inject('loader')
    const { t } = useI18n();
    const dropdownAction = ref(false);
    const latestDaoVersion = ref(0)

    const { daoRewards, createSalary } = useRewards(dao, loader)
    const { daoTreasury, createLockSimple } = useTreasury(dao, loader)
    const { installedWorkflow } = useDaoWorkflowComputed(dao)

    const form = ref()

    const modalProposal = ref(0)
    const modalTitle = ref('')
    const activeForm = ref('')
    const activeFormCode = ref('')
    const formProps = ref({})

    // for tests
    const modalProp = ref(0)

    const activeTabId1 = ref('ex1-1');

    const check = Rights.check

    return {
      dao,
      t,
      dropdownAction, 
      latestDaoVersion,  
      modalProposal,
      modalTitle, 
      activeForm, 
      activeFormCode, 
      formProps,
      check,
      form,
      modalProp,
      activeTabId1,
      daoRewards, createSalary,
      daoTreasury, createLockSimple,
      installedWorkflow,
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
      return Object.keys(this.dao.tokenHolders).includes(this.accountId)
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
    modalOpen(templ, templSettings){
      this.modalProposal += 1
      this.dropdownAction = false
      this.modalTitle = this.t('default.wf_templ_' + templ.code)
      this.activeFormCode = templ.code

      switch (templ.code) {
        case 'wf_near_send':
          this.formProps = {
            tokenName: this.dao.treasury.token.meta.name, 
            contractId: this.dao.wallet, 
            template: loFind(this.dao.templates, {code: templ.code}),
          }
          this.activeForm = 'Payout'
          break
        case 'wf_treasury_send_ft':
          this.formProps = {tokenName: this.dao.treasury.token.meta.name, contractId: this.dao.wallet, template: loFind(this.dao.templates, {code: templ.code})}
          this.activeForm = 'SendToken'
          break
        case 'wf_add':
          this.formProps = {contractId: this.dao.wallet, dao: this.dao, daoRights: this.daoRights, template: loFind(this.dao.templates, {code: templ.code})}
          this.activeForm = 'AddWorkflow'
          console.log('wf_add');
          break
        case 'wf_general':
          this.formProps = {contractId: this.dao.wallet, dao: this.dao, daoRights: this.daoRights}
          this.activeForm = 'GeneralProposal'
          break
        case 'wf_media_add':
          this.formProps = {contractId: this.dao.wallet, docs: this.dao.docs, template: loFind(this.dao.templates, {code: templ.code})}
          this.activeForm = 'AddMedia'
          break
        case 'wf_skyward':
          this.formProps = {tokenName: this.dao.treasury.token.meta.symbol, contractId: this.dao.wallet, template: loFind(this.dao.templates, {code: templ.code}), proposalCount: this.dao.proposals.length}
          this.activeForm = 'SkywardProposal'
          break 
        case 'wf_bounty':
          this.formProps = {contractId: this.dao.wallet, template: loFind(this.dao.templates, {code: templ.code}), proposalCount: this.dao.proposals.length}
          this.activeForm = 'BountyProposal'
          break;
        default:
            this.formProps = {}
            this.activeForm = ''
            this.activeFormCode = ''
      }
      console.log(templ);
      console.log(templSettings);
    },

    vote(){
      switch (this.activeFormCode) {
        case 'wf_near_send':
          console.log('wf_near_send');
          break
        case 'wf_add':
          console.log('add_wf');
          break
        case 'wf_general':
          console.log('add_wf');
          break
        case 'wf_media_add':
          console.log('wf_media_add');
          break
        default:
          console.log('invalid code');
      }
      this.$refs.form?.onSubmit()
    },
    getLatestDaoVersion(){
      this.latestDaoVersion = '1.0' // TODO: Add version from factory
    },
    unlockTokens(group) {
      console.log(group)
      this.nearService.unlockAllTokens(this.dao.wallet).then((r) => {
      // this.nearService.unlockTokens(this.dao.wallet, group).then((r) => {
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
