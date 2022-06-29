<template>
  <MDBCard text="start">
    <MDBCardHeader>
        <img class="me-1" :src="'/img/market/skywardFinance.jpg'" alt="" style="width: 24px; vertical-align: top"/> Skyward Finance
    </MDBCardHeader>
    <MDBCardBody>
      <MDBCardTitle>
        <a :href="'https://app.skyward.finance/sale/' + auction.id" target="_blank">{{ auction.title }}</a>
      </MDBCardTitle>
      <MDBCardTitle subtitle class="mt-2 text-muted">{{ t('auction_total_paying') }}</MDBCardTitle>
      <h3>{{ auction.in_token.account_id }}</h3>
      <dl class="row">
        <dt class="col-3">{{ t('auction_paid') }}:</dt>
        <dd class="col-3">{{ n(auction.in_token.paid) }}</dd>
        <dt class="col-3">{{ t('auction_remaining') }}:</dt>
        <dd class="col-3">{{ n(auction.in_token.remaining) }}</dd>
      </dl>
      <hr class="mt-0 mb-0"/>
      <p class="text-center mb-0">
          <MDBIcon icon="angle-double-down" iconStyle="fas" />
      </p>
      <hr class="mt-0 mb-3"/>
      <MDBCardTitle subtitle class="mt-2 text-muted">{{ t('auction_total_receiving') }}</MDBCardTitle>
      <h3>{{ auction.out_tokens[0].account_id }}</h3>
      <dl class="row mb-0">
        <dt class="col-3">{{ t('auction_distributed') }}:</dt>
        <dd class="col-3">{{ n(auction.out_tokens[0].distributed) }}</dd>
        <dt class="col-3">{{ t('auction_remaining') }}:</dt>
        <dd class="col-3">{{ n(auction.out_tokens[0].remaining) }}</dd>
      </dl>
    </MDBCardBody>
    <MDBCardFooter class="text-muted">
        <div class="row">
            <div class="col-6 text-start">{{ d(auction.start_time) }} {{ startTime }}</div>
            <div class="col-6 text-end">{{ d(auction.end_time) }} {{ endTime }}</div>
        </div>
        <div class="row">
            <div class="col-12">
                <MDBProgress
                    :height="16" class="rounded"
                >
                    <MDBProgressBar :value="progress" bg="primary">{{ n(progress) }}%</MDBProgressBar>
                </MDBProgress>
            </div>
        </div>
    </MDBCardFooter>
  </MDBCard>
</template>

<script>
import { ref, toRefs, onMounted, onUnmounted } from "vue"
import Auction from '@/models/auction/Helper';
import DateHelper from '@/models/utils/DateHelper'
import { MDBCard,
    MDBCardHeader,
    MDBCardBody,
    MDBCardTitle,
    //MDBCardText,
    MDBCardFooter,
    MDBIcon,
    MDBProgress, MDBProgressBar,
} from "mdb-vue-ui-kit";
import { useI18n } from "vue-i18n";

export default {
    components: {
      MDBCard,
      MDBCardHeader,
      MDBCardBody,
      MDBCardTitle,
      //MDBCardText,
      MDBCardFooter,
      MDBIcon,
      MDBProgress, MDBProgressBar,
    },
    props: {
        auction: {
            type: Object,
            required: true,
        },
    },
    setup(props) {
        const { auction } = toRefs(props)
        const { t, n, d } = useI18n();

        const progress = ref(null)
        const progressCounter = () => {
            progress.value = Auction.getProgress(auction.value.start_time, auction.value.end_time)
            // console.log('Progress: ' + progress.value)
        }
        const progressInterval = ref(null);

        progressCounter()

        onMounted(() => {
            progressInterval.value = setInterval(progressCounter, 5_000)
        })

        onUnmounted(() => {
            clearInterval(progressInterval.value)
        })

        return {
            t, n, d,
            progress, progressCounter, progressInterval,
        }
    },
    computed: {
        startTime() {
            return DateHelper.toTimeString(this.auction.start_time)
        },
        endTime() {
            return DateHelper.toTimeString(this.auction.end_time)
        },
    },
}
</script>