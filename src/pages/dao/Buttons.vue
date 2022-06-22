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
        <router-link v-if="false" :to="{ name: 'dao', params: {id: dao.wallet}, query: {page: 'activities' }}" :class="[isActive('activities') ? 'border-bottom border-2 border-secondary text-secondary rounded-0' : 'text-reset']" class="btn btn-link btn-lg px-3 fw-bolder" data-mdb-ripple-color="dark">
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
        <router-link :to="{ name: 'dao', params: {id: dao.wallet}, query: {page: 'resources' }}" :class="[isActive('resources') ? 'border-bottom border-2 border-secondary text-secondary rounded-0' : 'text-reset']" class="btn btn-link btn-lg px-3 fw-bolder" data-mdb-ripple-color="dark">
          <i class="bi bi-files me-1"/>
          {{ t('default.resources') }}
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
              <!-- <template v-for="templ in dao.templates" :key="templ.id">
                <template v-for="templSettings in templ.settings" :key="templSettings.id">
                  <template v-if="['basic_pkg1'].includes(templ.code) === true">
                    <template v-for="scenarioId in templ.startActivityIds" :key="scenarioId">
                      <MDBDropdownItem
                        v-if="check(walletRights, templSettings.proposeRights) && [2,3,4].includes(scenarioId)"
                        tag="button"
                        @click.prevent="modalOpen(templ, scenarioId)"
                      >
                        <MDBIcon v-if="false" icon="user-plus" class="pe-2"/>
                        {{ t('default.wf_templ_' + templ.code + '_v' + templ.version + '_s' + scenarioId) }}
                      </MDBDropdownItem>
                    </template>
                  </template>
                </template>
              </template> -->
              <MDBDropdownItem v-if="check(walletRights, workflowSettings('basic_pkg1')[0].proposeRights)" tag="button" @click.prevent="modalOpen('basic_pkg1', 1, 2)"><i class="bi bi-bag pe-2"/>{{ t('default.wf_templ_basic_pkg1_v1_s2') }}</MDBDropdownItem>
              <MDBDropdownItem v-if="check(walletRights, workflowSettings('basic_pkg1')[0].proposeRights)" tag="button" @click.prevent="modalOpen('basic_pkg1', 1, 3)"><i class="bi bi-cash pe-2"/>{{ t('default.wf_templ_basic_pkg1_v1_s3') }}</MDBDropdownItem>
              <MDBDropdownItem v-if="check(walletRights, workflowSettings('basic_pkg1')[0].proposeRights)" tag="button" @click.prevent="modalOpen('basic_pkg1', 1, 4)"><i class="bi bi-coin pe-2"/>{{ t('default.wf_templ_basic_pkg1_v1_s4') }}</MDBDropdownItem>
              <MDBDropdownItem v-if="installedWorkflow('lock1') === true && check(walletRights, workflowSettings('lock1')[0].proposeRights)" tag="button" @click.prevent="modalOpen('lock1', 1, 1)"><i class="bi bi-lock pe-2"/>{{ t('default.wf_templ_lock1_v1_s1') }}</MDBDropdownItem>
              <MDBDropdownItem v-if="installedWorkflow('reward2') === true && check(walletRights, workflowSettings('reward2')[0].proposeRights)" tag="button" @click.prevent="modalOpen('reward2', 1, 1)"><i class="bi bi-cash-stack pe-2"/>{{ t('default.wf_templ_reward2_v1_s1') }}</MDBDropdownItem>
              <MDBDropdownItem v-if="installedWorkflow('reward2') === true && check(walletRights, workflowSettings('reward2')[0].proposeRights)" tag="button" @click.prevent="modalOpen('reward2', 1, 2)"><i class="bi bi-cash-stack pe-2"/>{{ t('default.wf_templ_reward2_v1_s2') }}</MDBDropdownItem>
              <MDBDropdownItem v-if="installedWorkflow('skyward1') === true && check(walletRights, workflowSettings('skyward1')[0].proposeRights)" tag="button" @click.prevent="modalOpen('skyward1', 1, 1)"><i class="bi bi-hammer pe-2"/>{{ t('default.wf_templ_skyward1_v1_s1') }}</MDBDropdownItem>
            </MDBDropdownMenu>
          </MDBDropdown>
        <!-- </MDBBtnGroup> -->

      </div>
      <!-- /Right -->
    </section>

    <!-- Modals -->
    <ModalProposal :title="modalTitle" :show="modalProposal" @submit="vote" :submitText="t('default.vote')" size="lg">
      <template #default="{ isValid }">
        <component ref="form" :is="activeForm" @is-valid="isValid" v-bind="formProps"></component>
      </template>
    </ModalProposal>
</template>

<script>
import { inject, ref } from "vue";
import { useI18n } from "vue-i18n";
import ModalProposal from '@/components/proposal/Modal.vue'
import loFind from "lodash/find";
import Payout from '@/components/dao/workflows/basic_pkg/ProposalNearSend.vue'
import SendToken from '@/components/dao/workflows/basic_pkg/ProposalTokenSend.vue'
import AddMedia from '@/components/dao/workflows/basic_pkg/ProposalMediaAdd.vue'
import SimpleLock from '@/components/dao/workflows/wf_lock/Proposal.vue'
import Salary from '@/components/dao/workflows/wf_reward/ProposalSalary.vue'
import Activity from '@/components/dao/workflows/wf_reward/ProposalActivity.vue'
import AddWorkflow from '@/components/dao/workflows/wf_add/Proposal.vue'
import GeneralProposal from '@/components/dao/workflows/wf_add/Proposal.vue'
import SkywardProposal from '@/components/dao/workflows/wf_skyward/Proposal.vue'
import BountyProposal from '@/components/dao/workflows/wf_bounty/Proposal.vue'
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
    SimpleLock,
    Salary,
    Activity,
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
    const { installedWorkflow, workflowSettings } = useDaoWorkflowComputed(dao)

    console.log(workflowSettings('lock1'));

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
      workflowSettings
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
      return Object.keys(this.dao.members).includes(this.accountId)
    },
    possibleUpgrade(){
      return this.dao.version < this.latestDaoVersion &&  Object.values(this.dao.groups.council.wallets).includes(this.accountId)
    }
  },

  methods: {
    isActive(button_page) {
      return button_page === (this.$route.query.page || 'overview')
    },
    modalOpen(templCode, templVersion, scenarioId){ 
      const workflowCode = templCode + '_v' + templVersion + '_s' + scenarioId 

      this.modalProposal += 1
      this.dropdownAction = false
      this.modalTitle = this.t('default.wf_templ_' + workflowCode)
      this.activeFormCode = templCode

      switch (workflowCode) {
        case 'basic_pkg1_v1_s3':
          this.formProps = {}
          this.activeForm = 'Payout'
          break
        case 'basic_pkg1_v1_s4':
          this.formProps = {tokenName: this.dao.treasury.token.meta.symbol}
          this.activeForm = 'SendToken'
          break
        case 'basic_pkg1_v1_s1':
          this.formProps = {contractId: this.dao.wallet, dao: this.dao, daoRights: this.daoRights, template: loFind(this.dao.templates, {code: templCode})}
          this.activeForm = 'AddWorkflow'
          console.log('wf_add');
          break
        case 'basic_pkg1_v1_s2':
          this.formProps = {docs: this.dao.docs}
          this.activeForm = 'AddMedia'
          break
        case 'lock1_v1_s1':
          this.formProps = {}
          this.activeForm = 'SimpleLock'
          break
        case 'skyward1_v1_s1':
          this.formProps = {tokenName: this.dao.treasury.token.meta.symbol, contractId: this.dao.wallet, template: loFind(this.dao.templates, {code: templCode}), proposalCount: this.dao.proposals.length}
          this.activeForm = 'SkywardProposal'
          break 
        case 'reward2_v1_s1':
          this.formProps = {}
          this.activeForm = 'Salary'
          break
        case 'reward2_v1_s2':
          this.formProps = {}
          this.activeForm = 'Activity'
          break
        case 'wf_general':
          this.formProps = {contractId: this.dao.wallet, dao: this.dao, daoRights: this.daoRights}
          this.activeForm = 'GeneralProposal'
          break
        case 'wf_bounty':
          this.formProps = {contractId: this.dao.wallet, template: loFind(this.dao.templates, {code: templCode}), proposalCount: this.dao.proposals.length}
          this.activeForm = 'BountyProposal'
          break;
        default:
            this.formProps = {}
            this.activeForm = ''
            this.activeFormCode = ''
      }
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
  }
};
</script>
