<template>
    <section class="row d-flex justify-content-between align-items-center py-3">
      <!-- Left -->
      <div class="col-12 col-lg-9">
        <a :class="[isActive('voting') ? 'bg-light' : 'text-reset']" class="btn btn-link btn-lg px-3" data-mdb-ripple-color="dark">
          {{ t('default.voting') }}
        </a>
        <a v-if="false" :class="[isActive('treasury') ? 'bg-light' : 'text-reset']" class="btn btn-link btn-lg px-3" data-mdb-ripple-color="dark">
          {{ t('default.treasury') }}
        </a>
        <a v-if="false" :class="[isActive('members') ? 'bg-light' : 'text-reset']" class="btn btn-link btn-lg px-3" data-mdb-ripple-color="dark">
          {{ t('default.members') }}
        </a>
        <a :class="[isActive('tokens') ? 'bg-light' : 'text-reset']" class="btn btn-link btn-lg px-3" data-mdb-ripple-color="dark">
          {{ t('default.tokens') }}
        </a>
        <a :class="[isActive('documents') ? 'bg-light' : 'text-reset']" class="btn btn-link btn-lg px-3" data-mdb-ripple-color="dark">
          {{ t('default.documents') }}
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
      return button_page === (this.$route.query.page || 'voting')
    },
  }
};
</script>