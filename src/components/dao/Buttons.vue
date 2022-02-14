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
        <router-link :to="{ name: 'dao', params: {id: dao.wallet}, query: {page: 'activities' }}" :class="[isActive('activities') ? 'bg-light border-bottom border-2 border-primary rounded-0' : 'text-reset']" class="btn btn-link btn-lg px-3" data-mdb-ripple-color="dark">
          {{ t('default.activities') }}
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
        <router-link :to="{ name: 'dao', params: {id: dao.wallet}, query: {page: 'defi' }}" :class="[isActive('defi') ? 'bg-light border-bottom border-2 border-primary rounded-0' : 'text-reset']" class="btn btn-link btn-lg px-3" data-mdb-ripple-color="dark">
          {{ t('default.defi') }}
        </router-link>
        <router-link :to="{ name: 'dao', params: {id: dao.wallet}, query: {page: 'documents' }}" :class="[isActive('documents') ? 'bg-light border-bottom border-2 border-primary rounded-0' : 'text-reset']" class="btn btn-link btn-lg px-3" data-mdb-ripple-color="dark">
          {{ t('default.documents') }}
        </router-link>
        <router-link :to="{ name: 'dao', params: {id: dao.wallet}, query: {page: 'about' }}" :class="[isActive('about') ? 'bg-light border-bottom border-2 border-primary rounded-0' : 'text-reset']" class="btn btn-link btn-lg px-3" data-mdb-ripple-color="dark">
          {{ t('default.about') }}
        </router-link>
        <router-link :to="{ name: 'dao', params: {id: dao.wallet}, query: {page: 'settings' }}" :class="[isActive('settings') ? 'bg-light border-bottom border-2 border-primary rounded-0' : 'text-reset']" class="btn btn-link btn-lg px-3" data-mdb-ripple-color="dark">
          {{ t('default.settings') }}
        </router-link>
      </div>
      <!-- Left -->

      <!-- Right -->
      <div class="col-12 col-lg-3">
        <!--<button type="button" class="btn btn-light bg-light px-3 me-2" data-mdb-ripple-color="dark">
          <i class="fas text-warning fa-star"></i>
        </button>-->
        <!--<button type="button" class="btn btn-light bg-light px-3 me-2" data-mdb-ripple-color="dark">
          <i class="fas fa-ellipsis-h"></i>
        </button>-->
        <MDBBtnGroup id="dropdown-target">
          <MDBBtn
            color="primary"
            v-on:click="dropdownAction = !dropdownAction"
            class="dropdown-toggle"
          ><MDBIcon icon="ellipsis-h" class="pe-2"/>{{ t('default.activities') }}&nbsp;&nbsp;</MDBBtn>
          <MDBDropdown v-model="dropdownAction" target="#dropdown-target">
            <MDBDropdownMenu>
              <template v-for="templ in dao.templates" :key="templ.id">
                <template v-for="templSettings in templ.settings" :key="templSettings.id">
                  <MDBDropdownItem v-if="check(walletRights, templSettings.proposeRights)" tag="button" @click.prevent="modalOpen(templ, templSettings)"><MDBIcon icon="user-plus" class="pe-2"/>{{ templ.name }}</MDBDropdownItem>
                </template>
              </template>
            </MDBDropdownMenu>
          </MDBDropdown>
        </MDBBtnGroup>
      </div>
      <!-- /Right -->
    </section>
    <ModalProposal :title="modalTitle" :show="modalProposal" @vote="vote">
      <component ref="form" :is="activeForm" v-bind="formProps"></component>
    </ModalProposal>

    <MDBBtn @click="modalPropOpen"> Test </MDBBtn>

    <ModalProposal title="Test" :show="modalProp" @vote="vote">
      <AddMedia/>
    </ModalProposal>
</template>

<script>
import { ref } from "vue";
import { useI18n } from "vue-i18n";
import ModalProposal from '@/components/forms/ModalProposal.vue'
import loFind from "lodash/find";
import Payout from '@/components/dao/workflows/wf_near_send/Proposal.vue'
import AddWorkflow from '@/components/dao/workflows/wf_add/Proposal.vue'
import GeneralProposal from '@/components/dao/workflows/wf_add/Proposal.vue'
import AddMedia from '@/components/dao/workflows/wf_media_add/Proposal.vue'
import {
  MDBDropdown, MDBDropdownToggle, MDBDropdownMenu, MDBDropdownItem,
  MDBBtn, MDBBtnGroup,
  MDBIcon,
} from "mdb-vue-ui-kit";
import { check } from "@/models/rights";

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
    AddWorkflow,
    GeneralProposal,
    AddMedia
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
    const { t } = useI18n();
    const dropdownAction = ref(false);
    const latestDaoVersion = ref(0)

    const form = ref()

    const modalProposal = ref(0)
    const modalTitle = ref('')
    const activeForm = ref('')
    const activeFormCode = ref('')
    const formProps = ref({})

    // for tests
    const modalProp = ref(0)

    return {
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
      modalProp
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
    modalPropOpen(){
      this.modalProp += 1 
    },
    modalOpen(templ, templSettings){
      this.modalProposal += 1
      this.dropdownAction = false
      this.modalTitle = templ.name
      switch (templ.code) {
        case 'wf_near_send':
          this.formProps = {tokenName: this.dao.treasury.token.meta.name, contractId: this.dao.wallet, template: loFind(this.dao.templates, {code: templ.code})}
          this.activeForm = 'Payout'
          this.activeFormCode = templ.code
          break
        case 'wf_treasury_send_ft':
          this.formProps = {tokenName: this.dao.treasury.token.meta.name, contractId: this.dao.wallet, template: loFind(this.dao.templates, {code: templ.code})}
          this.activeForm = 'Payout'
          this.activeFormCode = templ.code
          break
        case 'wf_add':
          this.formProps = {contractId: this.dao.wallet, dao: this.dao, daoRights: this.daoRights}
          this.activeForm = 'AddWorkflow'
          this.activeFormCode = templ.code
          console.log('wf_add');
          break
        case 'wf_general':
          this.formProps = {contractId: this.dao.wallet, dao: this.dao, daoRights: this.daoRights}
          this.activeForm = 'GeneralProposal'
          this.activeFormCode = templ.code
          break
        case 'wf_media_add':
          this.formProps = {contractId: this.dao.wallet, dao: this.dao, daoRights: this.daoRights}
          this.activeForm = 'AddMedia'
          this.activeFormCode = templ.code
          break
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
      this.nearService.getDaoStats()
       .then(r => {
          this.latestDaoVersion = r.latest_dao_version
        })
        .catch((e) => {
          this.$logger.error('D', 'app@components/dao/Buttons', 'getLatestDaoVersion-blockchain', `Failed to load latest DAO version`)
          console.log(e)
        })
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