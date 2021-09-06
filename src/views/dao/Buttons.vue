<template>
    <section class="d-flex justify-content-between align-items-center py-3">
      <!-- Left -->
      <div>
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
      <div class="d-none d-lg-block">
        <button type="button" class="btn btn-light bg-light px-3 me-2" data-mdb-ripple-color="dark">
          <i class="fas text-warning fa-star"></i>
        </button>
        <!--<button type="button" class="btn btn-light bg-light px-3 me-2" data-mdb-ripple-color="dark">
          <i class="fas fa-ellipsis-h"></i>
        </button>-->
      </div>
      <!-- Right -->
    </section>
</template>

<script>
import { useI18n } from "vue-i18n";

export default {
  setup() {
    const { t } = useI18n();
    return { t };
  },
  methods: {
    isActive(button_page) {
      return button_page === (this.$route.query.page || 'overview')
    }
  }
};
</script>