<template>
    <section class="row d-flex justify-content-between align-items-center py-1"> <!-- py-3 -->
      <!-- Left -->
      <div class="col-12 col-lg-9">
        <router-link :to="{ name: 'dao', params: {id: dao.wallet}, query: {page: 'overview' }}" :class="[isActive('overview') ? 'bg-light border-bottom border-2 border-primary rounded-0' : 'text-reset']" class="btn btn-link btn-lg px-3" data-mdb-ripple-color="dark">
          {{ t('default.overview') }}
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
        <router-link :to="{ name: 'dao', params: {id: dao.wallet}, query: {page: 'tokens' }}" :class="[isActive('tokens') ? 'bg-light border-bottom border-2 border-primary rounded-0' : 'text-reset']" class="btn btn-link btn-lg px-3" data-mdb-ripple-color="dark">
          {{ t('default.tokens') }}
        </router-link>
        <router-link :to="{ name: 'dao', params: {id: dao.wallet}, query: {page: 'documents' }}" :class="[isActive('documents') ? 'bg-light border-bottom border-2 border-primary rounded-0' : 'text-reset']" class="btn btn-link btn-lg px-3" data-mdb-ripple-color="dark">
          {{ t('default.documents') }}
        </router-link>
      </div>
      <!-- Left -->

      <!-- Right -->
      <div v-if="canVote === true" class="col-12 col-lg-3">
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
            <MDBDropdownItem href="#" @click.self.prevent="modalAddMemberOpen()"><MDBIcon icon="user-plus" class="pe-2"/>{{ t('default.add_member')}}</MDBDropdownItem>
            <MDBDropdownItem href="#" @click.prevent="modalRemoveMemberOpen()"><MDBIcon icon="user-minus" class="pe-2"/>{{ t('default.remove_member')}}</MDBDropdownItem>
            <MDBDropdownItem href="#" @click.prevent="modalAddDocumentOpen()"><MDBIcon icon="folder-plus" class="pe-2"/>{{ t('default.add_document')}}</MDBDropdownItem>
            <MDBDropdownItem href="#" @click.prevent="modalRemoveDocumentOpen()"><MDBIcon icon="folder-minus" class="pe-2"/>{{ t('default.remove_document')}}</MDBDropdownItem>
            <MDBDropdownItem href="#" @click.prevent="modalGeneralOpen()"><MDBIcon icon="comments" class="pe-2"/>{{ t('default.general_proposal')}}</MDBDropdownItem>
          </MDBDropdownMenu>
        </MDBDropdown>
      </div>
      <!-- /Right -->
    </section>

    <ModalPayout :show="modalPayout" :contractId="dao.wallet" />
    <ModalAddMember :show="modalAddMember" :contractId="dao.wallet" :groups="dao.groups" :tokenHolders="dao.token_holders" />
    <ModalRemoveMember :show="modalRemoveMember" :contractId="dao.wallet" :groups="dao.groups" :tokenHolders="dao.token_holders" />
    <ModalAddDocument :show="modalAddDocument" :contractId="dao.wallet" :groups="dao.groups" :tokenHolders="dao.token_holders" :docs="dao.docs" />
    <ModalRemoveDocument :show="modalRemoveDocument" :contractId="dao.wallet" :groups="dao.groups" :tokenHolders="dao.token_holders" />
    <ModalGeneral :show="modalGeneral" :contractId="dao.wallet" :groups="dao.groups" :tokenHolders="dao.token_holders" />
</template>

<script>
import { ref } from "vue";
import { useI18n } from "vue-i18n";
import ModalPayout from '@/components/dao/ModalPayout'
import ModalAddDocument from '@/components/dao/ModalAddDocument'
import ModalAddMember from '@/components/dao/ModalAddMember'
import ModalRemoveDocument from '@/components/dao/ModalRemoveDocument'
import ModalRemoveMember from '@/components/dao/ModalRemoveMember'
import ModalGeneral from '@/components/dao/ModalGeneral'
import {
  MDBDropdown, MDBDropdownToggle, MDBDropdownMenu, MDBDropdownItem,
  MDBBtn,
  MDBIcon,
} from "mdb-vue-ui-kit";

export default {
  components: {
    MDBDropdown, MDBDropdownToggle, MDBDropdownMenu, MDBDropdownItem,
    MDBBtn, MDBIcon, ModalPayout, ModalAddMember, ModalRemoveMember, ModalAddDocument, ModalRemoveDocument, ModalGeneral
  },
  props: {
    dao: {
      type: Object,
      required: true
    }
  },
  setup() {
    const { t } = useI18n();
    const modalPayout = ref(0)
    const modalAddDocument = ref(0)
    const modalAddMember = ref(0)
    const modalRemoveDocument = ref(0)
    const modalRemoveMember = ref(0)
    const modalGeneral = ref(0)
    const dropdownAction = ref(false);

    return {
      t, modalPayout, modalAddMember, modalRemoveMember, dropdownAction, modalAddDocument, modalRemoveDocument, modalGeneral
    };
  },
  computed: {
    accountId() {
      return this.$store.getters['near/getAccountId']
    },
    canVote() {
      return Object.keys(this.dao.token_holders).includes(this.accountId)
    },
  },
  methods: {
    isActive(button_page) {
      return button_page === (this.$route.query.page || 'overview')
    },
    modalPayoutOpen() {
      this.modalPayout += 1
    },
    modalAddMemberOpen() {
      this.modalAddMember += 1
    },
    modalRemoveMemberOpen() {
      this.modalRemoveMember += 1
    },
    modalAddDocumentOpen() {
      this.modalAddDocument += 1
    },
    modalRemoveDocumentOpen() {
      this.modalRemoveDocument += 1
    },
    modalGeneralOpen() {
      this.modalGeneral += 1
    },
  }
};
</script>
