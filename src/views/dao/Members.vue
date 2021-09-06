<template>
  <div class="container mb-2">
    <div class="row">
      <div class="col-3">
        <div class="card text-start w-auto p-2" style="width: 18rem">
          <div class="card-body">
            <h5 class="card-title">Rada</h5>
            <ul>
              <li>chaplin.near</li>
              <li>petrfilla.near</li>
              <li>radoslav.near</li>
            </ul>
          </div>
        </div>
      </div>
      <div class="col-3">
        <div class="card text-start w-auto p-2" style="width: 18rem">
          <div class="card-body">
            <h5 class="card-title">Komunita</h5>
            <ul>
              <li>petrstudynka.near</li>
              <li>jansladky.near</li>
            </ul>
          </div>
        </div>
      </div>
      <div class="col-3">
        <div class="card text-start w-auto p-2" style="width: 18rem">
          <div class="card-body">
            <h5 class="card-title">Investor</h5>
            <ul>
              <li>petrcastek.near</li>
            </ul>
          </div>
        </div>
      </div>
      <div class="col-3">
        <div class="card text-start w-auto p-2" style="width: 18rem">
          <div class="card-body">
            <h5 class="card-title">Volný prodej</h5>
            <ul></ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// import { MDBProgress, MDBProgressBar } from 'mdb-vue-ui-kit'
import { useI18n } from "vue-i18n";

export default {
  components: {},
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