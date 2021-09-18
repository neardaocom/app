<template>
  <section class="text-center border-bottom mb-2">
    <div class="row d-flex justify-content-center">
      <div class="col-lg-6">
        <div class="skeleton skeleton-h1 rounded w-50"></div>
        <div class="skeleton skeleton-text rounded w-75"></div>
      </div>
    </div>
  </section>
  <section class="mb-0 text-start">
    <div class="row">
      <div class="col-12 col-md-4">
        <ul class="list-unstyled text-muted">
          <li>
            <div class="skeleton skeleton-text rounded w-50"></div>
          </li>
          <li>
            <div class="skeleton skeleton-text rounded w-75"></div>
          </li>
          <li>
            <div class="skeleton skeleton-text rounded w-50"></div>
          </li>
          <li>
            <div class="skeleton skeleton-text rounded w-50"></div>
          </li>
          <li>
            <div class="skeleton skeleton-text rounded w-75"></div>
          </li>
          <li>
            <div class="skeleton skeleton-text rounded w-75"></div>
          </li>
        </ul>
        <p>
          {{ t("default.marks") }}:
        </p>
        <div class="skeleton skeleton-text rounded w-100"></div>
      </div>
      <div class="col-12 col-md-4">
        <h5 class="text-center">{{ t("default.treasury") }}</h5>
        <div class="skeleton skeleton-h2 rounded w-100"></div>
        <div class="skeleton skeleton-text rounded w-25"></div>
        <hr class="d-none d-md-block" />
        <h5 class="text-center mt-1">{{ t('default.token_unlocked') }}</h5>
        <div class="skeleton skeleton-text rounded my-3 w-100"></div>
        <div class="skeleton skeleton-text rounded mb-3 w-100"></div>
        <div class="skeleton skeleton-text rounded mb-3 w-100"></div>
        <div class="skeleton skeleton-text rounded w-100"></div>
      </div>
      <div class="col-12 col-md-4">
        <h5 class="text-center">{{ t('default.market') }}</h5>
        <div class="skeleton skeleton-h2 rounded w-100"></div>
        <div class="skeleton skeleton-text rounded w-50"></div>
      </div>
    </div>
  </section>
</template>

<script>
import { useI18n } from "vue-i18n";
//import { ref } from 'vue'
//import {utils} from "near-api-js"

export default {
  components: {
  },
  setup() {
    const { t, n } = useI18n()
    return { t, n};
  },
  created() {
    
  },
};
</script>