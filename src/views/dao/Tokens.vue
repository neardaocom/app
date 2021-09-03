<template>
    <p></p>
</template>

<script>
// import { MDBProgress, MDBProgressBar } from 'mdb-vue-ui-kit'
import { useI18n } from 'vue-i18n'

export default {
    components: {
    },
    props: {
      dao: {
        type: Object,
        required: true
      }
    },
    setup() {
        const { t } = useI18n()
        return { t };
    },
}
</script>