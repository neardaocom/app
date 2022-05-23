<template>
    <section class="d-flex justify-content-between align-items-center buttons_nav">
      <!-- Left -->
      <div class="ps-3">
        <a :class="[isActive('overview') ? 'border-bottom border-2 border-secondary text-secondary rounded-0' : 'text-reset']" class="btn btn-link btn-lg px-3 fw-bolder " data-mdb-ripple-color="dark">
          <i class="bi bi-columns-gap me-1"/>
          {{ t('default.dashboard') }}
        </a>
        <a :class="[isActive('voting') ? 'border-bottom border-2 border-secondary text-secondary rounded-0' : 'text-reset']" class="btn btn-link btn-lg px-3 fw-bolder" data-mdb-ripple-color="dark">
          <i class="bi bi-bar-chart me-1"/>
          {{ t('default.voting') }}
        </a>
        <a :class="[isActive('activities') ? 'border-bottom border-2 border-secondary text-secondary rounded-0' : 'text-reset']" class="btn btn-link btn-lg px-3 fw-bolder" data-mdb-ripple-color="dark">
          <i class="bi bi-check2-circle me-1"/>
          {{ t('default.in_progress') }}
        </a>
        <a v-if="false" :class="[isActive('treasury') ? 'border-bottom border-2 border-secondary text-secondary rounded-0' : 'text-reset']" class="btn btn-link btn-lg px-3 fw-bolder" data-mdb-ripple-color="dark">
          {{ t('default.treasury') }}
        </a>
        <a v-if="false" :class="[isActive('members') ? 'border-bottom border-2 border-secondary text-secondary rounded-0' : 'text-reset']" class="btn btn-link btn-lg px-3 fw-bolder" data-mdb-ripple-color="dark">
          {{ t('default.members') }}
        </a>
        <a v-if="false" :class="[isActive('tokens') ? 'border-bottom border-2 border-secondary text-secondary rounded-0' : 'text-reset']" class="btn btn-link btn-lg px-3 fw-bolder" data-mdb-ripple-color="dark">
          {{ t('default.tokens') }}
        </a>
        <a  v-if="false" :class="[isActive('defi') ? 'border-bottom border-2 border-secondary text-secondary rounded-0' : 'text-reset']" class="btn btn-link btn-lg px-3 fw-bolder" data-mdb-ripple-color="dark">
          <i class="bi bi-graph-up me-1"/>
          {{ t('default.dApps') }}
        </a>
        <a :class="[isActive('resources') ? 'border-bottom border-2 border-secondary text-secondary rounded-0' : 'text-reset']" class="btn btn-link btn-lg px-3 fw-bolder" data-mdb-ripple-color="dark">
          <i class="bi bi-files me-1"/>
          {{ t('default.resources') }}
        </a>
        <a  v-if="false" :class="[isActive('about') ? 'border-bottom border-2 border-secondary text-secondary rounded-0' : 'text-reset']" class="btn btn-link btn-lg px-3 fw-bolder" data-mdb-ripple-color="dark">
          <i class="bi bi-info-square me-1"/>
          {{ t('default.about') }}
        </a>
        <a :class="[isActive('settings') ? 'border-bottom border-2 border-secondary text-secondary rounded-0' : 'text-reset']" class="btn btn-link btn-lg px-3 fw-bolder" data-mdb-ripple-color="dark">
          <i class="bi bi-gear me-1"/>
          {{ t('default.settings') }}
        </a>
        <a :class="[isActive('treasury') ? 'border-bottom border-2 border-secondary text-secondary rounded-0' : 'text-reset']" class="btn btn-link btn-lg px-3 fw-bolder" data-mdb-ripple-color="dark">
          <i class="bi bi-wallet2 me-1"/>
          {{ t('default.treasury') }}
        </a>
        <a :class="[isActive('governance') ? 'border-bottom border-2 border-secondary text-secondary rounded-0' : 'text-reset']" class="btn btn-link btn-lg px-3 fw-bolder" data-mdb-ripple-color="dark">
          <i class="bi bi-hammer me-1"/>
          {{ t('default.governance') }}
        </a>
        <a  v-if="false" :class="[isActive('wallet_account') ? 'border-bottom border-2 border-secondary text-secondary rounded-0' : 'text-reset']" class="btn btn-link btn-lg px-3 fw-bolder" data-mdb-ripple-color="dark">
          <i class="bi bi-wallet2 me-1"/>
          {{ t('default.wallet') }}
        </a>
      </div>
      <!-- Left -->

      <!-- Right -->
      <div>
        <MDBDropdown btnGroup class="buttons_dropdown">
          <MDBDropdownToggle class="buttons_dropdown bg-gradient-140 fs-6" size="lg">
            <!-- <MDBBtn aria-controls="modalPayout" class="btn btn-primary"  data-mdb-ripple-color="dark"> -->
              <MDBIcon v-if="false" icon="ellipsis-h" class="pe-2"/><span class="me-2">{{ t('default.actions')}}</span>
            <!-- </MDBBtn> -->
          </MDBDropdownToggle>
        </MDBDropdown>
      </div>
      <!-- /Right -->
    </section>
</template>

<script>
import { useI18n } from "vue-i18n";
import {
  MDBIcon,
  MDBDropdown, 
  MDBDropdownToggle
} from "mdb-vue-ui-kit";

export default {
  components: {
    MDBIcon, 
    MDBDropdown, 
    MDBDropdownToggle
  },
  setup() {
    const { t } = useI18n();

    return {
      t
    };
  },
  methods: {
    isActive(button_page) {
      return button_page === (this.$route.query.page || 'overview')
    },
  }
};
</script>