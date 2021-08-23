<template>
  <header>
    <Navigation></Navigation>
  </header>

  <main>
  </main>

  <Footer></Footer>
</template>

<script>
import Navigation from '@/views/dao/Navigation.vue'
import Footer from '@/views/dao/Footer.vue'
import { useI18n } from 'vue-i18n'

export default {
  components: {
    Navigation, Footer
  },
  setup() {
    const { t } = useI18n()
    return { t }
  }
}
</script>