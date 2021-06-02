<template>
  <div class="about">
    <h1>This is an about page</h1>
    <p v-t="'default.message'"></p>
    <p>{{ t('default.message') }}</p>
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