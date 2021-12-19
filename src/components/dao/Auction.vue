<template>
  <MDBCard text="start">
    <MDBCardHeader>
        <h5 class="mb-0"><a :href="'https://app.skyward.finance/sale/' + auction.id" target="_blank">{{ auction.title }}</a></h5>
    </MDBCardHeader>
    <MDBCardBody>
      <MDBCardText>
        sdfasdf
      </MDBCardText>
    </MDBCardBody>
    <MDBCardFooter class="text-muted">
        <div class="row">
            <div class="col-6 text-start">{{ d(auction.start_time) }}</div>
            <div class="col-6 text-end">{{ d(auction.end_time) }}</div>
        </div>
        <div class="row">
        </div>
    </MDBCardFooter>
  </MDBCard>
</template>

<script>
import { Auction } from "@/services/skywardFinanceService/types"
import { MDBCard,
    MDBCardHeader,
    MDBCardBody,
    // MDBCardTitle,
    MDBCardText,
    MDBCardFooter
} from "mdb-vue-ui-kit";
import { useI18n } from "vue-i18n";

export default {
    components: {
      MDBCard,
      MDBCardHeader,
      MDBCardBody,
      // MDBCardTitle,
      MDBCardText,
      MDBCardFooter,
    },
    props: {
        auction: {
            type: Auction,
            required: true,
        },
    },
    setup() {
        const { t, n, d } = useI18n();

        return {
            t, n, d
        }
    },
    computed: {
    },
}
</script>