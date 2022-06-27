<template>
  <div class="container mb-2">
    <div class="row">
      <div class="col-12 col-md-8">
        <div class="card text-start">
          <div class="card-body">
            <h5 class="card-title">{{ t('governance_token') }}</h5>
            <table class="table">
              <tbody>
                <tr>
                  <th scope="col">{{ t('amount') }}</th>
                  <td>{{ n(dao.token) }}</td>
                  <td></td>
                </tr>
                <tr>
                  <th scope="col">{{ t('released') }}</th>
                  <td>{{ n(dao.token_released) }}</td>
                  <td>{{ releasedPercent }}%</td>
                </tr>
                <tr>
                  <th scope="col">{{ t('owned') }}</th>
                  <td>{{ n((owned)) }}</td>
                  <td>{{ ownedPercent }}%</td>
                </tr>
                <tr>
                  <th scope="col">{{ t('free') }}</th>
                  <td>{{ n(dao.token_free) }}</td>
                  <td>{{ freePercent }}%</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <div v-if="dao.groups.council.amount > 0" class="col-12 col-md-8">
        <div class="card text-start mt-2">
          <div class="card-body">
            <h5 class="card-title">{{ t('council') }}</h5>
            <table class="table">
              <tbody>
                <tr>
                  <th>{{ t('tokens') }}</th>
                  <td>{{ n(councilAmount) }}</td>
                  <td>{{ dao.groups.council.amount }}%</td>
                </tr>
                <tr v-for="(account, index) in dao.groups.council.wallets" :key="index">
                  <td class="ms-2">{{ account }}</td>
                  <td>{{ n(dao.token_holders[account]) }}</td>
                  <td>{{ getPercent(dao.token_holders[account], councilAmount) }}%</td>
                </tr>
                <tr v-for="(value, account) in dao.token_holders" :key="account">
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <div v-if="dao.groups.community.amount > 0" class="col-12 col-md-8">
        <div class="card text-start mt-2">
          <div class="card-body">
            <h5 class="card-title">{{ t('community') }}</h5>
            <table class="table">
              <tbody>
                <tr>
                  <th>{{ t('tokens') }}</th>
                  <td>{{ n(communityAmount) }}</td>
                  <td>{{ dao.groups.community.amount }}%</td>
                </tr>
                <tr v-for="(account, index) in dao.groups.community.wallets" :key="index">
                  <td class="ms-2">{{ account }}</td>
                  <td>{{ n(dao.token_holders[account]) }}</td>
                  <td>{{ getPercent(dao.token_holders[account], communityAmount) }}%</td>
                </tr>
                <tr v-for="(value, account) in dao.token_holders" :key="account">
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <div v-if="dao.groups.investor.amount > 0" class="col-12 col-md-8">
        <div class="card text-start mt-2">
          <div class="card-body">
            <h5 class="card-title">{{ t('investor') }}</h5>
            <table class="table">
              <tbody>
                <tr>
                  <th>{{ t('tokens') }}</th>
                  <td>{{ n(investorAmount) }}</td>
                  <td>{{ dao.groups.investor.amount }}%</td>
                </tr>
                <tr v-for="(account, index) in dao.groups.investor.wallets" :key="index">
                  <td class="ms-2">{{ account }}</td>
                  <td>{{ n(dao.token_holders[account]) }}</td>
                  <td>{{ getPercent(dao.token_holders[account], investorAmount) }}%</td>
                </tr>
                <tr v-for="(value, account) in dao.token_holders" :key="account">
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <div v-if="dao.groups.public_sale.amount > 0" class="col-12 col-md-8">
        <div class="card text-start mt-2">
          <div class="card-body">
            <h5 class="card-title">{{ t('public_sale') }}</h5>
            <table class="table">
              <tbody>
                <tr>
                  <th>{{ t('tokens') }}</th>
                  <td>{{ n(publicSaleAmount) }}</td>
                  <td>{{ dao.groups.public_sale.amount }}%</td>
                </tr>
                <tr v-for="(account, index) in dao.groups.public_sale.wallets" :key="index">
                  <td class="ms-2">{{ account }}</td>
                  <td>{{ n(dao.token_holders[account]) }}</td>
                  <td>{{ getPercent(dao.token_holders[account], publicSaleAmount) }}%</td>
                </tr>
                <tr v-for="(value, account) in dao.token_holders" :key="account">
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
import Decimal from "decimal.js";

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
  computed: {
    owned() {
      return this.dao.token_released - this.dao.token_free ?? 0
    },
    releasedPercent() {
      return new Decimal(this.dao.token_released).div(this.dao.token).mul(100).round().toString()
    },
    ownedPercent() {
      return new Decimal(this.owned).div(this.dao.token).mul(100).round().toString()
    },
    freePercent() {
      return new Decimal(this.dao.token_free).div(this.dao.token).mul(100).round().toString()
    },
    councilAmount() {
      return new Decimal(this.dao.token).div(100).mul(this.dao.groups.council.amount).round().toNumber()
    },
    communityAmount() {
      return new Decimal(this.dao.token).div(100).mul(this.dao.groups.community.amount).round().toNumber()
    },
    investorAmount() {
      return new Decimal(this.dao.token).div(100).mul(this.dao.groups.investor.amount).round().toNumber()
    },
    publicSaleAmount() {
      return new Decimal(this.dao.token).div(100).mul(this.dao.groups.public_sale.amount).round().toNumber()
    }
  },
  methods: {
    getPercent(part, base) {
      return new Decimal(part).div(base).mul(10000).round().div(100).toNumber()
    }
  }
};
</script>