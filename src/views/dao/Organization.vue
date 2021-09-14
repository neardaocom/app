<template>
  <div class="container mb-2">
    <MDBCard>
      <MDBCardBody class="text-start">
        <MDBCardTitle>{{ t('default.description') }}</MDBCardTitle>
        <MDBCardText>
          <p>
          Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Etiam
          bibendum elit eget erat. Nulla turpis magna, cursus sit amet, suscipit
          a, interdum id, felis. In rutrum. Nulla est. In enim a arcu imperdiet
          malesuada. Ut enim ad minim veniam, quis nostrud exercitation ullamco
          laboris nisi ut aliquip ex ea commodo consequat. Aliquam id dolor. Ut
          enim ad minima veniam, quis nostrum exercitationem ullam corporis
          suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? Nullam
          lectus justo, vulputate eget mollis sed, tempor sed magna. Aliquam
          erat volutpat. Aliquam ornare wisi eu metus. Etiam posuere lacus quis
          dolor. Curabitur bibendum justo non orci. Integer malesuada.
        </p>
        <p>
          Proin mattis lacinia justo. Et harum quidem rerum facilis est et
          expedita distinctio. Class aptent taciti sociosqu ad litora torquent
          per conubia nostra, per inceptos hymenaeos. Nulla est. Integer tempor.
          Cras elementum. Morbi scelerisque luctus velit. Lorem ipsum dolor sit
          amet, consectetuer adipiscing elit. Quisque tincidunt scelerisque
          libero. Nulla turpis magna, cursus sit amet, suscipit a, interdum id,
          felis. Itaque earum rerum hic tenetur a sapiente delectus, ut aut
          reiciendis voluptatibus maiores alias consequatur aut perferendis
          doloribus asperiores repellat. Sed elit dui, pellentesque a, faucibus
          vel, interdum nec, diam.
        </p>
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