<template>
  <div class="container mb-2">
    <div class="row">
      <div class="col-12">
        <div class="card text-start">
          <div class="card-body">
            <h5 class="card-title">{{ t('default.governance_token') }}</h5>
            <table class="table">
              <thead>
                <tr>
                  <th></th>
                  <th>{{ t('default.amount') }}</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <th scope="col">{{ t('default.released') }}</th>
                  <td>{{ n(dao.token_released) }}</td>
                </tr>
                <tr>
                  <th scope="col">{{ t('default.owned') }}</th>
                  <td>{{ n(dao.token_released - dao.token_free) }}</td>
                </tr>
                <tr>
                  <th scope="col">{{ t('default.free') }}</th>
                  <td>{{ n(dao.token_free) }}</td>
                </tr>
                <tr v-for="(value, account) in dao.token_holders" :key="account">
                  <td>{{ account }}</td>
                  <td>{{ n(value) }}</td>
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
    const { t, n } = useI18n();
    return { t, n };
  },
};
</script>