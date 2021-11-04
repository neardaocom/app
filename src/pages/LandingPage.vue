<template>
  <main>
    <div class="d-flex justify-content-center align-items-center" style="min-height: 200px;">
      <MDBSpinner>
        <span class="sr-only">{{ t('default.loading') }}...</span>
      </MDBSpinner>
    </div>
  </main>
</template>

<script>
import { MDBSpinner } from "mdb-vue-ui-kit";
import { useI18n } from 'vue-i18n'

export default {
  name: 'Home',
  components: {
    MDBSpinner
  },
  setup() {
    const { t } = useI18n();
    const daoDefault = process.env.VUE_APP_DAO_DEFAULT
    return { t, daoDefault }
  },
  created() {
  },
  mounted() {
    this.$router.push({ name: 'dao', params: { id: this.daoDefault }})
  }
}
</script>