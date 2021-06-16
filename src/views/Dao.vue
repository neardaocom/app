<template>
  <div class="container">
    <br>
    <router-link :to="{name: 'landing-page'}" :class="['btn','btn-primary']">Landing page</router-link>
    <hr>
    <h1>Working on it...</h1>
    <!--<p v-t="'default.message'"></p>-->
    <!--<p>{{ t('default.message') }}</p>-->
  </div>
</template>

<script>
import { useI18n } from 'vue-i18n'

export default {
  setup() {
    const { t } = useI18n()
    return { t }
  }
}

</script>