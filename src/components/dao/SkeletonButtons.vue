<template>
    <section class="row d-flex justify-content-between align-items-center py-1">
      <!-- Left -->
      <div class="col-12 col-lg-9">
        <a :class="[isActive('overview') ? 'bg-light border-bottom border-2 border-primary rounded-0' : 'text-reset']" class="btn btn-link btn-lg px-3" data-mdb-ripple-color="dark">
          {{ t('default.dashboard') }}
        </a>
        <a :class="[isActive('voting') ? 'bg-light border-bottom border-2 border-primary rounded-0' : 'text-reset']" class="btn btn-link btn-lg px-3" data-mdb-ripple-color="dark">
          {{ t('default.voting') }}
        </a>
        <a :class="[isActive('activities') ? 'bg-light border-bottom border-2 border-primary rounded-0' : 'text-reset']" class="btn btn-link btn-lg px-3" data-mdb-ripple-color="dark">
          {{ t('default.activities') }}
        </a>
        <a v-if="false" :class="[isActive('treasury') ? 'bg-light border-bottom border-2 border-primary rounded-0' : 'text-reset']" class="btn btn-link btn-lg px-3" data-mdb-ripple-color="dark">
          {{ t('default.treasury') }}
        </a>
        <a v-if="false" :class="[isActive('members') ? 'bg-light border-bottom border-2 border-primary rounded-0' : 'text-reset']" class="btn btn-link btn-lg px-3" data-mdb-ripple-color="dark">
          {{ t('default.members') }}
        </a>
        <a v-if="false" :class="[isActive('tokens') ? 'bg-light border-bottom border-2 border-primary rounded-0' : 'text-reset']" class="btn btn-link btn-lg px-3" data-mdb-ripple-color="dark">
          {{ t('default.tokens') }}
        </a>
        <a :class="[isActive('defi') ? 'bg-light border-bottom border-2 border-primary rounded-0' : 'text-reset']" class="btn btn-link btn-lg px-3" data-mdb-ripple-color="dark">
          {{ t('default.defi') }}
        </a>
        <a :class="[isActive('documents') ? 'bg-light border-bottom border-2 border-primary rounded-0' : 'text-reset']" class="btn btn-link btn-lg px-3" data-mdb-ripple-color="dark">
          {{ t('default.documents') }}
        </a>
        <a :class="[isActive('about') ? 'bg-light' : 'text-reset']" class="btn btn-link btn-lg px-3" data-mdb-ripple-color="dark">
          {{ t('default.about') }}
        </a>
        <a :class="[isActive('settings') ? 'bg-light' : 'text-reset']" class="btn btn-link btn-lg px-3" data-mdb-ripple-color="dark">
          {{ t('default.settings') }}
        </a>
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
        <MDBDropdown btnGroup :align="['end']">
          <MDBBtn aria-controls="modalPayout" class="btn btn-primary" data-mdb-ripple-color="dark">
            <MDBIcon icon="paper-plane" class="pe-2"/>{{ t('default.payout')}}
          </MDBBtn>
          <MDBDropdownToggle/>
        </MDBDropdown>
      </div>
      <!-- /Right -->
    </section>
</template>

<script>
import { useI18n } from "vue-i18n";
import {
  MDBBtn,
  MDBIcon,
  MDBDropdown, MDBDropdownToggle
} from "mdb-vue-ui-kit";

export default {
  components: {
    MDBBtn, MDBIcon, MDBDropdown, MDBDropdownToggle
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