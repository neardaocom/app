<template>
  <section class="pt-3">
    <div class="row d-flex justify-content-center">
      <div class="col-lg-12">
        <nav aria-label="breadcrumb navbar-light bg-light">
          <ol class="breadcrumb">
            <li class="breadcrumb-item">
              <router-link :to="{ name: 'landing-page' }">{{ appName }}</router-link>
            </li>
            <li class="breadcrumb-item">
              <router-link :to="{ name: listRouter, query: {} }">
                {{ t("default." + listName) }}
              </router-link>
            </li>
            <li class="breadcrumb-item active"
              v-for="(tag, index) in tags"
              :key="index"
              >{{ t('default.' + tag.value) }}
            </li>
            <li class="breadcrumb-item active" aria-current="page">
              {{ account }}
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
    account: {
      type: String,
      required: true,
    },
    listRouter: {
      type: String,
      required: true,
    },
    listName: {
      type: String,
      required: true,
    },
    tags: {
      type: Array,
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