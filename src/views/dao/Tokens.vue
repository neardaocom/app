<template>
  <div class="container mb-2">
    <div class="row">
      <div class="col-12">
        <div class="card text-start">
          <div class="card-body">
            <h5 class="card-title">Governance tokeny</h5>
            <table class="table">
              <thead>
                <tr>
                  <th></th>
                  <th>Vlastněné</th>
                  <th>Volné</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <th scope="col">Rada</th>
                  <td>100 000</td>
                  <td>300 000</td>
                </tr>
                <tr>
                  <th scope="col">Komunita</th>
                  <td>0</td>
                  <td>200 000</td>
                </tr>
                <tr>
                  <th scope="col">Investor</th>
                  <td>40 000</td>
                  <td>110 000</td>
                </tr>
                <tr>
                  <th scope="col">Volný prodej</th>
                  <td>145 432</td>
                  <td>4 568</td>
                </tr>
                <tr>
                  <td></td>
                  <td>285 432</td>
                  <td>664 568</td>
                </tr>
              </tbody>
            </table>
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