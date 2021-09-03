<template>
  <section class="text-center border-bottom mb-2">
    <div class="row d-flex justify-content-center">
      <div class="col-lg-6">
        <h1>{{ dao.name }}</h1>
        <p class="text-muted">{{ dao.about }}</p>
      </div>
    </div>
  </section>
  <section class="mb-0 text-start">
    <div class="row">
      <div class="col-12 col-md-4">
        <ul class="list-unstyled text-muted">
          <li>
            <i class="fas fa-home fa-fw me-3 mb-3"></i>
            <a class="text-reset font-weight-bold" href="">{{ dao.address }}</a>
          </li>
          <li>
            <i class="fas fa-wallet fa-fw me-3 mb-3"></i>
            <a
              class="text-reset font-weight-bold"
              :href="'https://explorer.near.org/accounts/' + dao.wallet"
              >{{ t("default.wallet") }}</a
            >
          </li>
          <li>
            <i class="fas fa-globe fa-fw me-3 mb-3"></i
            ><a class="text-reset font-weight-bold" :href="dao.web">{{
              dao.domain
            }}</a>
          </li>
          <li>
            <i class="fas fa-money-bill-wave-alt fa-fw me-3 mb-3"></i>
            <span class="text-reset font-weight-bold">{{ n(dao.token) }}</span>
            POD
          </li>
          <li>
            <i class="fas fa-users fa-fw me-3 mb-3"></i
            ><strong>{{ t("default.council") }}</strong>
            {{ dao.groups.council.amount || "0" }}% |
            <strong>{{ t("default.community") }}</strong>
            {{ dao.groups.community.amount || "0" }}%
          </li>
          <li>
            <i class="fas fa-chart-line fa-fw me-3 mb-3"></i
            ><strong>{{ t("default.investor") }}</strong>
            {{ dao.groups.investor.amount || "0" }}% |
            <strong>{{ t("default.public_sale") }}</strong>
            {{ dao.groups.public_sale.amount || "0" }}%
          </li>
        </ul>
        <p>
          {{ t("default.marks") }}:<br />
          <span
            class="badge bg-info"
            v-for="(tag, index) in dao.tags"
            :key="index"
            >{{ tag }}</span
          >
        </p>
      </div>
      <div class="col-12 col-md-4">
        <h5 class="text-center">{{ t("default.treasury") }}</h5>
        <h2>
          {{ n(dao.treasury.near) || '-' }} <span title="NEAR">Ⓝ </span>
          <BadgePercent :amount="dao.treasury.w_delta"/>
        </h2>
        <p>≈ <NumberFormatter :amount="dao.treasury.currency_amount"/> {{ t('default.currency_' + dao.treasury.currency) }}</p>
        <hr class="d-none d-md-block" />
        <h5 class="text-center mt-1">{{ t('default.token_unlocked') }}</h5>
        <ul class="list-unstyled text-muted">
          <li class="mb-2">
            <strong>{{ t('default.council') }}</strong> {{ dao.token_unlocked.council }}%
            <MDBProgress :height="5">
              <MDBProgressBar :value="dao.token_unlocked.council" bg="success" />
            </MDBProgress>
          </li>
          <li class="mb-2">
            <strong>{{ t('default.community') }}</strong> {{ dao.token_unlocked.community }}%
            <MDBProgress :height="5">
              <MDBProgressBar :value="dao.token_unlocked.community" bg="primary" />
            </MDBProgress>
          </li>
          <li class="mb-2">
            <strong>{{ t('default.investor') }}</strong> {{ dao.token_unlocked.investor }}%
            <MDBProgress :height="5">
              <MDBProgressBar :value="dao.token_unlocked.investor" bg="warning" />
            </MDBProgress>
          </li>
          <li>
            <strong>{{ t('default.public_sale') }}</strong> {{ dao.token_unlocked.public_sale }}%
            <MDBProgress :height="5">
              <MDBProgressBar :value="dao.token_unlocked.public_sale" bg="warning" />
            </MDBProgress>
          </li>
        </ul>
      </div>
      <div class="col-12 col-md-4">
        <h5 class="text-center mt-1">{{ t('default.market') }}</h5>
        <h2>
          <NumberFormatter :amount="dao.market.near"/> Ⓝ
          <BadgePercent :amount="dao.market.w_delta"/>
        </h2>
        <p>≈ <NumberFormatter :amount="dao.market.eth"/> ETH | <NumberFormatter :amount="dao.market.btc"/> BTC | <NumberFormatter :amount="dao.market.currency_amount"/> {{ t('default.currency_' + dao.treasury.currency) }}</p>
        <!--<h5 class="text-center">Government tokeny</h5>
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
            </table>-->
        <!--<h5 class="text-center">Můj podíl</h5>
            <h2>56 432 <small>POD</small> <span class="badge bg-info">≈ 6,43%</span></h2>
            <h4>≈ 22 066 580,00 Kč</h4>
            <div class="btn-group" role="group">
            <button type="button" class="btn btn-primary"><i class="fas fa-shopping-cart"></i> Koupit</button>
            <button type="button" class="btn btn-warning"><i class="fas fa-money-bill-wave"></i> Prodat</button>
            </div>-->
      </div>
    </div>
  </section>
</template>

<script>
import { useI18n } from "vue-i18n";
import {MDBProgress, MDBProgressBar} from "mdb-vue-ui-kit";
import NumberFormatter from "@/views/helpers/NumberFormatter.vue"
import BadgePercent from '@/views/helpers/BadgePercent.vue';

export default {
  components: {
    MDBProgress, MDBProgressBar, NumberFormatter, BadgePercent
  },
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