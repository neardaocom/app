<template>
  <div class="container mb-2">
    <MDBCard>
      <MDBCardBody class="text-start">
        <MDBCardTitle>{{ t('default.description') }}</MDBCardTitle>
        <MDBCardText>
          {{ dao.description }}
        </MDBCardText>
      </MDBCardBody>
    </MDBCard>
  </div>
</template>

<script>
import { MDBCard, MDBCardBody, MDBCardTitle, MDBCardText } from 'mdb-vue-ui-kit'
import { useI18n } from "vue-i18n";

export default {
  components: { MDBCard, MDBCardBody, MDBCardTitle, MDBCardText },
  props: {
    dao: {
      type: Object,
      required: true,
    },
  },
  setup() {
    const { t } = useI18n();
    return { t };
  },
};
</script>