<template>
  <div class="container mb-2">
    <AuctionList
      :scenario="'active'"
      :dao="dao"
    />
  </div>
</template>

<script>
// import { MDBInput, MDBIcon, MDBSelect } from "mdb-vue-ui-kit";
// import { ref } from "vue"
// import { reactive } from "@vue/reactivity"
import AuctionList from "@/components/market/skywardFinance/List.vue"
import { useI18n } from "vue-i18n"

export default {
  components: {
    AuctionList
  },
  props: {
    dao: {
      type: Object,
      required: true,
    },
    accountId: {
      type: String,
      required: true,
    },
  },
  setup() {
    //const { dao, accountId } = toRefs(props)
    const { t } = useI18n();

    return { t };
  },
  computed: {
  },
  methods: {
  }
};
</script>