<template>
  <section class="pt-3">
    <div class="row d-flex justify-content-center">
      <div class="col-lg-12">
        <nav aria-label="breadcrumb navbar-light">
          <ol class="breadcrumb">
            <li class="breadcrumb-item">
              <router-link :to="{ name: 'landing-page' }">{{ appName }}</router-link>
            </li>
            <li class="breadcrumb-item active">
              {{ t("default." + listName) }}
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
  props: {
    listName: {
      type: String,
      required: true,
    },
  },
  setup() {
    const { t } = useI18n();
    return { t };
  },
  computed: {
    appName() {
      return process.env.VUE_APP_BRAND_NAME
    }
  }
};
</script>