<template>
  <div class="container mb-2">
    <div class="row">
      <div class="col-12 col-md-6 col-lg-4 mb-4">
        <DaoInformation/>
      </div>
      <div class="col-12 col-md-6 col-lg-4 mb-4">
        <DaoMembers/>
      </div>
      <!-- BEGIN: council unlocking cashflow -->
      <div v-if="council" class="col-12 col-md-6 mb-4">
        <div class="card text-start w-auto p-2" >
          <div class="card-body">
            <h5 class="">
              <i class="bi bi-bar-chart text-gradient-180 me-1"/>
              {{ t("default.council_unlocking_token") }}
            </h5>
            <ChartCouncilUnlocking :group="council"/>
          </div>
        </div>
      </div>
      <!-- END: council unlocking cashflow -->
    </div>
  </div>
</template>

<script>
import { useI18n } from "vue-i18n";
import ChartCouncilUnlocking from '@/components/dao/about/ChartCouncilUnlocking.vue';
import { inject } from "vue"
import DaoInformation from "@/components/dao/about/DaoInformation.vue"
import DaoMembers from "@/components/dao/about/DaoMembers.vue"
import { useGroups } from '@/hooks/dao';

export default {
  components: {
    ChartCouncilUnlocking,
    DaoInformation,
    DaoMembers
  },

  setup() {
    const dao = inject('dao')
    const { t, n } = useI18n()

    const { council } = useGroups(dao.value)

    return { dao, t, n, council };
  },
};
</script>