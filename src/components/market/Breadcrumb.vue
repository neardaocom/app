<template>
  <section class="pt-3">
    <div class="row d-flex justify-content-center">
      <div class="col-lg-12">
        <nav aria-label="breadcrumb navbar-light bg-light">
          <ol class="breadcrumb">
            <li class="breadcrumb-item">
              <router-link :to="{ name: 'landing-page' }">{{ appName }}</router-link>
            </li>
            <li v-if="daoId" class="breadcrumb-item">
              <router-link :to="{ name: 'dao-list', query: {} }">{{ t("default.organizations") }}</router-link>
            </li>
            <li v-if="daoId" class="breadcrumb-item">
              <router-link :to="{ name: 'dao', params: {id: daoId }}">{{ daoId }}</router-link>
            </li>
            <li class="breadcrumb-item active">
              {{ t("default.market") }}
            </li>
          </ol>
        </nav>
      </div>
    </div>
  </section>
</template>

<script>
import { useI18n } from "vue-i18n";

export default {
  setup() {
    const { t } = useI18n();
    return { t };
  },
  props: {
    daoId: {
      type: String,
      required: false,
    },
  },
  computed: {
    appName() {
      return 'NearDAO'
    }
  }
};
</script>