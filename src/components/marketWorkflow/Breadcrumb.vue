<template>
  <section class="pt-3">
    <div class="row d-flex justify-content-center">
      <div class="col-lg-12">
        <nav aria-label="breadcrumb navbar-light">
          <ol class="breadcrumb">
            <li class="breadcrumb-item">
              <router-link :to="{ name: 'landing-page' }">{{ appName }}</router-link>
            </li>
            <li class="breadcrumb-item">
              <router-link :to="{ name: 'market' }">{{ t("default.market") }}</router-link>
            </li>
            <li class="breadcrumb-item">
              {{ t("default.workflows") }}
            </li>
            <li class="breadcrumb-item active">
              {{ template.name }}
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
    template: {
      type: Object,
      required: true,
    }
  },
  computed: {
    appName() {
      return 'NearDAO'
    }
  }
};
</script>