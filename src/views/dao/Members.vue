<template>
  <div class="container mb-2">
    <div class="row">
      <div class="col-12 col-md-6 col-lg-3">
        <div class="card text-start w-auto p-2 mb-2" style="width: 18rem">
          <div class="card-body">
            <h5 class="card-title">{{ t('default.council') }}</h5>
            <ul>
              <li v-for="(item, index) in dao.groups.council.wallets" :key="index">
                {{ item }}
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div class="col-12 col-md-6 col-lg-3">
        <div class="card text-start w-auto p-2 mb-2" style="width: 18rem">
          <div class="card-body">
            <h5 class="card-title">{{ t('default.community') }}</h5>
            <ul>
              <li v-for="(item, index) in dao.groups.community.wallets" :key="index">
                {{ item }}
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div class="col-12 col-md-6 col-lg-3">
        <div class="card text-start w-auto p-2 mb-2" style="width: 18rem">
          <div class="card-body">
            <h5 class="card-title">{{ t('default.investor') }}</h5>
            <ul>
              <li v-for="(item, index) in dao.groups.investor.wallets" :key="index">
                {{ item }}
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div class="col-12 col-md-6 col-lg-3">
        <div class="card text-start w-auto p-2 mb-2" style="width: 18rem">
          <div class="card-body">
            <h5 class="card-title">{{ t('default.public_sale') }}</h5>
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