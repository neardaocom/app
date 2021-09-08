<template>
    <section class="row d-flex justify-content-between align-items-center py-3">
      <!-- Left -->
      <div class="col-12 col-lg-9">
        <router-link :to="{ name: 'dao', query: { id: id, page: 'overview' }}" :class="[isActive('overview') ? 'bg-light' : 'text-reset']" class="btn btn-link btn-lg px-3" data-mdb-ripple-color="dark">
          {{ t('default.overview') }}
        </router-link>
        <router-link :to="{ name: 'dao', query: { id: id, page: 'voting' }}" :class="[isActive('voting') ? 'bg-light' : 'text-reset']" class="btn btn-link btn-lg px-3" data-mdb-ripple-color="dark">
          {{ t('default.voting') }}
        </router-link>
        <router-link :to="{ name: 'dao', query: { id: id, page: 'treasury' }}" :class="[isActive('treasury') ? 'bg-light' : 'text-reset']" class="btn btn-link btn-lg px-3" data-mdb-ripple-color="dark">
          {{ t('default.treasury') }}
        </router-link>
        <router-link :to="{ name: 'dao', query: { id: id, page: 'members' }}" :class="[isActive('members') ? 'bg-light' : 'text-reset']" class="btn btn-link btn-lg px-3" data-mdb-ripple-color="dark">
          {{ t('default.members') }}
        </router-link>
        <router-link :to="{ name: 'dao', query: { id: id, page: 'tokens' }}" :class="[isActive('tokens') ? 'bg-light' : 'text-reset']" class="btn btn-link btn-lg px-3" data-mdb-ripple-color="dark">
          {{ t('default.tokens') }}
        </router-link>
        <router-link :to="{ name: 'dao', query: { id: id, page: 'organization' }}" :class="[isActive('organization') ? 'bg-light' : 'text-reset']" class="btn btn-link btn-lg px-3" data-mdb-ripple-color="dark">
          {{ t('default.organization') }}
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
        <MDBBtn aria-controls="modalPayout" @click="modalPayout = true" class="btn btn-primary px-3 me-2" data-mdb-ripple-color="dark">
          <MDBIcon icon="paper-plane pe-2"/> {{ t('default.payout')}}
        </MDBBtn>
      </div>
      <!-- /Right -->
    </section>

    <!-- MODALS -->
    <MDBModal
      id="modalPayout"
      tabindex="-1"
      labelledby="modalPayoutLabel"
      v-model="modalPayout"
    >
      <MDBModalHeader>
        <MDBModalTitle id="modalPayoutLabel"> {{ t('default.payout') }} </MDBModalTitle>
      </MDBModalHeader>
      <MDBModalBody class="text-start">
        <label for="account-id-input" class="form-label">{{ t('default.account_id') }}</label>
        <MDBInput id="account-id-input" inputGroup :formOutline="false" aria-describedby="account-addon" v-model="modalPayoutAccount" :data-mdb-showcounter="true" maxlength="64" required>
          <span class="input-group-text" id="account-addon">.near</span>
        </MDBInput>
        <br/>
        <label for="amount-input" class="form-label">{{ t('default.amount') }}</label>
        <MDBInput class="text-left" id="amount-input" min="0.00" inputGroup :formOutline="false" aria-describedby="amount-addon" type="number" v-model="modalPayoutAmount" required>
          <span class="input-group-text" id="amount-addon">Ⓝ</span>
        </MDBInput>
      </MDBModalBody>
      <MDBModalFooter>
        <MDBBtn color="secondary" @click="modalPayoutClose()">{{ t('default.close') }}</MDBBtn>
        <MDBBtn color="primary" @click="modalPayoutVote()">{{ t('default.vote') }}</MDBBtn>
      </MDBModalFooter>
    </MDBModal>
    <!-- /MODALS -->
</template>

<script>
import { ref } from "vue";
import { useI18n } from "vue-i18n";
import {
  MDBBtn,
  MDBInput,
  MDBIcon,
  MDBModal,
  MDBModalHeader,
  MDBModalTitle,
  MDBModalBody,
  MDBModalFooter
} from "mdb-vue-ui-kit";

export default {
  components: {
    MDBBtn, MDBIcon, MDBInput,
    MDBModal, MDBModalHeader, MDBModalTitle, MDBModalBody, MDBModalFooter
  },
  setup() {
    const { t } = useI18n();
    const modalPayout = ref(false)
    const modalPayoutAccount = ref('')
    const modalPayoutAmount = ref(0)

    return {
      t,
      modalPayout, modalPayoutAccount, modalPayoutAmount
    };
  },
  methods: {
    isActive(button_page) {
      return button_page === (this.$route.query.page || 'overview')
    },
    modalPayoutVote() {
      this.modalPayoutAccount = null
      this.modalPayoutAmount = null
      this.modalPayout = false
    },
    modalPayoutClose() {
      this.modalPayout = false
    }
  }
};
</script>